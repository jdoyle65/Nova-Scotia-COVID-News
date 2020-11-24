export class Scheduler {
  private timeout?: NodeJS.Timeout;
  private enabled = false;

  constructor(private delay: number) {}

  start() {
    this.enabled = true;

    if (!this.timeout) {
      this.startProcess();
    }
  }

  stop() {
    this.enabled = false;

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
      if (this.enabled) {
        await this.process();
        this.startProcess();
      }
    }, this.delay);
  }
}
