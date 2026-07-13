import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import {filters} from "../data/blogPosts"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// function for changing date format
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function ArticleSection() {
  const [activeFilter, setActiveFilter] = useState("Highlight")
  const [searchQuery, setSearchQuery] = useState("")
// fetching data from api
  const [blogPosts, setPosts] = useState([])
// pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [activeFilter]);

  useEffect(() => {
    const getPosts = async () => {
      setIsLoading(true);
      try {
        const categoryParam = activeFilter === "Highlight" ? "" : activeFilter;

        const response = await axios.get(
          "https://blog-post-project-api.vercel.app/posts",
          {
            params: {
              page,
              limit: 6,
              category: categoryParam,
            },
          }
        );

        setPosts((prevPosts) =>
          page === 1
            ? response.data.posts
            : [...prevPosts, ...response.data.posts]
        );

        if (response.data.currentPage >= response.data.totalPages) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getPosts();
  }, [page, activeFilter]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const filteredArticles = blogPosts.filter((article) => {
    const matchesFilter =
      activeFilter === "Highlight" || article.category === activeFilter

    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })
  function BlogCard({ id, image, category, title, description, author, date }) {
    return (
      <div className="flex flex-col gap-4">
        <a href="#" className="relative block h-[212px] sm:h-[360px] overflow-hidden rounded-md">
          <img className="h-full w-full object-cover" src={image} alt={title}/>
        </a>
        <div className="flex flex-col">
          <div className="flex">
            <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600 mb-2">{category}</span>
          </div>
          <Link to={`/viewPostPage/${id}`}>
            <h2 className="text-start font-bold text-xl mb-2 line-clamp-2 hover:underline">
              {title}
            </h2>
          </Link>
          <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
            {description}
          </p>
          <div className="flex items-center text-sm">
            <img className="w-8 h-8 rounded-full mr-2" src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg" alt="Tomson P." />
            <span>{author}</span>
            <span className="mx-2 text-gray-300">|</span>
            <span>{formatDate(date)}</span>
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
        {filteredArticles.map((post) => (
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
      {/* ปุ่มโหลดเพิ่ม */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="hover:text-muted-foreground font-medium underline"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "View more"}
          </button>
        </div>
      )}
    </section>
  )
}
