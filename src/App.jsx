import { Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import HeroSection from "./components/Hero"
import ArticleSection from "./components/ArticleSection"
import Footer from "./components/Footer"
import ViewPostPage from "./pages/publicPages/viewPostPage"
import NotFoundPage from "./pages/publicPages/notFoundPage"
import SignupPage from "./pages/publicPages/signupPage"
import SignupSuccessPage from "./pages/publicPages/signupSuccess"
import LoginPage from "./pages/publicPages/loginPage"
import ProfilePage from "./pages/publicPages/profilePage"
import ResetPasswordPage from "./pages/publicPages/resetPasswordPage"
import ArticleManagement from "./pages/adminPages/articleManagement"
import CreateArticle from "./pages/adminPages/createArticle"
import CategoryManage from "./pages/adminPages/categoryManage"
import CreateCategory from "./pages/adminPages/createCategory"
import AdminProfile from "./pages/adminPages/adminProfile"
import NotificationPage from "./pages/adminPages/notificationPage"
import ResetAdminPwd from "./pages/adminPages/resetAdminPwd"
import { Toaster } from "@/components/ui/sonner"

function HomePage() {
  return (
    <>
      <HeroSection />
      <ArticleSection />
    </>
  )
}

function MainLayout({ children }) {
  return (
    <div className="mx-auto w-full max-w-page px-10">
      {children}
      <Footer />
    </div>
  )
}

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith("/admin")

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-gray-900">
      <Toaster position="bottom-right" />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/admin/article-management" element={<ArticleManagement />} />
        <Route path="/admin/create-article" element={<CreateArticle />} />
        <Route path="/admin/create-article/:id" element={<CreateArticle />} />
        <Route path="/admin/category-management" element={<CategoryManage />} />
        <Route path="/admin/create-category" element={<CreateCategory />} />
        <Route path="/admin/create-category/:id" element={<CreateCategory />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/notifications" element={<NotificationPage />} />
        <Route path="/admin/reset-password" element={<ResetAdminPwd />} />
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route
          path="/viewPostPage/:id"
          element={
            <MainLayout>
              <ViewPostPage />
            </MainLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <MainLayout>
              <SignupPage />
            </MainLayout>
          }
        />
        <Route
          path="/signup/success"
          element={
            <MainLayout>
              <SignupSuccessPage />
            </MainLayout>
          }
        />
        <Route
          path="/login"
          element={
            <MainLayout>
              <LoginPage />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          }
        />
        <Route
          path="/reset-password"
          element={
            <MainLayout>
              <ResetPasswordPage />
            </MainLayout>
          }
        />
        <Route
          path="*"
          element={
            isAdminRoute ? (
              <NotFoundPage />
            ) : (
              <MainLayout>
                <NotFoundPage />
              </MainLayout>
            )
          }
        />
      </Routes>
    </div>
  )
}

export default App
