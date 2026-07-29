import { articleCategories as seedCategoryNames } from "client/src/data/adminArticles"

export const CATEGORIES_STORAGE_KEY = "adminCategories"
export const CATEGORIES_CHANGED_EVENT = "categories-changed"

const seedCategories = seedCategoryNames.map((name, index) => ({
  id: index + 1,
  name,
}))

function notifyCategoriesChanged() {
  window.dispatchEvent(new Event(CATEGORIES_CHANGED_EVENT))
}

function readStoredCategories() {
  try {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function getCategories() {
  const stored = readStoredCategories()
  if (stored) return stored

  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(seedCategories))
  return seedCategories
}

export function getCategoryNames() {
  return getCategories().map((category) => category.name)
}

export function getCategoryById(id) {
  return getCategories().find((category) => category.id === Number(id)) ?? null
}

export function saveCategory(name) {
  const categories = getCategories()
  const trimmed = name.trim()

  if (categories.some((category) => category.name.toLowerCase() === trimmed.toLowerCase())) {
    return { success: false, error: "duplicate" }
  }

  const nextCategory = { id: Date.now(), name: trimmed }
  localStorage.setItem(
    CATEGORIES_STORAGE_KEY,
    JSON.stringify([...categories, nextCategory])
  )
  notifyCategoriesChanged()

  return { success: true, category: nextCategory }
}

export function updateCategory(id, name) {
  const categories = getCategories()
  const index = categories.findIndex((category) => category.id === Number(id))

  if (index === -1) {
    return { success: false, error: "not_found" }
  }

  const trimmed = name.trim()
  const isDuplicate = categories.some(
    (category) =>
      category.id !== Number(id) &&
      category.name.toLowerCase() === trimmed.toLowerCase()
  )

  if (isDuplicate) {
    return { success: false, error: "duplicate" }
  }

  const nextCategories = [...categories]
  nextCategories[index] = { ...nextCategories[index], name: trimmed }
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(nextCategories))
  notifyCategoriesChanged()

  return { success: true, category: nextCategories[index] }
}

export function deleteCategory(id) {
  const categories = getCategories().filter((category) => category.id !== Number(id))
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories))
  notifyCategoriesChanged()
}
