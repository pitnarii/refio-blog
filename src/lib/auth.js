export const REGISTERED_USERS_KEY = "registeredUsers"
export const CURRENT_USER_KEY = "currentUser"
export const PASSWORD_OVERRIDES_KEY = "passwordOverrides"
export const AUTH_CHANGED_EVENT = "auth-changed"
export const ADMIN_PANEL_URL =
  import.meta.env.VITE_ADMIN_PANEL_URL ??
  "https://your-admin-dashboard.example.com"

function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
}

// Demo user for testing login errors (wrong password in reference)
export const SEED_USERS = [
  {
    name: "Moodeng ja",
    username: "moodeng.cute",
    email: "moodeng.cute@gmail.com",
    password: "moodeng123",
  },
]

export function getRegisteredUsers() {
  try {
    return JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || "[]")
  } catch {
    return []
  }
}

export function getAllUsers() {
  return [...SEED_USERS, ...getRegisteredUsers()]
}

export function isEmailTaken(email) {
  const normalized = email.trim().toLowerCase()
  return getAllUsers().some((user) => user.email.toLowerCase() === normalized)
}

export function saveRegisteredUser(user) {
  const users = getRegisteredUsers()
  const normalized = user.email.trim().toLowerCase()

  if (users.some((u) => u.email.toLowerCase() === normalized)) {
    return
  }

  localStorage.setItem(
    REGISTERED_USERS_KEY,
    JSON.stringify([...users, { ...user, email: normalized }])
  )
}

export function findUserByEmail(email) {
  const normalized = email.trim().toLowerCase()
  return getAllUsers().find((user) => user.email.toLowerCase() === normalized)
}

function getPasswordOverrides() {
  try {
    return JSON.parse(localStorage.getItem(PASSWORD_OVERRIDES_KEY) || "{}")
  } catch {
    return {}
  }
}

function getUserPassword(email) {
  const normalized = email.trim().toLowerCase()
  const overrides = getPasswordOverrides()

  if (overrides[normalized]) {
    return overrides[normalized]
  }

  const user = findUserByEmail(email)
  return user?.password ?? null
}

export function verifyCurrentPassword(email, currentPassword) {
  return getUserPassword(email) === currentPassword
}

export function validateLogin(email, password) {
  const user = findUserByEmail(email)

  if (!user || getUserPassword(email) !== password) {
    return { success: false, user: null }
  }

  return { success: true, user }
}

export function updateUserPassword(email, currentPassword, newPassword) {
  const normalized = email.trim().toLowerCase()
  const user = findUserByEmail(email)

  if (!user) {
    return { success: false, error: "user_not_found" }
  }

  if (getUserPassword(email) !== currentPassword) {
    return { success: false, error: "incorrect_current" }
  }

  const users = getRegisteredUsers()
  const index = users.findIndex(
    (registeredUser) => registeredUser.email.toLowerCase() === normalized
  )

  if (index !== -1) {
    const nextUsers = [...users]
    nextUsers[index] = { ...nextUsers[index], password: newPassword }
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(nextUsers))
  }

  const overrides = getPasswordOverrides()
  overrides[normalized] = newPassword
  localStorage.setItem(PASSWORD_OVERRIDES_KEY, JSON.stringify(overrides))

  return { success: true }
}

export function setCurrentUser(user) {
  const { password: _, ...safeUser } = user
  sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser))
  notifyAuthChanged()
}

export function getCurrentUser() {
  try {
    return JSON.parse(sessionStorage.getItem(CURRENT_USER_KEY) || "null")
  } catch {
    return null
  }
}

export function showAdminPanel(user) {
  if (!user?.email) return false
  return user.email.toLowerCase() === SEED_USERS[0].email.toLowerCase()
}

export function clearCurrentUser() {
  sessionStorage.removeItem(CURRENT_USER_KEY)
  notifyAuthChanged()
}

export function updateCurrentUserProfile(updates) {
  const current = getCurrentUser()
  if (!current) return null

  const updated = { ...current, ...updates }
  setCurrentUser(updated)

  const users = getRegisteredUsers()
  const index = users.findIndex(
    (user) => user.email.toLowerCase() === current.email.toLowerCase()
  )

  if (index !== -1) {
    const nextUsers = [...users]
    nextUsers[index] = { ...nextUsers[index], ...updates }
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(nextUsers))
  }

  return updated
}
