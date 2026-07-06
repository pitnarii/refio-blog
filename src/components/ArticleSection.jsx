import { useState } from "react";
import { blogPosts, filters } from "../data/blogPosts";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

function BlogCard({ image, category, title, description, author, date }) {
  return (
    <Card className="gap-4 border-0 bg-transparent py-0 shadow-none ring-0">
      <a
        href="#"
        className="relative block h-[212px] overflow-hidden rounded-md sm:h-[360px]"
      >
        <img className="h-full w-full object-cover" src={image} alt={title} />
      </a>

      <CardContent className="flex flex-col px-0">
        <Badge className="mb-2 h-auto rounded-full bg-green-200 px-3 py-1 text-sm font-semibold text-green-600">
          {category}
        </Badge>

        <a href="#">
          <CardTitle className="mb-2 line-clamp-2 text-start text-xl font-bold hover:underline">
            {title}
          </CardTitle>
        </a>
        <CardDescription className="mb-4 line-clamp-3 flex-grow text-sm">
          {description}
        </CardDescription>
        <CardFooter className="border-0 bg-transparent p-0 text-sm">
          <img
            className="mr-2 h-8 w-8 rounded-full"
            src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
            alt={author}
          />
          <span>{author}</span>
          <span className="mx-2 text-gray-300">|</span>
          <span>{date}</span>
        </CardFooter>
      </CardContent>
    </Card>
  );
}

export default function ArticleSection() {
  const [activeFilter, setActiveFilter] = useState("Highlight");

  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = blogPosts.filter((article) => {
    const matchesFilter =
      activeFilter === "Highlight" ||
      activeFilter === "General" ||
      article.category === activeFilter;

    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <section className="py-10">
      <h2 className="mb-6 text-left text-xl font-bold text-gray-900">
        Latest articles
      </h2>

      <div className="mb-10 flex flex-col gap-4 rounded-2xl bg-[#EFEEEB] p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative order-1 w-full sm:order-2 sm:w-auto sm:min-w-[240px]">
          <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />

          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 rounded-sm bg-background pr-10 py-3 focus-visible:ring-0"
          />
        </div>

        <div className="order-2 flex flex-wrap gap-2 sm:order-1">
          {filters.map((filter) => (
            <Button
              key={filter}
              type="button"
              variant="ghost"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium ${
                activeFilter === filter
                  ? "bg-[#DAD6D1] text-gray-900 shadow-sm hover:bg-[#DAD6D1]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {filteredArticles.slice(0, 6).map((post) => (
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
        <Button
          variant="link"
          render={<a href="#" />}
          className="text-sm text-gray-900 underline underline-offset-4 hover:text-gray-600"
        >
          View more
        </Button>
      </div>
    </section>
  );
}
