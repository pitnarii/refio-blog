
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"
export default function Navbar() {
  return (
    <header className="border-b border-gray-300">
    <div className="mx-auto flex max-w-page justify-between px-10 py-6">
      <a href="/" className="text-4xl font-bold text-gray-900">
        Refio
        <span className="text-green-500">.</span>
      </a>
      {/* Desktop: buttons */}
      <div className="hidden md:flex space-x-4">
        <button
          type="button"
          className="rounded-full border border-gray-300 px-6 py-2 text-m font-medium text-gray-900 transition-colors hover:text-gray-500"
        >
          Log in
        </button>
        <button
          type="button"
          className="rounded-full bg-gray-900 px-6 py-2 text-m font-medium text-white hover:bg-gray-700 transition-color"
        >
          Sign up
        </button>
      </div>
      {/* mobile: dropdown */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" />}
          >
            <Menu className="size-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#F9F8F6]">
            <DropdownMenuItem>
            <button
              type="button" className="w-full rounded-full border border-gray-300 px-6 py-2 text-m font-medium text-gray-900 transition-colors hover:text-gray-500"
            >Log in</button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button 
                 type="button" className="w-full rounded-full bg-gray-900 px-6 py-2 text-m font-medium text-white hover:bg-gray-700 transition-color">Sign up</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      </div>
    </header>
  )
}
