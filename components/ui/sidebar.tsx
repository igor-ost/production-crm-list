"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Users, Package, BookOpen, UserCog, BarChart3, Bell, User } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    label: "Заказы",
    icon: ShoppingCart,
    href: "/dashboard",
  },
  {
    label: "Заказчики",
    icon: Users,
    href: "/dashboard/customers",
  },
  {
    label: "Материалы",
    icon: Package,
    href: "/dashboard/materials",
  },
  {
    label: "Журнал",
    icon: BookOpen,
    href: "/dashboard/journal",
  },
  {
    label: "Персонал",
    icon: UserCog,
    href: "/dashboard/staff",
  },
  {
    label: "Отчёты",
    icon: BarChart3,
    href: "/dashboard/reports",
  },
]

export function Sidebar() {
  const [activeItem, setActiveItem] = useState("Заказы")

  return (
    <aside className="flex w-[80px] flex-col border-r border-[#1a2942] bg-[#0f1d30] shadow-2xl">
      <div className="border-b border-[#1a2942] p-4">
        <Link
          href="/dashboard/account"
          className="flex flex-col items-center gap-2 rounded-lg p-2 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/20">
            <User className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-medium">Аккаунт</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.label

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setActiveItem(item.label)}
              className={cn(
                "group relative flex flex-col items-center gap-2 rounded-lg p-3 transition-all duration-200",
                isActive
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg"
                  : "text-white/70 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-center text-[10px] font-medium leading-tight">{item.label}</span>

              {isActive && (
                <div className="absolute left-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full bg-white" />
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
