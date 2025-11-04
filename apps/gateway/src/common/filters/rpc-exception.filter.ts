// gateway/src/common/filters/rpc-to-http.filter.ts
import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcToHttpExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (typeof rpcError === 'object' && rpcError !== null) {
      status = rpcError['statusCode'] || rpcError['status'] || status;
      message = rpcError['message'] || message;
    } else if (typeof rpcError === 'string') {
      message = rpcError;
    }

    const responseBody = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(responseBody);

    // Return Observable to satisfy interface
    return throwError(() => responseBody);
  }
}
