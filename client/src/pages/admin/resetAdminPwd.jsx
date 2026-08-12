import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X } from "lucide-react"
import { toast } from "sonner"
import AdminSidebar from "@/components/AdminSidebar"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  getCurrentUser,
  showAdminPanel,
  updateUserPassword,
  verifyCurrentPassword,
} from "@/lib/auth"

const resetPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })

const inputClassName =
  "h-12 rounded-lg border-gray-200 bg-white focus-visible:ring-0 focus-visible:ring-offset-0"

const inputErrorClassName =
  "border-destructive text-destructive focus-visible:border-destructive"

export default function ResetAdminPwd() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const pendingValuesRef = useRef(null)

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onSubmit",
  })

  useEffect(() => {
    const currentUser = getCurrentUser()

    if (!currentUser) {
      navigate("/login")
      return
    }

    if (!showAdminPanel(currentUser)) {
      navigate("/")
      return
    }

    setUser(currentUser)
  }, [navigate])

  const onSubmit = async (values) => {
    const isValid = await verifyCurrentPassword(values.currentPassword)

    if (!isValid) {
      form.setError("currentPassword", {
        type: "manual",
        message: "Current password is incorrect",
      })
      return
    }

    pendingValuesRef.current = values
    setDialogOpen(true)
  }

  const handleConfirmReset = async () => {
    const values = pendingValuesRef.current
    if (!values || !user) return

    try {
      await updateUserPassword(values.currentPassword, values.newPassword)

      form.reset()
      setDialogOpen(false)

      toast.success("Password reset", {
        description: "Your password has been successfully updated",
      })

      pendingValuesRef.current = null
    } catch {
      toast.error("Unable to reset password", {
        description: "Please check your current password and try again",
      })
    }
  }

  const handleCancel = () => {
    pendingValuesRef.current = null
    setDialogOpen(false)
  }

  const handleDialogOpenChange = (open) => {
    setDialogOpen(open)
    if (!open) {
      pendingValuesRef.current = null
    }
  }

  if (!user) {
    return null
  }

  return (
    <>
      <div className="flex min-h-screen bg-[#EFEEEB]">
        <AdminSidebar active="reset-password" />

        <main className="flex min-h-screen min-w-0 flex-1 flex-col p-6 lg:p-8">
          <div className="flex flex-1 flex-col rounded-2xl bg-white p-6 shadow-sm lg:p-8">
            <div className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Reset password
              </h1>
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                className="h-11 rounded-full bg-gray-900 px-8 text-sm font-medium text-white hover:bg-gray-700"
              >
                Reset password
              </Button>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-2xl space-y-5"
              >
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">
                        Current password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Current password"
                          className={cn(
                            inputClassName,
                            fieldState.error && inputErrorClassName
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">
                        New password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="New password"
                          className={cn(
                            inputClassName,
                            fieldState.error && inputErrorClassName
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">
                        Confirm new password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                          className={cn(
                            inputClassName,
                            fieldState.error && inputErrorClassName
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </main>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <AlertDialogContent className="relative max-w-md rounded-2xl px-6 py-8">
          <Button
            type="button"
            onClick={handleCancel}
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3"
            aria-label="Close"
          >
            <X className="size-4" />
          </Button>

          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="text-xl font-bold text-gray-900">
              Reset password
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-gray-600">
              Do you want to reset your password?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-2 border-0 bg-transparent p-0 sm:justify-end">
            <AlertDialogCancel
              onClick={handleCancel}
              className="h-11 rounded-full border-gray-900 bg-white px-8 text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              onClick={handleConfirmReset}
              className="h-11 rounded-full bg-gray-900 px-8 text-sm font-medium text-white hover:bg-gray-700"
            >
              Reset
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
