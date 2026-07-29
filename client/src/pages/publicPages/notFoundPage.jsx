import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[calc(100vh-280px)] flex-col items-center justify-center py-20">
      <div
        className="flex size-16 items-center justify-center rounded-full bg-gray-900 text-white"
        aria-hidden="true"
      >
        <span className="text-2xl font-bold leading-none">!</span>
      </div>

      <h1 className="mt-6 text-2xl font-bold text-gray-900">Page Not Found</h1>

      <Link
        to="/"
        className="mt-8 rounded-full bg-gray-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700"
      >
        Go To Homepage
      </Link>
    </main>
  );
}
