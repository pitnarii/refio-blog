import { Router } from "express";
import { validatePostBody } from "../middleware/validatePostBody.mjs";
import {
  listPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/posts.controller.mjs";

const postsRouter = Router();

postsRouter.get("/", listPosts);
postsRouter.get("/:postId", getPostById);
postsRouter.post("/", validatePostBody, createPost);
postsRouter.put("/:postId", validatePostBody, updatePost);
postsRouter.delete("/:postId", deletePost);

export default postsRouter;
