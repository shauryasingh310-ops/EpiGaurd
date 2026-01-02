import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { WavyBackground } from "@/components/wavy-background"
import { ErrorBoundary } from "@/components/error-boundary"
import { I18nProvider } from "@/components/i18n-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EpiGuard - Disease Outbreak Dashboard",
  description: "Smart water-borne disease tracking and prediction for India",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#8884d8",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EpiGuard",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8884d8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`font-sans antialiased`}>
        <ErrorBoundary>
          <I18nProvider>
            <WavyBackground />
            <div className="relative z-10 w-full h-full">
              {children}
            </div>
            <Analytics />
          </I18nProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
