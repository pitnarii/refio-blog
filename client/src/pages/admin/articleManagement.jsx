import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Pencil, Plus, Search, Trash2, X } from "lucide-react"
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
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { articleStatuses } from "@/data/adminArticles"
import { getCategoryNames } from "@/lib/categories"
import { deletePost, getAdminPosts } from "@/lib/posts"
import { getCurrentUser, showAdminPanel } from "@/lib/auth"

function StatusBadge({ status }) {
  const isPublished = status === "published"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium capitalize",
        isPublished ? "text-green-600" : "text-gray-500"
      )}
    >
      <span
        className={cn(
          "size-2 rounded-full",
          isPublished ? "bg-green-500" : "bg-gray-400"
        )}
      />
      {isPublished ? "Published" : "Draft"}
    </span>
  )
}

export default function ArticleManagement() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const pendingDeleteIdRef = useRef(null)

  useEffect(() => {
    const user = getCurrentUser()

    if (!user) {
      navigate("/login")
      return
    }

    if (!showAdminPanel(user)) {
      navigate("/")
    }
  }, [navigate])

  useEffect(() => {
    let cancelled = false

    async function fetchArticles() {
      try {
        const data = await getAdminPosts()
        if (!cancelled) {
          setArticles(data)
        }
      } catch {
        if (!cancelled) {
          toast.error("Failed to load articles")
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchArticles()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredArticles = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return articles.filter((article) => {
      const matchesSearch =
        keyword === "" || article.title.toLowerCase().includes(keyword)

      const matchesStatus =
        statusFilter === "all" || article.status === statusFilter

      const matchesCategory =
        categoryFilter === "all" || article.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [articles, search, statusFilter, categoryFilter])

  const handleDeleteClick = (articleId) => {
    pendingDeleteIdRef.current = articleId
    setDialogOpen(true)
  }

  const handleCancelDelete = () => {
    pendingDeleteIdRef.current = null
    setDialogOpen(false)
  }

  const handleDialogOpenChange = (open) => {
    setDialogOpen(open)
    if (!open) {
      pendingDeleteIdRef.current = null
    }
  }

  const handleConfirmDelete = async () => {
    const articleId = pendingDeleteIdRef.current
    if (!articleId) return

    try {
      await deletePost(articleId)
      setArticles((prev) => prev.filter((article) => article.id !== articleId))
      setDialogOpen(false)

      toast.success("Article deleted", {
        description: "The article has been removed from your list",
      })
    } catch {
      toast.error("Failed to delete article")
    }

    pendingDeleteIdRef.current = null
  }

  return (
    <>
    <div className="flex min-h-screen bg-[#EFEEEB]">
      <AdminSidebar active="article-management" />

      <main className="flex min-h-screen min-w-0 flex-1 flex-col p-6 lg:p-8">
        <div className="flex flex-1 flex-col rounded-2xl bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Article management
            </h1>
            <Link
              to="/admin/create-article"
              className={buttonVariants({
                className:
                  "h-11 rounded-full bg-gray-900 px-6 text-sm font-medium text-white hover:bg-gray-700",
              })}
            >
              <Plus className="size-4" />
              Create article
            </Link>
          </div>

          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-12 rounded-lg border-gray-200 bg-white pl-11 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 min-w-[140px] rounded-lg border-gray-200 bg-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Status</SelectItem>
                  {articleStatuses.map((status) => (
                    <SelectItem key={status} value={status} className="capitalize">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-12 min-w-[140px] rounded-lg border-gray-200 bg-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Category</SelectItem>
                  {getCategoryNames().map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-500">
                  <th className="pb-4 pr-4 font-medium">Article title</th>
                  <th className="pb-4 pr-4 font-medium">Category</th>
                  <th className="pb-4 pr-4 font-medium">Status</th>
                  <th className="pb-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-sm text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <tr
                      key={article.id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="py-5 pr-4 text-sm font-medium text-gray-900">
                        <span className="line-clamp-1">{article.title}</span>
                      </td>
                      <td className="py-5 pr-4 text-sm text-gray-600">
                        {article.category}
                      </td>
                      <td className="py-5 pr-4">
                        <StatusBadge status={article.status} />
                      </td>
                      <td className="py-5">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/create-article/${article.id}`}
                            aria-label="Edit article"
                            className="flex size-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                          >
                            <Pencil className="size-4" />
                          </Link>
                          <button
                            type="button"
                            aria-label="Delete article"
                            onClick={() => handleDeleteClick(article.id)}
                            className="flex size-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-sm text-gray-500"
                    >
                      No articles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>

    <AlertDialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <AlertDialogContent className="relative max-w-md rounded-2xl px-6 py-8">
        <Button
          type="button"
          onClick={handleCancelDelete}
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3"
          aria-label="Close"
        >
          <X className="size-4" />
        </Button>

        <AlertDialogHeader className="text-center sm:text-left">
          <AlertDialogTitle className="text-xl font-bold text-gray-900">
            Delete article
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-600">
            Do you want to delete this article?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2 border-0 bg-transparent p-0 sm:justify-end">
          <AlertDialogCancel
            onClick={handleCancelDelete}
            className="h-11 rounded-full border-gray-900 bg-white px-8 text-sm font-medium text-gray-900 hover:bg-gray-100"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            type="button"
            onClick={handleConfirmDelete}
            className="h-11 rounded-full bg-gray-900 px-8 text-sm font-medium text-white hover:bg-gray-700"
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}
