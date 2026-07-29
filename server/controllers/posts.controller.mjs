import connectionPool from "../utils/db.mjs";
import {
  POST_SELECT,
  POST_FROM,
  buildPostsQuery,
} from "../utils/posts.mjs";

export async function listPosts(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.max(Number(req.query.limit) || 6, 1);
  const category = String(req.query.category || "").trim();
  const keyword = String(req.query.keyword || "").trim();
  const offset = (page - 1) * limit;

  const { where, values } = buildPostsQuery({ category, keyword });

  try {
    const countResult = await connectionPool.query(
      `SELECT COUNT(*)::int AS total
       ${POST_FROM}
       ${where}`,
      values
    );

    const totalPosts = countResult.rows[0]?.total ?? 0;
    const totalPages = Math.max(Math.ceil(totalPosts / limit), 1);

    const listValues = [...values, limit, offset];
    const postsResult = await connectionPool.query(
      `SELECT ${POST_SELECT}
       ${POST_FROM}
       ${where}
       ORDER BY p.id DESC
       LIMIT $${listValues.length - 1}
       OFFSET $${listValues.length}`,
      listValues
    );

    return res.status(200).json({
      totalPosts,
      totalPages,
      currentPage: page,
      limit,
      posts: postsResult.rows,
      nextPage: page < totalPages ? page + 1 : null,
    });
  } catch (error) {
    console.error("GET /posts failed:", error.message);
    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
}

export async function getPostById(req, res) {
  const { postId } = req.params;

  try {
    const result = await connectionPool.query(
      `SELECT ${POST_SELECT}
       ${POST_FROM}
       WHERE p.id = $1`,
      [postId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Server could not find a requested post",
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("GET /posts/:postId failed:", error.message);
    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
}

export async function createPost(req, res) {
  const { title, image, category_id, description, content, status_id } =
    req.body;

  try {
    await connectionPool.query(
      `INSERT INTO posts (title, image, category_id, description, content, status_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [title, image, category_id, description, content, status_id]
    );

    return res.status(201).json({ message: "Created post successfully" });
  } catch (error) {
    console.error("POST /posts failed:", error.message);
    return res.status(500).json({
      message: "Server could not create post because database connection",
    });
  }
}

export async function updatePost(req, res) {
  const { postId } = req.params;
  const { title, image, category_id, description, content, status_id } =
    req.body;

  try {
    const result = await connectionPool.query(
      `UPDATE posts
       SET title = $1,
           image = $2,
           category_id = $3,
           description = $4,
           content = $5,
           status_id = $6
       WHERE id = $7
       RETURNING id`,
      [title, image, category_id, description, content, status_id, postId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Server could not find a requested post to update",
      });
    }

    return res.status(200).json({ message: "Updated post successfully" });
  } catch (error) {
    console.error("PUT /posts/:postId failed:", error.message);
    return res.status(500).json({
      message: "Server could not update post because database connection",
    });
  }
}

export async function deletePost(req, res) {
  const { postId } = req.params;

  try {
    const result = await connectionPool.query(
      `DELETE FROM posts WHERE id = $1 RETURNING id`,
      [postId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Server could not find a requested post to delete",
      });
    }

    return res.status(200).json({ message: "Deleted post successfully" });
  } catch (error) {
    console.error("DELETE /posts/:postId failed:", error.message);
    return res.status(500).json({
      message: "Server could not delete post because database connection",
    });
  }
}
