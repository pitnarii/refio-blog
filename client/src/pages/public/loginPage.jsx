import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { login } from "@/lib/auth"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Email must be a valid email"),
  password: z.string().min(1, "Password is required"),
})

const inputClassName =
  "h-12 rounded-lg border-gray-300 bg-white py-3 focus-visible:ring-0 focus-visible:ring-offset-0"

const inputErrorClassName =
  "border-destructive text-destructive focus-visible:border-destructive"

export default function LoginPage() {
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  })

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password)
      toast.success("Login successful")
      navigate("/")
    } catch {
      form.setError("email", { type: "manual", message: "" })
      form.setError("password", { type: "manual", message: "" })

      toast.error("Your password is incorrect or this email doesn't exist", {
        description: "Please try another password or email",
      })
    }
  }

  const handleFieldChange = (field, value) => {
    field.onChange(value)
    form.clearErrors(["email", "password"])
  }

  return (
    <main className="flex min-h-[calc(100vh-280px)] items-center justify-center py-12">
      <div className="w-full max-w-[440px] rounded-2xl bg-[#EFEEEB] px-8 py-10 sm:px-10">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Log in
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                      onChange={(e) => handleFieldChange(field, e.target.value)}
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
                      onChange={(e) => handleFieldChange(field, e.target.value)}
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
              Log in
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have any account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-gray-900 underline underline-offset-4 hover:text-gray-600"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
