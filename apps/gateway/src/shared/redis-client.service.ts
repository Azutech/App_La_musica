import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, retry, timeout } from 'rxjs';

@Injectable()
export class RedisClientService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisClientService.name);
  private reconnectInterval: NodeJS.Timeout | null = null;
  private connected = false;

  constructor(private readonly client: ClientProxy) {}

  async onModuleInit() {
    await this.connect();

    // health monitor: every 10s ping Redis microservice
    this.reconnectInterval = setInterval(async () => {
      try {
        await firstValueFrom(this.client.send({ cmd: 'ping' }, {}).pipe(timeout(2000)));
        this.connected = true;
      } catch {
        this.connected = false;
        this.logger.warn('Redis connection lost, reconnecting...');
        await this.connect();
      }
    }, 10000);
  }

  async onModuleDestroy() {
    if (this.reconnectInterval) clearInterval(this.reconnectInterval);
  }

  private async connect() {
    try {
      await this.client.connect();
      this.connected = true;
      this.logger.log('✅ Connected to Redis microservice');
    } catch (err) {
      this.connected = false;
      this.logger.error(`❌ Redis connection failed: ${err.message}`);
    }
  }

  async send<TInput, TOutput>(
    cmd: string,
    payload: TInput,
    options: { timeoutMs?: number; retries?: number } = {},
  ): Promise<TOutput> {
    const { timeoutMs = 10000, retries = 1 } = options;

    try {
      const response = await firstValueFrom(
        this.client.send<TOutput, TInput>({ cmd }, payload).pipe(
          timeout(timeoutMs),
          retry(retries),
          catchError((err) => {
            this.logger.error(`Redis command "${cmd}" failed: ${err.message}`);
            throw new RpcException(err.response || 'Microservice unavailable');
          }),
        ),
      );
      return response;
    } catch (err) {
      if (err instanceof RpcException) throw err;
      this.logger.error(`Critical Redis error for "${cmd}"`, err);
      throw new RpcException('Internal Redis error');
    }
  }
}
