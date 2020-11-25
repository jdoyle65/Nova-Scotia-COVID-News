import { Scheduler } from "./Scheduler";

export class ScheduleManager {
  protected static _instance: ScheduleManager;
  protected scheduledServices: Scheduler[] = [];

  static get instance() {
    if (!this._instance) {
      this._instance = new ScheduleManager();
    }

    return this._instance;
  }

  private constructor() {}

  registerService(SchedulerService: typeof Scheduler, delay: number) {
    if (this.getService(SchedulerService)) {
      throw Error(
        `Already registered a schedule service for ${SchedulerService.name}`
      );
    }

    const serviceInstance = new SchedulerService(delay);
    this.scheduledServices.push(serviceInstance);
  }

  getService(SchedulerService: typeof Scheduler) {
    return this.scheduledServices.find((s) => s instanceof SchedulerService);
  }

  startServices(SchedulerService?: typeof Scheduler) {
    if (!SchedulerService) {
      this.scheduledServices.forEach((s) => s.start());
      return;
    }

    const serviceInstance = this.getService(SchedulerService);
    if (serviceInstance) {
      serviceInstance.start();
    }
  }

  stopServices(SchedulerService?: typeof Scheduler) {
    if (!SchedulerService) {
      this.scheduledServices.forEach((s) => s.stop());
      return;
    }

    const serviceInstance = this.getService(SchedulerService);
    if (serviceInstance) {
      serviceInstance.stop();
    }
  }
}
