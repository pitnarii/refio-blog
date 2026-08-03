import { BriefcaseBusiness, Camera, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="-mx-6 mt-8 flex flex-col items-center justify-between gap-6 bg-gray-100 px-6 py-10 sm:flex-row sm:px-10">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-900">Get in touch</span>
        <div className="flex items-center gap-2 sm:px-4">
        <a href='https://www.linkedin.com/company/re-fio/' alt="linkedin"> 
          <BriefcaseBusiness size={20} />
        </a>
        <a href='https://github.com' alt="github">
      <Camera size={20} />
        </a>
        <a href="#" alt="email">
          <Send size={20} />
        </a>
        </div>
      </div>
      <a
        href="#"
        className="text-sm text-gray-900 underline underline-offset-4 transition-colors hover:text-gray-600"
      >
        Home page
      </a>
    </footer>
  )
}
