import type React from "react"
import { cn } from "@/lib/utils"

type AuthLayoutProps = {
  title: string
  subtitle?: string
  children: React.ReactNode
  imageAlt?: string
  className?: string
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  imageAlt = "Illustration: calm collaboration",
  className,
}: AuthLayoutProps) {
  return (
    <main className={cn("min-h-dvh grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-indigo-50 to-purple-50", className)}>
      <section className="order-2 md:order-1 flex items-center justify-center p-6 md:p-10" aria-labelledby="auth-title">
        <div className="w-full max-w-lg space-y-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
          </div>
          <header className="space-y-2 text-center">
            <h1 id="auth-title" className="text-3xl font-bold tracking-tight text-balance bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
              {title}
            </h1>
            {subtitle ? <p className="text-base text-muted-foreground text-pretty mt-2">{subtitle}</p> : null}
          </header>
          {children}
        </div>
      </section>

      <section className="order-1 md:order-2 relative hidden md:block">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 z-10"></div>
        <img
          alt={imageAlt}
          src="/img/backgrounds/calm-minimal-collaboration-illustration.jpg"
          className="object-cover w-full h-full"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
        <div className="absolute bottom-8 left-8 z-20">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">Mira</h2>
          <p className="text-indigo-100 drop-shadow">Where Wonder Meets Collaboration</p>
        </div>
      </section>
    </main>
  )
}