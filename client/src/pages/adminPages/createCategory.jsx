import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import AdminSidebar from "client/src/components/AdminSidebar"
import { Button } from "client/src/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "client/src/components/ui/form"
import { Input } from "client/src/components/ui/input"
import { cn } from "client/src/lib/utils"
import {
  getCategoryById,
  saveCategory,
  updateCategory,
} from "client/src/lib/categories"
import { getCurrentUser, showAdminPanel } from "client/src/lib/auth"

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
})

const inputClassName =
  "h-12 rounded-lg border-gray-200 bg-white focus-visible:ring-0 focus-visible:ring-offset-0"

const inputErrorClassName =
  "border-destructive text-destructive focus-visible:border-destructive"

export default function CreateCategory() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
    mode: "onSubmit",
  })

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

    if (isEditing) {
      const category = getCategoryById(id)

      if (!category) {
        navigate("/admin/category-management")
        return
      }

      form.reset({ name: category.name })
    }
  }, [form, id, isEditing, navigate])

  const handleSave = () => {
    form.handleSubmit((values) => {
      const result = isEditing
        ? updateCategory(id, values.name)
        : saveCategory(values.name)

      if (!result.success && result.error === "duplicate") {
        form.setError("name", {
          type: "manual",
          message: "Category name already exists",
        })
        return
      }

      toast.success(isEditing ? "Category updated" : "Category created", {
        description: isEditing
          ? "Your category has been successfully updated"
          : "Your category has been successfully created",
      })

      navigate("/admin/category-management")
    })()
  }

  return (
    <div className="flex min-h-screen bg-[#EFEEEB]">
      <AdminSidebar active="category-management" />

      <main className="flex min-h-screen min-w-0 flex-1 flex-col p-6 lg:p-8">
        <div className="flex flex-1 flex-col rounded-2xl bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Edit category" : "Create category"}
            </h1>
            <Button
              type="button"
              onClick={handleSave}
              className="h-11 rounded-full bg-gray-900 px-8 text-sm font-medium text-white hover:bg-gray-700"
            >
              Save
            </Button>
          </div>

          <Form {...form}>
            <form className="max-w-xl space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Category name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Category name"
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
  )
}
