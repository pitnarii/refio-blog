import { api } from "./api"

function toPostPayload(articleData) {
  return {
    title: articleData.title,
    category: articleData.category,
    status: articleData.status,
    introduction: articleData.introduction,
    content: articleData.content,
    image: articleData.image ?? articleData.thumbnail ?? null,
  }
}

export async function getPosts({ page, limit, category, keyword } = {}) {
  const { data } = await api.get("/api/posts", {
    params: { page, limit, category, keyword },
  })

  return data
}

export async function getPostById(id) {
  const { data } = await api.get(`/api/posts/${id}`)
  return data
}

export async function getAdminPosts() {
  const { data } = await api.get("/api/admin/posts")
  return Array.isArray(data) ? data : (data.posts ?? [])
}

export async function getAdminPostById(id) {
  const { data } = await api.get(`/api/admin/posts/${id}`)
  return data
}

export async function createPost(articleData) {
  const { data } = await api.post("/api/admin/posts", toPostPayload(articleData))
  return data
}

export async function updatePost(id, articleData) {
  const { data } = await api.put(
    `/api/admin/posts/${id}`,
    toPostPayload(articleData)
  )
  return data
}

export async function deletePost(id) {
  await api.delete(`/api/admin/posts/${id}`)
}
