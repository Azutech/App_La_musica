// src/common/filters/rpc-exception.filter.ts
import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';

@Catch()
export class AllRpcExceptionsFilter implements RpcExceptionFilter<any> {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    // you can shape the payload here
    return throwError(() => exception);
  }
}