import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "AI Business Intelligence - Discover Million-Dollar Ideas",
  description: "Our AI scouts 10,000+ data sources daily to surface untapped opportunities in the $394B AI market. Get strategic insights that would cost $50K from McKinsey.",
  keywords: "AI business ideas, startup opportunities, competitive analysis, market research, business intelligence",
  authors: [{ name: "AI Business Intelligence" }],
  openGraph: {
    title: "AI Business Intelligence - Discover Million-Dollar Ideas",
    description: "Discover untapped AI business opportunities before your competitors do",
    type: "website",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Business Intelligence",
    description: "Discover million-dollar AI business ideas before your competitors do",
    images: ["/og-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased min-h-screen`}
        style={{
          backgroundColor: '#0f172a',
          color: '#ffffff'
        }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
