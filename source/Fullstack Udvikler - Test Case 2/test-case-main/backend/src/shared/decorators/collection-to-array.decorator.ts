import { Transform } from 'class-transformer';
import { collectionToItems } from '../helpers';

export const CollectionToArray = (): PropertyDecorator => {
  return Transform(({ value }) => collectionToItems(value));
};
