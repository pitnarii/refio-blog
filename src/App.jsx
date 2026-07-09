import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import HeroSection from "./components/Hero"
import ArticleSection from "./components/ArticleSection"
import Footer from "./components/Footer"
import ViewPostPage from "./pages/viewPostPage"
import NotFoundPage from "./pages/notFoundPage"

function HomePage() {
  return (
    <>
      <HeroSection />
      <ArticleSection />
    </>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] text-gray-900">
      <Navbar />
      <div className="mx-auto w-full max-w-page px-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/viewPostPage/:id" element={<ViewPostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </div>
    </div>
  )
}

export default App
