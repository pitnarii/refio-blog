import "dotenv/config";
import express from "express";
import cors from "cors";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello TechUp!");
});

app.get("/posts", async (req, res) => {
  try {
    const result = await connectionPool.query(
      `select id, title, image, category_id, description, content, status_id
       from posts
       order by id desc`
    );
    return res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("GET /posts failed:", error.message);
    return res.status(500).json({
      message: "Server could not read posts because database connection failed",
    });
  }
});

app.post("/posts", async (req, res) => {
  const newPost = req.body;

  if (
    !newPost?.title ||
    !newPost?.image ||
    !newPost?.category_id ||
    !newPost?.description ||
    !newPost?.content ||
    !newPost?.status_id
  ) {
    return res.status(400).json({
      message:
        "Request body must include title, image, category_id, description, content, and status_id",
    });
  }

  try {
    const query = `insert into posts (title, image, category_id, description, content, status_id)
      values ($1, $2, $3, $4, $5, $6)`;

    const values = [
      newPost.title,
      newPost.image,
      newPost.category_id,
      newPost.description,
      newPost.content,
      newPost.status_id,
    ];

    await connectionPool.query(query, values);
  } catch (error) {
    console.error("POST /posts failed:", error.message);
    return res.status(500).json({
      message: "Server could not create post because database connection failed",
    });
  }

  return res.status(201).json({ message: "Created post successfully" });
});

if (process.env.VERCEL !== "1") {
  app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });
}

export default app;
