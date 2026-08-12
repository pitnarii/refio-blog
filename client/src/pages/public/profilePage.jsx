import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import AccountSidebar from "@/components/AccountSidebar"
import ProfileAvatar from "@/components/ProfileAvatar"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { getCurrentUser, updateCurrentUserProfile } from "@/lib/auth"
import {
  readFileAsDataURL,
  uploadImage,
  validateImageFile,
} from "@/lib/upload"

const inputClassName =
  "h-12 rounded-lg border-gray-300 bg-white py-3 focus-visible:ring-0 focus-visible:ring-offset-0"

export default function ProfilePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [user, setUser] = useState(null)
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [profilePicture, setProfilePicture] = useState(null)
  const [profilePictureFile, setProfilePictureFile] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()

    if (!currentUser) {
      navigate("/login")
      return
    }

    setUser(currentUser)
    setName(currentUser.name ?? "")
    setUsername(currentUser.username ?? "")
    setEmail(currentUser.email ?? "")
    setProfilePicture(currentUser.profilePicture ?? null)
  }, [navigate])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    const validation = validateImageFile(file)

    if (!validation.valid) {
      if (validation.error === "invalid_type") {
        toast.error("Please upload an image file (JPEG, PNG, GIF, WEBP)")
      } else if (validation.error === "file_too_large") {
        toast.error("The file is too large. Please upload an image smaller than 5MB.")
      }
      event.target.value = ""
      return
    }

    try {
      setProfilePictureFile(file)
      setProfilePicture(await readFileAsDataURL(file))
    } catch {
      toast.error("Failed to read the image file")
    }

    event.target.value = ""
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      let pictureUrl = profilePicture

      if (profilePictureFile) {
        pictureUrl = await uploadImage(profilePictureFile)
      }

      const updatedUser = await updateCurrentUserProfile({
        name: name.trim(),
        username: username.trim(),
        profilePicture: pictureUrl,
      })

      if (updatedUser) {
        setUser(updatedUser)
        setProfilePicture(updatedUser.profilePicture ?? null)
        setProfilePictureFile(null)
        toast.success("Saved profile", {
          description: "Your profile has been successfully updated",
        })
      }
    } catch {
      toast.error("Unable to save profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <main className="py-10 lg:py-14">
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
        <AccountSidebar user={user} active="profile" />

        <div className="min-w-0 flex-1">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Profile</h1>

          <div className="rounded-2xl bg-[#EFEEEB] px-6 py-8 sm:px-8">
            <form onSubmit={handleSave} className="space-y-8">
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <ProfileAvatar
                  src={profilePicture}
                  className="size-28 shrink-0 sm:size-32"
                />

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUploadClick}
                    className="h-11 rounded-full border-gray-900 bg-white px-6 text-sm font-medium text-gray-900 hover:bg-gray-100"
                  >
                    Upload profile picture
                  </Button>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-600">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className={inputClassName}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-600">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className={inputClassName}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-600">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className={cn(
                      inputClassName,
                      "cursor-not-allowed bg-gray-100 text-gray-500"
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSaving}
                className="h-11 rounded-full bg-gray-900 px-8 text-sm font-medium text-white hover:bg-gray-700"
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
