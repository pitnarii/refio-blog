import Navbar from "./components/Navbar"
import HeroSection from "./components/Hero"
import ArticleSection from "./components/ArticleSection"
import Footer from "./components/Footer"

function App() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] text-gray-900">
       <Navbar />
      <div className="mx-auto w-full max-w-page px-10">
        <HeroSection />
        <ArticleSection />
        <Footer />
      </div>
    </div>
  )
}

export default App
