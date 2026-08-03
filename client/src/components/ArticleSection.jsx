import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { filters } from "../data/blogPosts"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api } from "../lib/api"
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function ArticleSection() {
  const [activeFilter, setActiveFilter] = useState("Highlight")
  const [blogPosts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const [searchKeyword, setSearchKeyword] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const isSearchActive = searchKeyword.trim() !== ""

  useEffect(() => {
    setPosts([])
    setPage(1)
    setHasMore(true)
  }, [activeFilter])

  useEffect(() => {
    if (isSearchActive) return

    const getPosts = async () => {
      setIsLoading(true)
      try {
        const categoryParam = activeFilter === "Highlight" ? "" : activeFilter

        const response = await api.get(
          "/api/posts",
          {
            params: {
              page,
              limit: 6,
              category: categoryParam,
            },
          }
        )

        setPosts((prevPosts) =>
          page === 1
            ? response.data.posts
            : [...prevPosts, ...response.data.posts]
        )

        if (response.data.currentPage >= response.data.totalPages) {
          setHasMore(false)
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getPosts()
  }, [page, activeFilter, isSearchActive])

  useEffect(() => {
    if (!isSearchActive) {
      setSuggestions([])
      setSearchResults([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true)
      try {
        const categoryParam = activeFilter === "Highlight" ? "" : activeFilter

        const response = await api.get(
          "/api/posts",
          {
            params: {
              keyword: searchKeyword.trim(),
              limit: 6,
              category: categoryParam,
            },
          }
        )

        const results = response.data.posts
        setSuggestions(results)
        setSearchResults(results)
      } catch (error) {
        console.error("Error searching posts:", error)
        setSuggestions([])
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchKeyword, activeFilter, isSearchActive])

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1)
    }
  }

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value)
    setShowDropdown(true)
  }

  const handleSelectSuggestion = (post) => {
    setSearchKeyword(post.title)
    setSearchResults([post])
    setSuggestions([post])
    setShowDropdown(false)
  }

  const filteredArticles = blogPosts.filter((article) => {
    return activeFilter === "Highlight" || article.category === activeFilter
  })

  const articlesToShow = isSearchActive ? searchResults : filteredArticles

  function BlogCard({ id, image, category, title, description, author, date }) {
    return (
      <div className="flex flex-col gap-4">
        <a href="#" className="relative block h-[212px] overflow-hidden rounded-md sm:h-[360px]">
          <img className="h-full w-full object-cover" src={image} alt={title} />
        </a>
        <div className="flex flex-col">
          <div className="flex">
            <span className="mb-2 rounded-full bg-green-200 px-3 py-1 text-sm font-semibold text-green-600">
              {category}
            </span>
          </div>
          <Link to={`/viewPostPage/${id}`}>
            <h2 className="mb-2 line-clamp-2 text-start text-xl font-bold hover:underline">
              {title}
            </h2>
          </Link>
          <p className="mb-4 line-clamp-3 flex-grow text-sm text-muted-foreground">
            {description}
          </p>
          <div className="flex items-center text-sm">
            <img
              className="mr-2 h-8 w-8 rounded-full"
              src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
              alt="Tomson P."
            />
            <span>{author}</span>
            <span className="mx-2 text-gray-300">|</span>
            <span>{formatDate(date)}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="py-10">
      <h2 className="mb-6 text-left text-xl font-bold text-gray-900">
        Latest articles
      </h2>

      <div className="mb-10 flex flex-col gap-4 rounded-2xl bg-[#EFEEEB] p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative order-1 w-full sm:order-2 sm:w-auto sm:min-w-[240px]">
          {!showDropdown && (
            <Search className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-gray-400" />
          )}
          <Input
            type="text"
            placeholder="Search"
            value={searchKeyword}
            onChange={handleSearchChange}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="rounded-sm py-3 placeholder:text-muted-foreground focus-visible:border-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {showDropdown && isSearchActive && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-sm border border-gray-200 bg-white py-1 shadow-lg">
              {suggestions.map((post) => (
                <li key={post.id}>
                  <button
                    type="button"
                    onMouseDown={() => handleSelectSuggestion(post)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100"
                  >
                    {post.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="order-2 w-full sm:hidden">
          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className="h-10 w-full rounded-sm border-0 bg-white px-4 text-sm font-medium text-gray-900 shadow-sm">
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

        <div className="order-3 hidden flex-wrap gap-2 sm:order-1 sm:flex">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-[#DAD6D1] text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {isSearching && (
        <p className="mb-4 text-sm text-muted-foreground">Searching...</p>
      )}

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {articlesToShow.map((post) => (
          <BlogCard
            key={post.id}
            id={post.id}
            image={post.image}
            category={post.category}
            title={post.title}
            description={post.description}
            author={post.author}
            date={post.date}
          />
        ))}
      </div>

      {isSearchActive && !isSearching && articlesToShow.length === 0 && (
        <p className="mt-8 text-center text-muted-foreground">
          No articles found for &quot;{searchKeyword}&quot;
        </p>
      )}

      {hasMore && !isSearchActive && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            className="font-medium underline hover:text-muted-foreground"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "View more"}
          </button>
        </div>
      )}
    </section>
  )
}
