import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY, RoleType } from '../constants/role.constant';

export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);
