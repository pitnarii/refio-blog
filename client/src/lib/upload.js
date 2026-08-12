import { api } from "./api"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export function validateImageFile(file) {
  if (!file) {
    return { valid: false, error: "no_file" }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "invalid_type" }
  }

  if (file.size > MAX_SIZE) {
    return { valid: false, error: "file_too_large" }
  }

  return { valid: true }
}

export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function uploadImage(file) {
  const formData = new FormData()
  formData.append("image", file)

  const { data } = await api.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })

  return data.url
}
