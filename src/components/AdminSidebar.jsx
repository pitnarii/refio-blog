import { Link, useNavigate } from "react-router-dom"
import {
  Bell,
  ExternalLink,
  FileText,
  FolderOpen,
  LogOut,
  RotateCcw,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { clearCurrentUser } from "@/lib/auth"

const navItemClass = (active, id) =>
  cn(
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
    active === id
      ? "bg-[#EFEEEB] text-gray-900"
      : "text-gray-500 hover:bg-[#EFEEEB]/60 hover:text-gray-900"
  )

export default function AdminSidebar({ active = "article-management" }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearCurrentUser()
    navigate("/")
  }

  return (
    <aside className="flex min-h-screen w-60 shrink-0 flex-col border-r border-gray-200 bg-[#F9F8F6] px-4 py-8">
      <div className="mb-10 px-2">
        <Link to="/" className="text-3xl font-bold text-gray-900">
          Refio
          <span className="text-green-500">.</span>
        </Link>
        <p className="mt-3 text-sm font-semibold text-orange-400">Admin panel</p>
      </div>

      <nav className="flex-1 space-y-1">
        <Link
          to="/admin/article-management"
          className={navItemClass(active, "article-management")}
        >
          <FileText className="size-4" />
          Article management
        </Link>
        <Link
          to="/admin/category-management"
          className={navItemClass(active, "category-management")}
        >
          <FolderOpen className="size-4" />
          Category management
        </Link>
        <Link to="/admin/profile" className={navItemClass(active, "profile")}>
          <User className="size-4" />
          Profile
        </Link>
        <Link
          to="/admin/notifications"
          className={navItemClass(active, "notification")}
        >
          <Bell className="size-4" />
          Notification
        </Link>
        <Link
          to="/admin/reset-password"
          className={navItemClass(active, "reset-password")}
        >
          <RotateCcw className="size-4" />
          Reset password
        </Link>
      </nav>

      <div className="space-y-1 border-t border-gray-200 pt-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-[#EFEEEB]/60 hover:text-gray-900"
        >
          <ExternalLink className="size-4" />
          Refio website
        </a>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-500 transition-colors hover:bg-[#EFEEEB]/60 hover:text-gray-900"
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    </aside>
  )
}
