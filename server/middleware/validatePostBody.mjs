const postFieldRules = [
  { key: "title", label: "Title", type: "string" },
  { key: "image", label: "Image", type: "string" },
  { key: "category_id", label: "Category id", type: "number" },
  { key: "description", label: "Description", type: "string" },
  { key: "content", label: "Content", type: "string" },
  { key: "status_id", label: "Status id", type: "number" },
];

function isMissing(value) {
  return value === undefined || value === null || value === "";
}

function validateType(value, type) {
  if (type === "string") return typeof value === "string";
  if (type === "number") return typeof value === "number" && !Number.isNaN(value);
  return false;
}

export function validatePostBody(req, res, next) {
  const body = req.body;

  for (const field of postFieldRules) {
    const value = body[field.key];

    if (isMissing(value)) {
      return res.status(400).json({
        message: `${field.label} is required`,
      });
    }

    if (!validateType(value, field.type)) {
      return res.status(400).json({
        message: `${field.label} must be a ${field.type}`,
      });
    }
  }

  next();
}
