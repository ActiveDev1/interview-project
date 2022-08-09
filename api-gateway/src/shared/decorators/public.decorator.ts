import { SetMetadata } from '@nestjs/common'

/**
 * Decorator that ignore the guards of the scope of the controller or method.
 */
export const IS_PUBLIC = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC, true)
