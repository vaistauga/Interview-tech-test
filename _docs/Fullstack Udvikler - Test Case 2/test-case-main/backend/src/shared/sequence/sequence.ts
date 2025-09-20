import { AbstractStep } from './abstract.step';
import { Context } from './context';

export class Sequence {
  private context!: Context;
  private firstStep!: AbstractStep;
  private readonly steps: AbstractStep[];

  constructor(steps: AbstractStep[]) {
    this.steps = steps;
  }

  private buildSteps(steps: AbstractStep[]): void {
    let currentStep = steps.shift();
    currentStep.setContext(this.context);
    this.firstStep = currentStep;

    for (const step of steps) {
      currentStep.setNext(step);

      currentStep = step;
      currentStep.setContext(this.context);
    }
  }

  public async start(payload: any): Promise<void> {
    if (this.steps.length === 0) {
      return;
    }

    this.buildSteps(this.steps);
    await this.firstStep.start(payload);
    await this.firstStep.finish();
  }

  public setContext(context: Context): void {
    this.context = context;
  }

  public getContext(): Context {
    return this.context;
  }

  public resetContext(): void {
    this.context = null;
  }
}
