import { TUserImportResult } from '@api/users/types';
import { AbstractStep } from '@api/shared/sequence';
import { UserSavedEvent } from '@api/users/events';
import { wrap } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class TriggerUserSavedEventStep extends AbstractStep {
  public constructor(private readonly eventBus: EventBus) {
    super();
  }

  async process(payload: TUserImportResult): Promise<void> {
    this.eventBus.publish(
      new UserSavedEvent(wrap(payload.user).toPOJO(), payload.oldState, true),
    );
  }
}
