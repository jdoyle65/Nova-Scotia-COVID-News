import { Request, Response, Router } from "express";
import { query, validationResult } from "express-validator";
import { FindManyOptions, getRepository, MoreThanOrEqual } from "typeorm";

import { NsCaseData } from "../../entity/NsCaseData";
import { NsNewsRelease } from "../../entity/NsNewsRelease";

const api = Router({ mergeParams: true });

api.get(
  "/feed",
  [query("after").isDate().optional()],
  async (req: Request, res: Response) => {
    const newsQuery: FindManyOptions<NsNewsRelease> = {
      order: { published: "DESC" },
      take: 500,
    };

    const dataQuery: FindManyOptions<NsCaseData> = {
      order: { date: "DESC" },
      take: 500,
    };

    try {
      validationResult(req).throw();
    } catch (error) {
      return res.status(422).json(error);
    }

    const { after } = req.query;

    if (after) {
      const date = new Date(after as string);
      newsQuery.where = { published: MoreThanOrEqual(date) };
      dataQuery.where = { date: MoreThanOrEqual(date) };
    }

    const newsRepo = getRepository(NsNewsRelease);
    const dataRepo = getRepository(NsCaseData);

    try {
      const newsResult = await newsRepo.find(newsQuery);
      const dataResult = await dataRepo.find(dataQuery);

      const data = [
        ...newsResult.map((r) => ({
          id: r.id,
          type: "news",
          date: r.published,
          href: generateHref(req, `/api/news/${encodeURIComponent(r.id)}`),
        })),
        ...dataResult.map((r) => ({
          id: r.id,
          type: "data",
          date: r.date,
          href: generateHref(req, `/api/data/${encodeURIComponent(r.id)}`),
        })),
      ].sort((r1, r2) => r2.date.getTime() - r1.date.getTime());

      return res.json({ data });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
);

api.get("/news", async (req, res) => {
  const queryOptions: FindManyOptions<NsNewsRelease> = {
    order: { published: "DESC" },
    take: 500,
  };

  const repo = getRepository(NsNewsRelease);
  try {
    const data = await repo.find(queryOptions);
    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

api.get("/news/:id", async (req, res) => {
  const { id } = req.params;
  const repo = getRepository(NsNewsRelease);
  try {
    const result = await repo.findOne(id);

    if (!result) {
      return res.status(404).json({ message: "News item not found" });
    }

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

api.get(
  "/data",
  [query("after").isDate()],
  async (req: Request, res: Response) => {
    try {
      validationResult(req).throw();
    } catch (error) {
      return res.status(422).json(error);
    }

    const { after } = req.query;
    const queryOptions: FindManyOptions<NsCaseData> = {
      order: { date: "DESC" },
      take: 500,
    };

    if (after) {
      queryOptions.where = {
        date: MoreThanOrEqual(after),
      };
    }

    const repo = getRepository(NsCaseData);

    try {
      const results = await repo.find(queryOptions);

      return res.json({ data: results });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
);

api.get("/data/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const repo = getRepository(NsCaseData);

  try {
    const result = await repo.findOne(id);

    if (!result) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    return res.json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error,
    });
  }
});

function generateHref(req: Request, path: string) {
  const protocol = req.secure ? "https" : "http";
  return `${protocol}://${req.headers.host}${path}`;
}

export { api };
