// const authorAvatar =
//   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"

export default function ArticleCard({ article }) {
  return (
    <article className="text-left">
      <img
        src={article.image}
        alt={article.title}
        className="aspect-[16/10] w-full rounded-2xl object-cover"
      />
      <span className="mt-4 inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
        {article.category}
      </span>
      <h3 className="mt-3 text-lg font-bold leading-snug text-gray-900">
        {article.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
        {article.excerpt}
      </p>
      <div className="mt-4 flex items-center gap-2">
        <img
          src={authorAvatar}
          alt={article.author}
          className="h-7 w-7 rounded-full object-cover"
        />
        <span className="text-xs text-gray-500">
          {article.author}{" "}
          <span className="text-gray-400">{article.date}</span>
        </span>
      </div>
    </article>
  )
}
