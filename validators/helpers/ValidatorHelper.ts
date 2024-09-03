import { OptionalOptions } from 'express-validator/src/chain';
import { IsFloatOptions } from 'express-validator/src/options';
import { ModelStatic } from '../../types/model';
import { ExpressValidation, ExpressValidationCustomOptions } from '../../types/validator';
import ValidatorChain from './ValidatorChain';
import { Request } from '../../types/expressOverride';

export default class ValidatorHelper {
  private field: string;

  private validatorChain: ValidatorChain;

  constructor(field: string) {
    this.field = field;
    this.validatorChain = new ValidatorChain();
  }

  optional(options?: OptionalOptions): ValidatorHelper {
    this.validatorChain
      .pushValidation({
        optional: options ? { options } : true,
      });
    return this;
  }

  notEmpty(): ValidatorHelper {
    this.validatorChain
      .pushValidation({
        notEmpty: {
          errorMessage: `Le champ "${this.field}" est obligatoire`,
        },
      });
    return this;
  }

  isDecimal(): ValidatorHelper {
    this.validatorChain
      .pushValidation({
        isDecimal: {
          errorMessage: `Le champ "${this.field}" doit etre un nombre decimal correct`,
        },
      });
    return this;
  }

  isFloat(options: IsFloatOptions = {}): ValidatorHelper {
    this.validatorChain
      .pushValidation({
        isFloat: {
          errorMessage: `Le champ "${this.field}" doit etre un nombre decimal correct`,
          options,
        },
      });
    return this;
  }

  isString(): ValidatorHelper {
    this.validatorChain
      .pushValidation({
        isString: {
          errorMessage: `Le champ "${this.field}" doit être une chaîne de caractère valide`,
        },
      });
    return this;
  }

  isInt(): ValidatorHelper {
    this.validatorChain
      .pushValidation({ isInt: true });
    return this;
  }

  isEmail(): ValidatorHelper {
    this.validatorChain
      .pushValidation({
        isEmail: {
          errorMessage: `Le champ "${this.field}" doit être un email valide`,
        },
      });
    return this;
  }

  isMobilePhone(): ValidatorHelper {
    this.validatorChain
      .pushValidation({
        isMobilePhone: {
          errorMessage: `Le champ "${this.field}" doit être un numéro de telephone valide`,
        },
      });
    return this;
  }

  isArray(): ValidatorHelper {
    this.validatorChain
      .pushValidation({
        isArray: {
          errorMessage: `Le champ "${this.field}" doit être un tableau`,
        },
      });
    return this;
  }

  isDate(): ValidatorHelper {
    this.validatorChain
      .pushValidation({
        isString: {
          errorMessage: `Le champ "${this.field}" doit être une date valide`,
        },
      });
    return this;
  }

  exists(): ValidatorHelper {
    this.validatorChain
      .pushValidation({
        exists: {
          errorMessage: `Le champ "${this.field}" est obligatoire`,
        },
      });
    return this;
  }

  isIn(authorizedValues: Array<string | number>): ValidatorHelper {
    this.validatorChain
      .pushValidation({
        isIn: {
          errorMessage: `Le champ "${this.field}" doit être une des valeurs suivantes: ${authorizedValues.join(', ')}`,
          options: [authorizedValues],
        },
      });
    return this;
  }

  existsInDB(model: ModelStatic, column: string): ValidatorHelper {
    this.validatorChain
      .pushValidation({
        custom: this.existInDBGeneratorFunc(model, column),
      });
    return this;
  }

  // eslint-disable-next-line max-len
  private existInDBGeneratorFunc(model: ModelStatic, column: string) : ExpressValidationCustomOptions {
    return {
      options: async (value: string | number) => {
        if (value !== null && !await model.findOne({ where: { [column]: value } })) {
          throw new Error(`L'enregistrement correspondant pour "${this.field}" n'a pas été retrouvé`);
        }
      },
    };
  }

  notExistsInDB(model: ModelStatic, column: string): ValidatorHelper {
    this.validatorChain
      .pushValidation({
        custom: this.notExistInDBGeneratorFunc(model, column),
      });
    return this;
  }

  // eslint-disable-next-line max-len
  private notExistInDBGeneratorFunc(model: ModelStatic, column: string) : ExpressValidationCustomOptions {
    return {
      options: async (value: string | number) => {
        const item = await model.findOne({ where: { [column]: value }, paranoid: false });
        const itemTyped = (item as typeof item & { deletedAt ?: string });

        if (item && !itemTyped.deletedAt) {
          throw new Error(`Un enregistrement ayant cette valeur pour "${this.field}" existe déjà`);
        } else if (item) {
          throw new Error(`Un enregistrement ayant cette valeur pour "${this.field}" a déjà existé`);
        }
      },
    };
  }

  notExistsInDBIfUpdated(
    model: ModelStatic,
    column: string,
    entityToUpdateKey = 'id',
    entityToUpdateWhereKey: 'params' | 'body' | 'query' = 'params',
  ): ValidatorHelper {
    this.validatorChain
      .pushValidation({
        custom: this.notExistInDBIfUpdatedGeneratorFunc(
          model,
          column,
          entityToUpdateKey,
          entityToUpdateWhereKey,
        ),
      });
    return this;
  }

  // eslint-disable-next-line max-len
  private notExistInDBIfUpdatedGeneratorFunc(
    model: ModelStatic,
    column: string,
    entityToUpdateKey = 'id',
    entityToUpdateWhereKey: 'params' | 'body' | 'query' = 'params',
  ) : ExpressValidationCustomOptions {
    return {
      options: async (value: string | number, { req }: { req: unknown }) => {
        const key = (req as Request)[entityToUpdateWhereKey][entityToUpdateKey];
        const entity = await model.findByPk(key);

        if (entity && entity.dataValues[column] !== value) {
          const item = await model.findOne({ where: { [column]: value }, paranoid: false });
          const itemTyped = (item as typeof item & { deletedAt ?: string });

          if (item && !itemTyped.deletedAt) {
            throw new Error(`Un enregistrement ayant cette valeur pour "${this.field}" existe déjà`);
          } else if (item) {
            throw new Error(`Un enregistrement ayant cette valeur pour "${this.field}" a déjà existé`);
          }
        } else if (!entity) {
          throw new Error('Cet enregistrement n\'a pas été rétrouvé');
        }
      },
    };
  }

  custom(customOptions: ExpressValidationCustomOptions): ValidatorHelper {
    this.validatorChain
      .pushValidation({
        custom: customOptions,
      });
    return this;
  }

  get(): ExpressValidation {
    return this.validatorChain.getValidations();
  }
}
