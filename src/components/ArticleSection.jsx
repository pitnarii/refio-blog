import { useState } from "react"
import {blogPosts, filters } from "../data/blogPosts"
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

  const filteredArticles = blogPosts.filter((article) => {
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
  function BlogCard({image, category, title, description, author, date}) {
    return (
      <div className="flex flex-col gap-4">
        <a href="#" className="relative block h-[212px] sm:h-[360px] overflow-hidden rounded-md">
          <img className="h-full w-full object-cover" src={image} alt={title}/>
        </a>
        <div className="flex flex-col">
          <div className="flex">
            <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600 mb-2">{category}</span>
          </div>
          <a href="#">
            <h2 className="text-start font-bold text-xl mb-2 line-clamp-2 hover:underline">
              {title}
            </h2>
          </a>
          <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
            {description}
          </p>
          <div className="flex items-center text-sm">
            <img className="w-8 h-8 rounded-full mr-2" src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg" alt="Tomson P." />
            <span>{author}</span>
            <span className="mx-2 text-gray-300">|</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <section className="py-10">
      <h2 className="mb-6 text-left text-xl font-bold text-gray-900">
        Latest articles
      </h2>

      <div className="mb-10 flex flex-col gap-4 rounded-2xl bg-[#EFEEEB] p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative order-1 w-full sm:order-2 sm:w-auto sm:min-w-[240px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-sm py-3 placeholder:text-muted-foreground focus-visible:border-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
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

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {blogPosts.slice(0, 6).map((post) => (
          <BlogCard
            key={post.id}
            image={post.image}
            category={post.category}
            title={post.title}
            description={post.description}
            author={post.author}
            date={post.date}
          />
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
