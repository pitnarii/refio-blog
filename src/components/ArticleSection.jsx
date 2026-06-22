import { useState } from "react"
import { articles, filters } from "../data/articles"
import ArticleCard from "./ArticleCard"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ArticleSection() {
  const [activeFilter, setActiveFilter] = useState("Highlight")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredArticles = articles.filter((article) => {
    const matchesFilter =
      activeFilter === "Highlight" ||
      activeFilter === "General" ||
      article.category === activeFilter

    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  return (
    <section className="py-10">
      <h2 className="mb-6 text-left text-xl font-bold text-gray-900">
        Latest articles
      </h2>

      <div className="mb-10 flex flex-col gap-4 rounded-2xl bg-[#EFEEEB] p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:hidden">
          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className="h-10 w-full rounded-full border-0 bg-white px-4 text-sm font-medium text-gray-900 shadow-sm">
              <SelectValue placeholder="Highlight" />
            </SelectTrigger>
            <SelectContent>
              {filters.map((filter) => (
                <SelectItem key={filter} value={filter}>
                  {filter}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="hidden flex-wrap gap-2 sm:flex">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-auto sm:min-w-[240px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-sm py-3 placeholder:text-muted-foreground focus-visible:border-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {filteredArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <a
          href="#"
          className="text-sm text-gray-900 underline underline-offset-4 transition-colors hover:text-gray-600"
        >
          View more
        </a>
      </div>
    </section>
  )
}
