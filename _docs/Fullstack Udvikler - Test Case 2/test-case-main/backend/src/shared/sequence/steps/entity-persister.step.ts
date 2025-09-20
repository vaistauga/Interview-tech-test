import { EntityManager } from '@mikro-orm/core';
import { EntityClass } from '@mikro-orm/core/typings';
import { Injectable, Scope } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { AbstractStep } from '../abstract.step';

@Injectable()
export class EntityPersisterStep extends AbstractStep {
  constructor(
    protected readonly em: EntityManager,
    protected readonly eventBus: EventBus,
  ) {
    super();
  }

  public async process(payload: EntityClass<any>): Promise<any> {
    this.em.persist(payload);

    return payload;
  }

  public async finalize(): Promise<void> {
    await this.em.flush();
    this.em.clear();
  }
}
