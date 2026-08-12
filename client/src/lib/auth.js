import { api } from "./api"

export const ACCESS_TOKEN_KEY = "accessToken"
export const CURRENT_USER_KEY = "currentUser"
export const AUTH_CHANGED_EVENT = "auth-changed"
export const ADMIN_PANEL_URL = "/admin/article-management"

function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
}

export function getAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setSession(accessToken, user) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  notifyAuthChanged()
}

export async function login(email, password) {
  const { data } = await api.post("/api/auth/login", {
    email: email.trim(),
    password,
  })

  setSession(data.access_token, data.user)

  return { success: true, user: data.user }
}

export async function register(userData) {
  await api.post("/api/auth/register", {
    name: userData.name.trim(),
    username: userData.username.trim(),
    email: userData.email.trim(),
    password: userData.password,
  })
}

export async function fetchCurrentUser() {
  const token = getAccessToken()

  if (!token) {
    return null
  }

  try {
    const { data } = await api.get("/api/auth/me")
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user))
    notifyAuthChanged()
    return data.user
  } catch {
    clearCurrentUser()
    return null
  }
}

export function getCurrentUser() {
  try {
    return JSON.parse(sessionStorage.getItem(CURRENT_USER_KEY) || "null")
  } catch {
    return null
  }
}

export function showAdminPanel(user) {
  if (!user) return false
  return user.role === "admin"
}

export async function clearCurrentUser() {
  try {
    await api.post("/api/auth/logout")
  } catch {
    // Ignore logout API errors and clear local session anyway.
  }

  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(CURRENT_USER_KEY)
  notifyAuthChanged()
}

export async function updateCurrentUserProfile(updates) {
  const { data } = await api.put("/api/auth/profile", updates)
  sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user))
  notifyAuthChanged()
  return data.user
}

export async function updateUserPassword(currentPassword, newPassword) {
  await api.put("/api/auth/password", {
    currentPassword,
    newPassword,
  })

  return { success: true }
}

export async function verifyCurrentPassword(currentPassword) {
  try {
    await api.post("/api/auth/verify-password", { currentPassword })
    return true
  } catch {
    return false
  }
}
