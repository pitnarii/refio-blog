export default function Navbar() {
  return (
    <header className="flex items-center justify-between py-6">
      <a href="/" className="text-2xl font-bold tracking-tight text-gray-900">
        Refio.
      </a>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
        >
          Log in
        </button>
        <button
          type="button"
          className="rounded-full bg-gray-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Sign up
        </button>
      </div>
    </header>
  )
}
