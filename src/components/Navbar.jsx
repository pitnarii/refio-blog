export default function Navbar() {
  return (
    <header className="flex items-center justify-between py-6 ">
      <a href="/" className="text-4xl font-bold text-gray-900">
        Refio
        <span className="text-green-500">.</span>
      </a>
      <div className="hidden md:flex space-x-4">
        <button
          type="button"
          className="rounded-full border border-gray-300 px-6 py-2 text-m font-medium text-gray-900 transition-colors hover:text-gray-500"
        >
          Log in
        </button>
        <button
          type="button"
          className="rounded-full bg-gray-900 px-6 py-2 text-m font-medium text-white hover:bg-gray-700 transition-color"
        >
          Sign up
        </button>
      </div>
    </header>
  )
}
