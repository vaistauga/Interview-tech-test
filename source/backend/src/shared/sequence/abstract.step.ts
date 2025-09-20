import { LOGGER } from '@api/shared/logger/constants';
import { Logger } from '@nestjs/common';
import { QueueLogger } from '@api/shared/queue';
import { Context } from './context';

export abstract class AbstractStep {
  protected _isFinal = false;
  protected next!: AbstractStep | null;
  protected context!: Context;

  public setContext(context: Context): void {
    this.context = context;
  }

  public async finish(): Promise<void> {
    await this.finalize();

    if (this.next && !this.isFinal()) {
      await this.next.finish();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async finalize(): Promise<void> {}

  public setNext(next: AbstractStep) {
    this.next = next;
  }

  public isFinal() {
    return this._isFinal || !this.next;
  }

  public setIsFinal(isFinal: boolean) {
    this._isFinal = isFinal;
  }

  public async start(payload: any): Promise<void> {
    try {
      const response = await this.process(payload);

      if (!this.isFinal()) {
        await this.next.start(response);
      }
    } catch (e) {
      this.getLogger().error(e);
    }
  }

  public abstract process(payload: any): Promise<any>;

  public getLogger(): Logger | QueueLogger {
    if (this.context.getIndex(LOGGER)) {
      return this.context.getIndex<Logger>(LOGGER);
    }

    return new Logger();
  }

  /**
   * Resets the current setIsFinalFlag and all the next steps setIsFinalFlag
   */
  public resetIsFinalChain(): void {
    this.setIsFinal(false);

    if (this.next) {
      this.next.resetIsFinalChain();
    }
  }
}
