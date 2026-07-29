import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "client/src/components/ui/button"
import { Input } from "client/src/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "client/src/components/ui/form"
import { cn } from "client/src/lib/utils"
import {
  isEmailTaken,
  saveRegisteredUser,
} from "client/src/lib/auth"

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Email must be a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
})

const inputClassName =
  "h-12 rounded-lg border-gray-300 bg-white py-3 focus-visible:ring-0 focus-visible:ring-offset-0"

const inputErrorClassName =
  "border-destructive text-destructive focus-visible:border-destructive"

export default function SignupPage() {
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
  })

  const onSubmit = (data) => {
    if (isEmailTaken(data.email)) {
      form.setError("email", {
        type: "manual",
        message: "Email is already taken, Please try another email.",
      })
      return
    }

    saveRegisteredUser(data)
    navigate("/signup/success")
  }

  return (
    <main className="flex min-h-[calc(100vh-280px)] items-center justify-center py-12">
      <div className="w-full max-w-[440px] rounded-2xl bg-[#EFEEEB] px-8 py-10 sm:px-10">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Sign up
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Full name"
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
              name="username"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Username"
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
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Email"
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
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
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

            <Button
              type="submit"
              className="mt-2 h-12 w-full rounded-full bg-gray-900 text-base font-medium text-white hover:bg-gray-700"
            >
              Sign up
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-gray-900 underline underline-offset-4 hover:text-gray-600"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}
