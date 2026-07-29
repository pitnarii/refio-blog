import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Pencil, Plus, Search, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import AdminSidebar from "client/src/components/AdminSidebar"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "client/src/components/ui/alert-dialog"
import { Button, buttonVariants } from "client/src/components/ui/button"
import { Input } from "client/src/components/ui/input"
import {
  CATEGORIES_CHANGED_EVENT,
  deleteCategory,
  getCategories,
} from "client/src/lib/categories"
import { getCurrentUser, showAdminPanel } from "client/src/lib/auth"

export default function CategoryManage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState(() => getCategories())
  const [search, setSearch] = useState("")
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
    const syncCategories = () => setCategories(getCategories())

    syncCategories()
    window.addEventListener(CATEGORIES_CHANGED_EVENT, syncCategories)
    return () => window.removeEventListener(CATEGORIES_CHANGED_EVENT, syncCategories)
  }, [])

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return categories.filter((category) =>
      keyword === "" ? true : category.name.toLowerCase().includes(keyword)
    )
  }, [categories, search])

  const handleDeleteClick = (categoryId) => {
    pendingDeleteIdRef.current = categoryId
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

  const handleConfirmDelete = () => {
    const categoryId = pendingDeleteIdRef.current
    if (!categoryId) return

    deleteCategory(categoryId)
    setDialogOpen(false)

    toast.success("Category deleted", {
      description: "The category has been removed from your list",
    })

    pendingDeleteIdRef.current = null
  }

  return (
    <>
      <div className="flex min-h-screen bg-[#EFEEEB]">
        <AdminSidebar active="category-management" />

        <main className="flex min-h-screen min-w-0 flex-1 flex-col p-6 lg:p-8">
          <div className="flex flex-1 flex-col rounded-2xl bg-white p-6 shadow-sm lg:p-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Category management
              </h1>
              <Link
                to="/admin/create-category"
                className={buttonVariants({
                  className:
                    "h-11 rounded-full bg-gray-900 px-6 text-sm font-medium text-white hover:bg-gray-700",
                })}
              >
                <Plus className="size-4" />
                Create category
              </Link>
            </div>

            <div className="mb-6">
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
            </div>

            <div className="flex-1 overflow-hidden rounded-xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-gray-200 bg-[#EFEEEB] text-sm text-gray-500">
                      <th className="px-6 py-4 font-medium">Category</th>
                      <th className="px-6 py-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((category) => (
                        <tr
                          key={category.id}
                          className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                        >
                          <td className="px-6 py-5 text-sm font-medium text-gray-900">
                            {category.name}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/admin/create-category/${category.id}`}
                                aria-label="Edit category"
                                className="flex size-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                              >
                                <Pencil className="size-4" />
                              </Link>
                              <button
                                type="button"
                                aria-label="Delete category"
                                onClick={() => handleDeleteClick(category.id)}
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
                          colSpan={2}
                          className="px-6 py-10 text-center text-sm text-gray-500"
                        >
                          No categories found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
              Delete category
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-gray-600">
              Do you want to delete this category?
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
