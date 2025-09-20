import {
  AnyEntity,
  ChangeSet,
  Collection,
  Reference,
  wrap,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

export const collectionToItems = <T extends object>(
  collection: Collection<T>,
): T[] => (collection.isInitialized() ? collection.getItems() : []);

export const referenceToEntity = <T extends object>(
  reference: Reference<T>,
): T | null =>
  reference && reference.isInitialized() ? reference.getEntity() : null;

export const computeChanges = (
  em: EntityManager,
): [ChangeSet<AnyEntity>[], any[]] => {
  const unitOfWork = em.getUnitOfWork();
  unitOfWork.computeChangeSets();

  return [
    unitOfWork.getChangeSets(),
    [...Array.from(unitOfWork.getRemoveStack())]
      .map((v) => wrap(v))
      .filter((v) => !!v)
      .map((v) => ({
        ...v.toObject(),
        classInstance: v.toReference().getEntity().constructor.name,
      })),
  ];
};
