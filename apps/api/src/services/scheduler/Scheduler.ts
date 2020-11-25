export class Scheduler {
  private timeout?: NodeJS.Timeout;
  private _isEnabled = false;
  private _isRunning = false;

  get isEnabled() {
    return this._isEnabled;
  }

  get isRunning() {
    return this._isRunning;
  }

  constructor(private delay: number) {}

  start() {
    this._isEnabled = true;

    if (!this.timeout) {
      this.startProcess();
    }
  }

  stop() {
    this._isEnabled = false;

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
  }

  /**
   * @abstract
   */
  protected async process() {
    throw new TypeError("'process' is an abstract function");
  }

  private startProcess() {
    this.timeout = setTimeout(async () => {
      if (this._isEnabled) {
        this._isRunning = true;
        await this.process();

        this._isRunning = false;
        this.startProcess();
      }
    }, this.delay);
  }
}
