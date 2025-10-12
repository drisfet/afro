import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { QueryProvider } from "@/providers/query-provider"
import { CategoryTransitionProvider } from "@/providers/category-transition-provider"
import { Toaster } from "@/components/ui/toaster"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <QueryProvider>
          <CategoryTransitionProvider>
            <main className="relative">{props.children}</main>
            <Toaster />
          </CategoryTransitionProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
