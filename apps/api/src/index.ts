import express from "express";
import cors from "cors";
import bodyParser = require("body-parser");

import { createConnection } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

// Entities
import { NsCaseData } from "./entity/NsCaseData";
import { NsNewsRelease } from "./entity/NsNewsRelease";

// Routes
import { router } from "./routes";

// Services
import { NsDataScheduler } from "./services/scheduler/NsDataScheduler";
import { ScheduleManager } from "./services/scheduler/SchedulerManager";

async function run() {
  const connection = await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "foobar",
    synchronize: true,
    logging: false,
    entities: [NsCaseData, NsNewsRelease],
    migrations: ["./migration/**/*.ts"],
    namingStrategy: new SnakeNamingStrategy(),
  });

  const app = express();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(router);

  app.listen(8080, () => console.log("listening"));

  const scheduleInterval = 1000 * 60 * 5; // 5 minutes

  const schedulerManager = ScheduleManager.instance;
  schedulerManager.registerService(NsDataScheduler, scheduleInterval);
  schedulerManager.startServices();
}

run();
