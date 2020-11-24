import { Router } from "express";
import { api } from "./api";

const router = Router({ mergeParams: true });

router.use("/api", api);

export { router };
