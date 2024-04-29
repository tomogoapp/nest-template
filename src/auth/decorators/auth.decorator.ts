import { applyDecorators, UseGuards } from '@nestjs/common';
import { validRoles } from '../interface';
import { RoleProctected } from '.';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

export function Auth(...roles: validRoles[]) {
  return applyDecorators(
    RoleProctected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}