import { getRepository } from "typeorm";

import { Scheduler } from "./Scheduler";
import { NsCovidData, NsNewsFeed } from "../../services";
import { NsDataEntry } from "../../entity/NsDataEntry";
import { NsNewsFeed as NsNewsFeedEntity } from "../../entity/NsNewsFeed";

export class NsDataScheduler extends Scheduler {
  protected async process() {
    await this.syncCovidData();
    await this.syncNewsFeed();
  }

  private async syncCovidData() {
    try {
      const data = await NsCovidData.getData();
      const nsDataRepository = getRepository(NsDataEntry);
      const entities = nsDataRepository.create(data);
      const result = await nsDataRepository.save(entities);

      console.info(`Synchronized ${result.length} entries for NS COVID Data`);
    } catch (error) {
      console.error(error);
    }
  }

  private async syncNewsFeed() {
    try {
      const { entries } = await NsNewsFeed.getLatest("en");
      const repo = getRepository(NsNewsFeedEntity);
      const entities = repo.create(
        entries.map((entry) => ({
          id: entry.id,
          published: entry.published,
          title: entry.title,
          url: entry.url,
        }))
      );

      const result = await repo.save(entities);
      console.info(
        `Synchronized ${result.length} entries for NS News Feed Data`
      );
    } catch (error) {
      console.error(error);
    }
  }
}
