import { Injectable, Scope } from '@nestjs/common';
import { AbstractStep } from '../abstract.step';

@Injectable()
export class IterateRowsStep extends AbstractStep {
  public async process(rows: any[]): Promise<void> {
    try {
      for (const row of rows) {
        await this.next.start(row);
      }
    } catch (e) {
      this.getLogger().error(e);
      this.resetIsFinalChain();
      this.context.addIndexValue('errors', 'iterate-rows', e.message);
    }
  }

  public async start(payload: any): Promise<void> {
    await this.process(payload);
  }
}
