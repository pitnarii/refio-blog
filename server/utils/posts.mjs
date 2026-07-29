const POST_SELECT = `
  p.id,
  p.image,
  p.title,
  p.description,
  p.content,
  p.date,
  p.likes_count AS likes,
  c.name AS category,
  s.status AS status,
  'Thompson P.' AS author
`;

const POST_FROM = `
  FROM posts p
  LEFT JOIN categories c ON p.category_id = c.id
  LEFT JOIN statuses s ON p.status_id = s.id
`;

export function buildPostsQuery({ category = "", keyword = "" } = {}) {
  const conditions = [];
  const values = [];

  if (category) {
    values.push(category);
    conditions.push(`c.name = $${values.length}`);
  }

  if (keyword) {
    values.push(`%${keyword}%`);
    conditions.push(
      `(p.title ILIKE $${values.length} OR p.description ILIKE $${values.length} OR c.name ILIKE $${values.length})`
    );
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  return { where, values };
}

export { POST_SELECT, POST_FROM };
