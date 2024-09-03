import { BuildOptions, Model, Optional } from 'sequelize';

export type ModelStatic = typeof Model & {
  new(values?: Optional<never, string>, options?: BuildOptions): Model;
}
