import express from "express";
import cors from "cors";
import bodyParser = require("body-parser");

import { createConnection } from "typeorm";

// Entities
import { NsDataEntry } from "./entity/NsDataEntry";
import { NsNewsFeed } from "./entity/NsNewsFeed";

// Routes
import { router } from "./routes";
import { NsDataScheduler } from "./services/scheduler/NsDataScheduler";

async function run() {
  const connection = await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "foobar",
    // database: "news",
    synchronize: true,
    logging: false,
    entities: [NsDataEntry, NsNewsFeed],
    migrations: ["./migration/**/*.ts"],
  });

  const app = express();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(router);

  app.listen(8080, () => console.log("listening"));

  const s = new NsDataScheduler(5000);
  s.start();
  setTimeout(() => {
    s.stop();
  }, 5250);
}

run();
