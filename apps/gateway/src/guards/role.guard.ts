import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoles } from 'src/apis/auth/enum/utils/enum.utils';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private refletor: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.refletor.getAllAndOverride<UserRoles[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    console.log('Required Roles:', requiredRoles);

    // allow all routes with no Role decorator
    if (!requiredRoles) {
      return true;
    }
    // get the request object
    const req = context.switchToHttp().getRequest();

    console.log('Request User:', req.user);

    console.log('User RoleX:', req?.user?.role);

    if (!req?.user?.role) {
      return false;
    }

    return requiredRoles.some((role) => role === req.user?.role);
  }
}
