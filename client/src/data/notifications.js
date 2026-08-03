const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"

export const notifications = [
  {
    id: 1,
    userName: "Jacob Lash",
    userAvatar: DEFAULT_AVATAR,
    type: "comment",
    articleId: 1,
    articleTitle: "The Fascinating World of Cat",
    commentPreview:
      "I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.",
    timestamp: "4 hours ago",
    showInAdmin: true,
    showInPopover: false,
  },
  {
    id: 2,
    userName: "Jacob Lash",
    userAvatar: DEFAULT_AVATAR,
    type: "like",
    articleId: 2,
    articleTitle: "The Battle of the Cat: Hide, Seek, and Pounce!",
    timestamp: "4 hours ago",
    showInAdmin: true,
    showInPopover: false,
  },
  {
    id: 3,
    userName: "Thompson P.",
    userAvatar: DEFAULT_AVATAR,
    type: "publish",
    articleId: 3,
    timestamp: "2 hours ago",
    showInAdmin: false,
    showInPopover: true,
  },
  {
    id: 4,
    userName: "Jacob Lash",
    userAvatar: DEFAULT_AVATAR,
    type: "thread_comment",
    articleId: 1,
    timestamp: "12 September 2024 at 18:30",
    showInAdmin: false,
    showInPopover: true,
  },
]

export function getAdminNotifications() {
  return notifications.filter((item) => item.showInAdmin)
}

export function getPopoverNotifications() {
  return notifications.filter((item) => item.showInPopover)
}

export function getNotificationLink(notification) {
  if (!notification.articleId) return "/"
  return `/viewPostPage/${notification.articleId}`
}

export function getAdminNotificationText(notification) {
  if (notification.type === "comment") {
    return {
      action: "commented on your article:",
      articleTitle: notification.articleTitle,
    }
  }

  if (notification.type === "like") {
    return {
      action: "liked your article:",
      articleTitle: notification.articleTitle,
    }
  }

  return null
}

export function getPopoverNotificationText(notification) {
  if (notification.type === "publish") {
    return "Published new article."
  }

  if (notification.type === "thread_comment") {
    return "Comment on the article you have commented on."
  }

  return ""
}
