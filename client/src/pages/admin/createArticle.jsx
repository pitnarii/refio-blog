import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ImageIcon } from "lucide-react"
import { toast } from "sonner"
import AdminSidebar from "@/components/AdminSidebar"
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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  createPost,
  getAdminPostById,
  updatePost,
} from "@/lib/posts"
import { getCategoryNames } from "@/lib/categories"
import { getCurrentUser, showAdminPanel } from "@/lib/auth"
import { readFileAsDataURL, uploadImage, validateImageFile } from "@/lib/upload"

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
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [authorName, setAuthorName] = useState("Thompson P.")
  const [isSaving, setIsSaving] = useState(false)

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

    if (!isEditing) {
      setAuthorName(user.name || "Thompson P.")
      return
    }

    let cancelled = false

    async function loadArticle() {
      try {
        const article = await getAdminPostById(id)

        if (cancelled) return

        form.reset({
          category: article.category,
          title: article.title,
          introduction: article.introduction ?? article.description ?? "",
          content: article.content ?? "",
        })
        setThumbnail(article.image ?? article.thumbnail ?? null)
        setThumbnailFile(null)
        setAuthorName(article.author ?? user.name ?? "Thompson P.")
      } catch {
        if (!cancelled) {
          toast.error("Failed to load article")
          navigate("/admin/article-management")
        }
      }
    }

    loadArticle()

    return () => {
      cancelled = true
    }
  }, [form, id, isEditing, navigate])

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
      return
    }

    try {
      setThumbnailFile(file)
      setThumbnail(await readFileAsDataURL(file))
    } catch {
      toast.error("Failed to read the image file")
    }

    event.target.value = ""
  }

  const handleSave = (status) => {
    form.handleSubmit(async (values) => {
      setIsSaving(true)

      try {
        let imageUrl = thumbnail

        if (thumbnailFile) {
          imageUrl = await uploadImage(thumbnailFile)
        }

        const articleData = {
          title: values.title.trim(),
          category: values.category,
          status,
          introduction: values.introduction.trim(),
          content: values.content.trim(),
          thumbnail: imageUrl,
        }

        if (isEditing) {
          await updatePost(id, articleData)

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
          await createPost(articleData)

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
      } catch {
        toast.error("Failed to save article")
      } finally {
        setIsSaving(false)
      }
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
              disabled={isSaving}
              className="h-11 rounded-full border-gray-900 bg-white px-6 text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              {isSaving ? "Saving..." : "Save as draft"}
            </Button>
            <Button
              type="button"
              onClick={() => handleSave("published")}
              disabled={isSaving}
              className="h-11 rounded-full bg-gray-900 px-6 text-sm font-medium text-white hover:bg-gray-700"
            >
              {isSaving ? "Saving..." : "Save and publish"}
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
