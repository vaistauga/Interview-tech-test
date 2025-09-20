import { EntityManager } from '@mikro-orm/core';
import { Injectable, Scope } from '@nestjs/common';
import { AbstractStep } from '../abstract.step';

@Injectable()
export class PersistAndFlushStep extends AbstractStep {
  public constructor(private readonly em: EntityManager) {
    super();
  }

  async process(payload: any): Promise<void> {
    await this.em.persistAndFlush(payload);

    this.em.clear();
  }
}
