import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Heart, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";

const AUTHOR_AVATAR =
  "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg";

const MOCK_COMMENTS = [
  {
    id: 1,
    name: "Jacob Josh",
    avatar: AUTHOR_AVATAR,
    date: "12 September 2024 at 18:30",
    text: "I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.",
  },
  {
    id: 2,
    name: "Ahri",
    avatar: AUTHOR_AVATAR,
    date: "12 September 2024 at 18:30",
    text: "Such a great read! I've always wondered why my cat slow blinks at me—now I know it's her way of showing trust!",
  },
  {
    id: 3,
    name: "Mimi mama",
    avatar: AUTHOR_AVATAR,
    date: "12 September 2024 at 18:30",
    text: "This article perfectly captures why cats make such amazing pets. I shared it with my friends who don't understand cats!",
  },
];

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getCategoryStyles(category) {
  const styles = {
    Cat: "bg-teal-100 text-teal-700",
    General: "bg-green-100 text-green-700",
    Inspiration: "bg-purple-100 text-purple-700",
  };
  return styles[category] ?? "bg-gray-100 text-gray-700";
}

function ViewPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    const getPost = async () => {
      try {
        const { data } = await axios(
          `https://blog-post-project-api.vercel.app/posts/${id}`,
        );
        setPost(data);
        setLikes(data.likes);
      } catch (err) {
        console.log(err);
      }
    };

    getPost();
  }, [id]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    if (liked) {
      setLikes((prev) => prev - 1);
    } else {
      setLikes((prev) => prev + 1);
    }
    setLiked(!liked);
  };

  if (!post) {
    return (
      <div className="py-20 text-center text-muted-foreground">Loading...</div>
    );
  }

  const handleSendComment = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }
    console.log("Sending comment:", comment);
  };

  return (
    <article className="py-8">
      <img
        src={post.image}
        alt={post.title}
        className="mb-8 h-[460px] w-full rounded-2xl object-cover"
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px] lg:items-start">
        <div>
          <div className="mb-4 flex items-center gap-4">
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${getCategoryStyles(post.category)}`}
            >
              {post.category}
            </span>
            <span className="text-sm text-muted-foreground">
              {formatDate(post.date)}
            </span>
          </div>

          <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {post.title}
          </h1>

          <div className="markdown">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-2xl bg-[#EFEEEB] p-6">
            <div className="mb-4 flex items-center gap-3">
              <img
                src={AUTHOR_AVATAR}
                alt={post.author}
                className="size-11 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-gray-900">{post.author}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">
              {post.description}
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-8">
        <button
          type="button"
          onClick={handleLike}
          className={`flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-medium transition-colors ${
            liked
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Heart
            className={`size-4 ${liked ? "fill-red-500 text-red-500" : ""}`}
          />
          {likes}
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
        >
          <Link2 className="size-4" />
          {copied ? "Copied!" : "Copy link"}
        </button>

        <div className="flex items-center gap-2">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="flex size-11 items-center justify-center rounded-full bg-[#1877F2] text-white transition-opacity hover:opacity-90"
            aria-label="Share on Facebook"
          >
            <svg viewBox="0 0 24 24" className="size-5 fill-current">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="flex size-11 items-center justify-center rounded-full bg-[#0A66C2] text-white transition-opacity hover:opacity-90"
            aria-label="Share on LinkedIn"
          >
            <svg viewBox="0 0 24 24" className="size-5 fill-current">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="flex size-11 items-center justify-center rounded-full bg-[#1DA1F2] text-white transition-opacity hover:opacity-90"
            aria-label="Share on Twitter"
          >
            <svg viewBox="0 0 24 24" className="size-5 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Comment</h2>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What are your thoughts?"
          className="mb-4 min-h-[120px] w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-muted-foreground focus:border-gray-400 focus:outline-none"
        />
        <div className="flex justify-end">
          <Button type="button" onClick={handleSendComment}>
            Send
          </Button>
          {/* create account alert */}
          <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
            <AlertDialogContent size="sm">
              <Button 
              onClick={() => setShowLoginDialog(false)} //close an alert box with 'X'
              variant="ghost" size="icon" className="absolute top-2 right-2 " aria-label="Close or Delete">
                <X className="h-4 w-4" />
              </Button>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-center font-bold text-xl mt-6">
                  Create an account to continue
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogAction className="bg-gray-900 text-white rounded-full w-1/2 mx-auto h-10">Create account</AlertDialogAction>
              <AlertDialogDescription className={"flex justify-center gap-2"}>
                Already have an account?{" "}
                <a href="#" className="text-black font-bold">
                  Log in
                </a>
              </AlertDialogDescription>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="mt-10 space-y-8">
          {MOCK_COMMENTS.map((item) => (
            <div key={item.id} className="flex gap-4">
              <img
                src={item.avatar}
                alt={item.name}
                className="size-11 shrink-0 rounded-full object-cover"
              />
              <div>
                <div className="mb-1 flex flex-wrap items-baseline gap-2">
                  <span className="font-semibold text-gray-900">
                    {item.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {item.date}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-700">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

export default ViewPostPage;
