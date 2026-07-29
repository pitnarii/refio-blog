import { User } from "lucide-react"
import { cn } from "client/src/lib/utils"

export default function ProfileAvatar({ src, className }) {
  if (src) {
    return (
      <img
        src={src}
        alt="Profile"
        className={cn("rounded-full object-cover", className)}
      />
    )
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gray-400",
        className
      )}
    >
      <User className="size-1/2 text-white" strokeWidth={1.5} />
    </div>
  )
}
