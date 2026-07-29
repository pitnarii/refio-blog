import { Router } from "express";
import postsRouter from "./posts.routes.mjs";

const apiRouter = Router();

apiRouter.use("/posts", postsRouter);

export default apiRouter;
