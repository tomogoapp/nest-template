import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Console } from 'console';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-proctected/role-proctected.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
/* The UserRoleGuard class in TypeScript implements the CanActivate interface and checks for valid
roles based on metadata reflected from the handler in the context. */
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ){  

  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler())

    if( !validRoles ) return true
    if( validRoles.length === 0 ) return true

    const req = context.switchToHttp().getRequest()
    const user = req.user as User

    if( !user ){
      throw new BadRequestException('user dont found')
    }

    for( const role of user.roles){
      if(validRoles.includes(role)){
        return true
      }
    }

    throw new ForbiddenException(`user ${user.fullName} need a valid role`)
  }
}
