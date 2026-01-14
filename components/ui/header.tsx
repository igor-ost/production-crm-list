"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ShoppingCart,
  Users,
  Package,
  BookOpen,
  UserCog,
  BarChart3,
  GalleryVerticalEnd,
  BookAudio,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { locationStore } from "@/store/location-store"
import { Api } from "@/services/api-clients"
import { usePathname, useRouter } from "next/navigation"

const menuItems = [
  {
    label: "Заказы",
    icon: ShoppingCart,
    href: "/orders",
  },
  {
    label: "Заказчики",
    icon: Users,
    href: "/customers",
  },
  {
    label: "Материалы",
    icon: Package,
    href: "/materials",
  },
  {
    label: "Шаблоны",
    icon: BookAudio,
    href: "/templates",
  },
  {
    label: "Журнал",
    icon: BookOpen,
    href: "/journal",
  },
  {
    label: "Персонал",
    icon: UserCog,
    href: "/staff",
  },
  {
    label: "Отчёты",
    icon: BarChart3,
    href: "/reports",
  },
]

export function Header() {
  const pathname = usePathname()
  const setByPath = locationStore((state) => state.setByPath)
  const { title } = locationStore()
  const router = useRouter()
  const [activeItem, setActiveItem] = useState(title)
  const { setTitle, setDescription } = locationStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setActiveItem(title)
  }, [title])

  useEffect(() => {
    const handleProfile = async () => {
      try {
        await Api.auth.profile()
        setByPath(pathname)
      } catch (error) {
        router.push("/")
      }
    }
    handleProfile()
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <GalleryVerticalEnd className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-foreground">CRM</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.label

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => {
                  setActiveItem(item.label)
                  setTitle(item.label)
                  setDescription("")
                }}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground hover:bg-muted transition-colors md:hidden"
            aria-label="Меню"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t bg-white md:hidden">
          <nav className="flex flex-col p-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.label

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    setActiveItem(item.label)
                    setTitle(item.label)
                    setDescription("")
                    setMobileMenuOpen(false)
                  }}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
