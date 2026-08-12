import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import AdminSidebar from "@/components/AdminSidebar"
import ProfileAvatar from "@/components/ProfileAvatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  getCurrentUser,
  showAdminPanel,
  updateCurrentUserProfile,
} from "@/lib/auth"
import {
  readFileAsDataURL,
  uploadImage,
  validateImageFile,
} from "@/lib/upload"

const inputClassName =
  "h-12 rounded-lg border-gray-200 bg-white focus-visible:ring-0 focus-visible:ring-offset-0"

export default function AdminProfile() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [profilePicture, setProfilePicture] = useState(null)
  const [profilePictureFile, setProfilePictureFile] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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

    setName(user.name ?? "")
    setUsername(user.username ?? "")
    setEmail(user.email ?? "")
    setBio(user.bio ?? "")
    setProfilePicture(user.profilePicture ?? null)
    setIsReady(true)
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

  const handleSave = async () => {
    if (bio.length > 120) {
      toast.error("Bio must be at most 120 characters")
      return
    }

    setIsSaving(true)

    try {
      let pictureUrl = profilePicture

      if (profilePictureFile) {
        pictureUrl = await uploadImage(profilePictureFile)
      }

      const updatedUser = await updateCurrentUserProfile({
        name: name.trim(),
        username: username.trim(),
        bio: bio.trim(),
        profilePicture: pictureUrl,
      })

      setProfilePicture(updatedUser.profilePicture ?? null)
      setProfilePictureFile(null)
      setBio(updatedUser.bio ?? "")

      toast.success("Saved profile", {
        description: "Your profile has been successfully updated",
      })
    } catch {
      toast.error("Unable to save profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (!isReady) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-[#EFEEEB]">
      <AdminSidebar active="profile" />

      <main className="flex min-h-screen min-w-0 flex-1 flex-col p-6 lg:p-8">
        <div className="flex flex-1 flex-col rounded-2xl bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="h-11 rounded-full bg-gray-900 px-8 text-sm font-medium text-white hover:bg-gray-700"
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              handleSave()
            }}
            className="max-w-2xl space-y-8"
          >
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
                <Label htmlFor="admin-name" className="text-gray-600">
                  Name
                </Label>
                <Input
                  id="admin-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-username" className="text-gray-600">
                  Username
                </Label>
                <Input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-gray-600">
                  Email
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  disabled
                  className={cn(
                    inputClassName,
                    "cursor-not-allowed bg-gray-100 text-gray-500"
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-bio" className="text-gray-600">
                  Bio (max 120 letters)
                </Label>
                <textarea
                  id="admin-bio"
                  rows={4}
                  value={bio}
                  maxLength={120}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder="Bio"
                  className="flex min-h-[120px] w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-gray-300"
                />
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
