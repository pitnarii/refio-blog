import { useState } from "react"
import { articles, filters } from "../data/articles"
import ArticleCard from "./ArticleCard"

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 text-gray-400"
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
        clipRule="evenodd"
      />
    </svg>
  )
}

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

      <div className="mb-10 flex flex-col gap-4 rounded-2xl bg-gray-100 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
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
        <div className="relative">
          <input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-white py-2 pr-10 pl-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none sm:w-56"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
            <SearchIcon />
          </span>
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
