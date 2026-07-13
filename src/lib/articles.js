import { adminArticles as seedArticles } from "@/data/adminArticles"

export const ARTICLES_STORAGE_KEY = "adminArticles"
export const ARTICLES_CHANGED_EVENT = "articles-changed"

function notifyArticlesChanged() {
  window.dispatchEvent(new Event(ARTICLES_CHANGED_EVENT))
}

function readStoredArticles() {
  try {
    const stored = localStorage.getItem(ARTICLES_STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function getArticles() {
  const stored = readStoredArticles()
  if (stored) return stored

  localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(seedArticles))
  return seedArticles
}

export function getArticleById(id) {
  return getArticles().find((article) => article.id === Number(id)) ?? null
}

export function saveArticle(article) {
  const articles = getArticles()
  const nextArticle = {
    ...article,
    id: Date.now(),
  }

  const nextArticles = [nextArticle, ...articles]
  localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(nextArticles))
  notifyArticlesChanged()

  return nextArticle
}

export function updateArticle(id, updates) {
  const articles = getArticles()
  const index = articles.findIndex((article) => article.id === Number(id))

  if (index === -1) {
    return null
  }

  const nextArticles = [...articles]
  nextArticles[index] = { ...nextArticles[index], ...updates, id: nextArticles[index].id }
  localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(nextArticles))
  notifyArticlesChanged()

  return nextArticles[index]
}

export function deleteArticle(id) {
  const articles = getArticles().filter((article) => article.id !== Number(id))
  localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles))
  notifyArticlesChanged()
}
