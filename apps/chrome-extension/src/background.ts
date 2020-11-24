const nsNewsFeedUrl = "http://localhost:8080/api/news";
const nsNewsFeedInterval = 1000 * 60 * 5; // 5 minutes

const runNewsFeed = async () => {
  console.debug(`fetching ${nsNewsFeedUrl}`);
  const res = await fetch(nsNewsFeedUrl);
  console.log(await res.json());
};

chrome.runtime.onInstalled.addListener(() => {
  const newsRunner = new TaskRunner(runNewsFeed, nsNewsFeedInterval);

  console.debug("Starting News Runner...");
  runNewsFeed();
  // newsRunner.start();
});

class TaskRunner {
  private interval?: number;

  constructor(private task: () => void, private time: number) {}

  start() {
    this.interval = setInterval(() => this.task(), this.time);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
