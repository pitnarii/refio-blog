import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import HeroSection from "./components/Hero"
import ArticleSection from "./components/ArticleSection"
import Footer from "./components/Footer"
import ViewPostPage from "./pages/viewPostPage"
import NotFoundPage from "./pages/notFoundPage"
import SignupPage from "./pages/signupPage"
import SignupSuccessPage from "./pages/signupSuccess"
import LoginPage from "./pages/loginPage"
import ProfilePage from "./pages/profilePage"
import ResetPasswordPage from "./pages/resetPasswordPage"
import { Toaster } from "@/components/ui/sonner"

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
      <Toaster position="bottom-right" />
      <Navbar />
      <div className="mx-auto w-full max-w-page px-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/viewPostPage/:id" element={<ViewPostPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/success" element={<SignupSuccessPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </div>
    </div>
  )
}

export default App
