import { Link } from "react-router-dom"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SignupSuccessPage() {
  return (
    <main className="flex min-h-[calc(100vh-280px)] items-center justify-center py-12">
      <div className="flex w-full max-w-[440px] flex-col items-center rounded-2xl bg-[#EFEEEB] px-8 py-14 sm:px-10">
        <div
          className="flex size-16 items-center justify-center rounded-full bg-green-500 text-white"
          aria-hidden="true"
        >
          <Check className="size-8 stroke-[3]" />
        </div>

        <h1 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Registration success
        </h1>

        <Button
          render={
            <Link
              to="/"
              className="mt-8 h-12 rounded-full bg-gray-900 px-12 text-base font-medium text-white hover:bg-gray-700"
            />
          }
        >
          Continue
        </Button>
      </div>
    </main>
  )
}
