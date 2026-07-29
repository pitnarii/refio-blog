import { Toaster as Sonner } from "sonner";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, Loader2Icon } from "lucide-react"

const Toaster = ({
  ...props
}) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      closeButton
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: null,
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--success-bg": "#22c55e",
          "--success-text": "#ffffff",
          "--success-border": "#22c55e",
          "--error-bg": "#ef4444",
          "--error-text": "#ffffff",
          "--error-border": "#ef4444",
        }
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
          success:
            "!relative !bg-green-500 !pr-10 !text-white !border-green-500 shadow-lg rounded-lg",
          error:
            "!relative !bg-red-500 !pr-10 !text-white !border-red-500 shadow-lg rounded-lg",
          title: "!text-white font-semibold",
          description: "!text-white/90 text-sm",
          closeButton:
            "!absolute !right-3 !top-3 !left-auto !translate-x-0 !translate-y-0 !text-white !border-white/30 !bg-transparent hover:!bg-white/10",
        },
      }}
      {...props} />
  );
}

export { Toaster }
