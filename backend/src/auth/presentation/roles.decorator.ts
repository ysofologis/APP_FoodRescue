import { SetMetadata } from '@nestjs/common';
import { Role } from '../domain/value-objects/role.vo';

export const ROLES_KEY = 'roles';

/**
 * Mark a controller route as requiring one of the given roles. Apply
 * alongside @UseGuards(JwtAuthGuard, RolesGuard).
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);