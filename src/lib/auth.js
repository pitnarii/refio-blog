export const REGISTERED_USERS_KEY = "registeredUsers"
export const CURRENT_USER_KEY = "currentUser"

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

export function validateLogin(email, password) {
  const user = findUserByEmail(email)

  if (!user || user.password !== password) {
    return { success: false, user: null }
  }

  return { success: true, user }
}

export function setCurrentUser(user) {
  const { password: _, ...safeUser } = user
  sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser))
}

export function getCurrentUser() {
  try {
    return JSON.parse(sessionStorage.getItem(CURRENT_USER_KEY) || "null")
  } catch {
    return null
  }
}

export function clearCurrentUser() {
  sessionStorage.removeItem(CURRENT_USER_KEY)
}
