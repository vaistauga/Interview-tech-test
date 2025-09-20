export class Context {
  private state: Map<string | symbol, any> = new Map<string, any>();

  public addIndex(key: string | symbol, value: any): void {
    this.state.set(key, value);
  }

  public getIndex<T>(key: string | symbol): T | null {
    if (!this.state.has(key)) {
      return null;
    }

    return this.state.get(key);
  }

  public removeIndex(key: string | symbol): void {
    this.state.delete(key);
  }

  public getAllIndexes(): Map<string | symbol, any> {
    return this.state;
  }

  public merge(state: Map<string | symbol, any>) {
    this.state = new Map<string | symbol, any>([...this.state, ...state]);
  }

  public addIndexValue<T>(index: string, key: string, value: T): void {
    if (!this.state.has(index) || !this.state.get(index)) {
      this.state.set(index, new Map<string, T>().set(key, value));
      return;
    }

    const map: Map<string, T> = this.state.get(index);

    map.set(key, value);

    this.state.set(index, map);
  }
}
