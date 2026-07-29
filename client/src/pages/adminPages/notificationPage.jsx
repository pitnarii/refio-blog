import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AdminSidebar from "client/src/components/AdminSidebar"
import ProfileAvatar from "client/src/components/ProfileAvatar"
import { Separator } from "client/src/components/ui/separator"
import {
  getAdminNotificationText,
  getAdminNotifications,
  getNotificationLink,
} from "client/src/data/notifications"
import { getCurrentUser, showAdminPanel } from "client/src/lib/auth"

function NotificationRow({ notification }) {
  const text = getAdminNotificationText(notification)
  const viewLink = getNotificationLink(notification)

  return (
    <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-1 gap-4">
        <ProfileAvatar
          src={notification.userAvatar}
          className="size-12 shrink-0 sm:size-14"
        />
        <div className="min-w-0 space-y-2">
          <p className="text-sm leading-relaxed text-gray-900">
            <span className="font-semibold">{notification.userName}</span>{" "}
            {text?.action}{" "}
            {text?.articleTitle && (
              <span className="text-gray-700">{text.articleTitle}</span>
            )}
          </p>
          {notification.commentPreview && (
            <p className="text-sm italic text-gray-600">
              &ldquo;{notification.commentPreview}&rdquo;
            </p>
          )}
          <p className="text-sm text-orange-400">{notification.timestamp}</p>
        </div>
      </div>
      <Link
        to={viewLink}
        className="shrink-0 text-sm font-medium text-gray-900 underline underline-offset-4 transition-colors hover:text-gray-600 sm:pt-1"
      >
        View
      </Link>
    </div>
  )
}

export default function NotificationPage() {
  const navigate = useNavigate()
  const [isReady, setIsReady] = useState(false)
  const notifications = getAdminNotifications()

  useEffect(() => {
    const user = getCurrentUser()

    if (!user) {
      navigate("/login")
      return
    }

    if (!showAdminPanel(user)) {
      navigate("/")
      return
    }

    setIsReady(true)
  }, [navigate])

  if (!isReady) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-[#EFEEEB]">
      <AdminSidebar active="notification" />

      <main className="flex min-h-screen min-w-0 flex-1 flex-col p-6 lg:p-8">
        <div className="flex flex-1 flex-col rounded-2xl bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-2 border-b border-gray-200 pb-6">
            <h1 className="text-2xl font-bold text-gray-900">Notification</h1>
          </div>

          <div>
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                {index > 0 && <Separator className="bg-gray-200" />}
                <NotificationRow notification={notification} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
