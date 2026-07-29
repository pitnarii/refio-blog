import { useEffect, useRef, useState } from "react"

import { useNavigate } from "react-router-dom"

import AccountSidebar from "client/src/components/AccountSidebar"
import ProfileAvatar from "client/src/components/ProfileAvatar"

import { toast } from "sonner"

import { Button } from "client/src/components/ui/button"

import { Input } from "client/src/components/ui/input"

import { Label } from "client/src/components/ui/label"

import { cn } from "client/src/lib/utils"

import { getCurrentUser, updateCurrentUserProfile } from "client/src/lib/auth"



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



  const handleFileChange = (event) => {

    const file = event.target.files?.[0]

    if (!file) return



    if (!file.type.startsWith("image/")) {

      toast.error("Please upload an image file")

      return

    }



    const reader = new FileReader()

    reader.onload = () => {

      setProfilePicture(reader.result)

    }

    reader.readAsDataURL(file)

    event.target.value = ""

  }



  const handleSave = (event) => {

    event.preventDefault()



    const updatedUser = updateCurrentUserProfile({

      name: name.trim(),

      username: username.trim(),

      profilePicture,

    })



    if (updatedUser) {

      setUser(updatedUser)

    }



    toast.success("Saved profile", {

      description: "Your profile has been successfully updated",

    })

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

                    accept="image/*"

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

                className="h-11 rounded-full bg-gray-900 px-8 text-sm font-medium text-white hover:bg-gray-700"

              >

                Save

              </Button>

            </form>

          </div>

        </div>

      </div>

    </main>

  )

}

