import { SetMetadata } from '@nestjs/common';
import { validRoles } from 'src/auth/interface';

export const META_ROLES = 'roles'

export const RoleProctected = (...args: validRoles[]) => SetMetadata(META_ROLES, args);
