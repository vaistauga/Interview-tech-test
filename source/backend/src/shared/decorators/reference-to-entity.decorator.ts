import { Transform } from 'class-transformer';
import { referenceToEntity } from '../helpers';

export const ReferenceToEntity = (): PropertyDecorator => {
  return Transform(({ value }) => {
    if (!!value && !value.isInitialized()) {
      return { id: value.id };
    }

    return referenceToEntity(value);
  });
};
