import { Link } from "react-router-dom"
import { Lock, User } from "lucide-react"
import ProfileAvatar from "@/components/ProfileAvatar"
import { cn } from "@/lib/utils"

export default function AccountSidebar({ user, active }) {
  const navItemClass = (id) =>
    cn(
      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
      active === id ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
    )

  return (
    <aside className="w-full shrink-0 lg:w-56">
      <div className="mb-8 flex items-center gap-4">
        <ProfileAvatar
          src={user.profilePicture}
          className="size-12 shrink-0"
        />
        <div>
          <p className="font-semibold text-gray-900">{user.name || "User"}</p>
          <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
        </div>
      </div>

      <nav className="space-y-1">
        <Link to="/profile" className={navItemClass("profile")}>
          <User className="size-4" />
          Profile
        </Link>
        <Link to="/reset-password" className={navItemClass("reset-password")}>
          <Lock className="size-4" />
          Reset password
        </Link>
      </nav>
    </aside>
  )
}
