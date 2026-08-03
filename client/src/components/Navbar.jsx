import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  ChevronDown,
  ExternalLink,
  LogOut,
  Menu,
  RotateCcw,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NotificationBell from "@/components/NotificationBell"
import ProfileAvatar from "@/components/ProfileAvatar"
import {
  ADMIN_PANEL_URL,
  AUTH_CHANGED_EVENT,
  clearCurrentUser,
  getCurrentUser,
  showAdminPanel,
} from "@/lib/auth"

function AuthButtons({ className = "" }) {
  return (
    <div className={className}>
      <Link
        to="/login"
        className="rounded-full border border-gray-300 px-6 py-2 text-m font-medium text-gray-900 transition-colors hover:text-gray-500"
      >
        Log in
      </Link>
      <Link
        to="/signup"
        className="rounded-full bg-gray-900 px-6 py-2 text-m font-medium text-white transition-colors hover:bg-gray-700"
      >
        Sign up
      </Link>
    </div>
  )
}

function UserMenu({ user, onLogout }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <NotificationBell />

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-gray-100 sm:gap-3 sm:pr-3"
            />
          }
        >
          <ProfileAvatar
            src={user.profilePicture}
            className="size-9 shrink-0 sm:size-10"
          />
          <span className="hidden max-w-[140px] truncate text-sm font-medium text-gray-900 sm:inline">
            {user.name}
          </span>
          <ChevronDown className="size-4 text-gray-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48 bg-[#F9F8F6]">
          <DropdownMenuItem render={<Link to="/profile" className="w-full" />}>
            <User className="size-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            render={<Link to="/reset-password" className="w-full" />}
          >
            <RotateCcw className="size-4" />
            Reset password
          </DropdownMenuItem>
          {showAdminPanel(user) && (
            <DropdownMenuItem
              render={<Link to={ADMIN_PANEL_URL} className="w-full" />}
            >
              <ExternalLink className="size-4" />
              Admin panel
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onLogout}
            className="cursor-pointer"
          >
            <LogOut className="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(() => getCurrentUser())

  useEffect(() => {
    const syncUser = () => setUser(getCurrentUser())

    syncUser()
    window.addEventListener(AUTH_CHANGED_EVENT, syncUser)
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, syncUser)
  }, [location.pathname])

  const handleLogout = () => {
    clearCurrentUser()
    navigate("/")
  }

  return (
    <header className="border-b border-gray-300">
      <div className="mx-auto flex max-w-page items-center justify-between px-10 py-6">
        <Link to="/" className="text-4xl font-bold text-gray-900">
          Refio
          <span className="text-green-500">.</span>
        </Link>

        {user ? (
          <UserMenu user={user} onLogout={handleLogout} />
        ) : (
          <>
            <AuthButtons className="hidden items-center gap-4 md:flex" />
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="ghost" size="icon" />}
                >
                  <Menu className="size-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#F9F8F6]">
                  <DropdownMenuItem>
                    <Link
                      to="/login"
                      className="block w-full rounded-full border border-gray-300 px-6 py-2 text-center text-m font-medium text-gray-900 transition-colors hover:text-gray-500"
                    >
                      Log in
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      to="/signup"
                      className="block w-full rounded-full bg-gray-900 px-6 py-2 text-center text-m font-medium text-white transition-colors hover:bg-gray-700"
                    >
                      Sign up
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
