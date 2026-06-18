import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import ArticleSection from "./components/ArticleSection"
import Footer from "./components/Footer"

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-6xl px-6">
        <Navbar />
        <Hero />
        <ArticleSection />
        <Footer />
      </div>
    </div>
  )
}

export default App
