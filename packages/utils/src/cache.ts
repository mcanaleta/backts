export function AsyncCache<This, Args extends any[], Return>(
  originalMethod: (this: This, ...args: Args) => Promise<Return>,
  context: ClassMethodDecoratorContext<This>
) {
  const store = { v: null as Return };

  async function replacementMethod(this: This, ...args: Args) {
    if (!store.v) {
      store.v = await originalMethod.call(this, ...args);
    }
    return store.v;
  }
  return replacementMethod;
}

export class Lazy<T> {
  private factory: () => Promise<T>;
  private _v: T | undefined;
  private _promise: Promise<T> | undefined;

  constructor(factory: () => Promise<T>) {
    this.factory = factory;
  }

  async get(): Promise<T> {
    if (!this._v) {
      if (!this._promise) {
        this._promise = this.factory().then((value) => {
          this._v = value;
          this._promise = undefined; // Reset promise so factory can be called again if needed
          return value;
        });
      }
      return this._promise;
    }
    return this._v;
  }
}
