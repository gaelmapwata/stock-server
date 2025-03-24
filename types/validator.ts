import { OptionalOptions } from 'express-validator/lib/chain';
import { IsFloatOptions, IsIntOptions } from 'express-validator/lib/options';

type ExpressValidationCustomOptionFunc =
  (value: (string | number), { req }: {req: unknown}) => (Promise<void> | void)

export type ExpressValidationCustomOptions = {
  options : ExpressValidationCustomOptionFunc
}

export type ExpressValidation =
  Partial<Record<'isFloat', { errorMessage: string, options?: IsFloatOptions }>> &
  Partial<Record<'notEmpty' | 'isDecimal' | 'isString' | 'isArray' | 'exists' | 'isEmail' | 'isMobilePhone', { errorMessage: string }>> &
  Partial<Record<'custom', ExpressValidationCustomOptions>> &
  Partial<Record<'optional', boolean | { options: OptionalOptions }>> &
  Partial<Record<'isInt', boolean | { errorMessage: string, options?: IsIntOptions }>> &
  Partial<Record<'isIn', { errorMessage: string, options: Array<Array<string | number>> }>>
