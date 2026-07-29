import { Link } from "react-router-dom"
import { Bell } from "lucide-react"
import ProfileAvatar from "client/src/components/ProfileAvatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "client/src/components/ui/dropdown-menu"
import { Separator } from "client/src/components/ui/separator"
import {
  getNotificationLink,
  getPopoverNotificationText,
  getPopoverNotifications,
} from "client/src/data/notifications"

export default function NotificationBell() {
  const items = getPopoverNotifications()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label="Notifications"
            className="flex size-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50"
          />
        }
      >
        <Bell className="size-5" strokeWidth={1.5} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-80 overflow-hidden rounded-xl border border-gray-200 bg-white p-0 shadow-lg"
      >
        <div className="max-h-96 overflow-y-auto">
          {items.map((notification, index) => (
            <div key={notification.id}>
              {index > 0 && <Separator className="bg-gray-200" />}
              <Link
                to={getNotificationLink(notification)}
                className="flex gap-3 px-4 py-4 transition-colors hover:bg-gray-50"
              >
                <ProfileAvatar
                  src={notification.userAvatar}
                  className="size-10 shrink-0"
                />
                <div className="min-w-0 space-y-1">
                  <p className="text-sm leading-snug text-gray-900">
                    <span className="font-semibold">{notification.userName}</span>{" "}
                    {getPopoverNotificationText(notification)}
                  </p>
                  <p className="text-xs text-orange-400">{notification.timestamp}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
