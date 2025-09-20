import { Context } from './context';
import { Sequence } from './sequence';

export class Import {
  private readonly sequences: Sequence[];
  private readonly context: Context;

  public constructor(sequences: Sequence[]) {
    this.context = new Context();
    this.sequences = sequences.map((sequence) => {
      sequence.setContext(this.context);

      return sequence;
    });
  }

  public async start(payload: any): Promise<void> {
    for (const sequence of this.sequences) {
      await sequence.start(payload);
    }
  }

  public getContext(): Context {
    return this.context;
  }
}
