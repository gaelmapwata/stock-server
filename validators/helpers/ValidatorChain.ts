import { ExpressValidation } from '../../types/validator';

export default class ValidatorChain {
  private validations: ExpressValidation = {};

  pushValidation(validation: ExpressValidation): void {
    this.validations = { ...this.validations, ...validation };
  }

  getValidations(): ExpressValidation {
    return this.validations;
  }
}
