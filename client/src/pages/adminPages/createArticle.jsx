import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ImageIcon } from "lucide-react"
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
import { Label } from "client/src/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "client/src/components/ui/select"
import { cn } from "client/src/lib/utils"
import {
  getArticleById,
  saveArticle,
  updateArticle,
} from "client/src/lib/articles"
import { getCategoryNames } from "client/src/lib/categories"
import { getCurrentUser, showAdminPanel } from "client/src/lib/auth"

const createArticleSchema = z.object({
  category: z.string().min(1, "Category is required"),
  title: z.string().min(1, "Title is required"),
  introduction: z
    .string()
    .min(1, "Introduction is required")
    .max(120, "Introduction must be at most 120 characters"),
  content: z.string().min(1, "Content is required"),
})

const inputClassName =
  "rounded-lg border-gray-200 bg-white focus-visible:ring-0 focus-visible:ring-offset-0"

const inputErrorClassName =
  "border-destructive text-destructive focus-visible:border-destructive"

export default function CreateArticle() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  const fileInputRef = useRef(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [authorName, setAuthorName] = useState("Thompson P.")

  const form = useForm({
    resolver: zodResolver(createArticleSchema),
    defaultValues: {
      category: "",
      title: "",
      introduction: "",
      content: "",
    },
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
      const article = getArticleById(id)

      if (!article) {
        navigate("/admin/article-management")
        return
      }

      form.reset({
        category: article.category,
        title: article.title,
        introduction: article.introduction ?? "",
        content: article.content ?? "",
      })
      setThumbnail(article.thumbnail ?? null)
      setAuthorName(article.author ?? user.name ?? "Thompson P.")
      return
    }

    setAuthorName(user.name || "Thompson P.")
  }, [form, id, isEditing, navigate])

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
      setThumbnail(reader.result)
    }
    reader.readAsDataURL(file)
    event.target.value = ""
  }

  const handleSave = (status) => {
    form.handleSubmit((values) => {
      const articleData = {
        title: values.title.trim(),
        category: values.category,
        status,
        introduction: values.introduction.trim(),
        content: values.content.trim(),
        author: authorName,
        thumbnail,
      }

      if (isEditing) {
        updateArticle(id, articleData)

        if (status === "published") {
          toast.success("Article updated and published", {
            description: "Your article has been successfully published",
          })
        } else {
          toast.success("Article updated as draft", {
            description: "Your article has been saved as draft",
          })
        }
      } else {
        saveArticle(articleData)

        if (status === "published") {
          toast.success("Create article and published", {
            description: "Your article has been successfully published",
          })
        } else {
          toast.success("Create article as draft", {
            description: "Your article has been saved as draft",
          })
        }
      }

      navigate("/admin/article-management")
    })()
  }

  return (
    <div className="flex min-h-screen bg-[#EFEEEB]">
      <AdminSidebar active="article-management" />

      <main className="min-w-0 flex-1 px-8 py-10 lg:px-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Edit article" : "Create article"}
          </h1>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSave("draft")}
              className="h-11 rounded-full border-gray-900 bg-white px-6 text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              Save as draft
            </Button>
            <Button
              type="button"
              onClick={() => handleSave("published")}
              className="h-11 rounded-full bg-gray-900 px-6 text-sm font-medium text-white hover:bg-gray-700"
            >
              Save and publish
            </Button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <Form {...form}>
            <form className="space-y-6">
              <div className="space-y-3">
                <Label className="text-gray-600">Thumbnail image</Label>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-[#EFEEEB]">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt="Article thumbnail preview"
                      className="aspect-[16/9] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[16/9] items-center justify-center">
                      <ImageIcon className="size-10 text-gray-400" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
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
                  Upload thumbnail image
                </Button>
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Category</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            "h-12 w-full rounded-lg border-gray-200 bg-white",
                            fieldState.error && inputErrorClassName
                          )}
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getCategoryNames().map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label className="text-gray-600">Author name</Label>
                <Input
                  value={authorName}
                  disabled
                  className={cn(
                    inputClassName,
                    "h-12 cursor-not-allowed bg-gray-100 text-gray-500"
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Article title"
                        className={cn(
                          inputClassName,
                          "h-12",
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
                name="introduction"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">
                      Introduction (max 120 letters)
                    </FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Introduction"
                        rows={4}
                        className={cn(
                          "flex min-h-[120px] w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-gray-300",
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
                name="content"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Content</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Content"
                        rows={12}
                        className={cn(
                          "flex min-h-[320px] w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-gray-300",
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
