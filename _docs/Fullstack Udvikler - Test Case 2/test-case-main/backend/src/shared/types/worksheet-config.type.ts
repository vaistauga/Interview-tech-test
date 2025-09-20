export type SheetConfig<T extends object = object> = {
    identifier: string | number;
    keys: (keyof T)[];
    onParsed: (data: Partial<T>[]) => Promise<void>;
  };
  