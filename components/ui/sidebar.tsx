"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingCart, Users, Package, BookOpen, UserCog, BarChart3, GalleryVerticalEndIcon, BookAudio } from "lucide-react"
import { cn } from "@/lib/utils"
import { locationStore } from "@/store/location-store"
import { Api } from "@/services/api-clients"
import { usePathname, useRouter } from "next/navigation"

const menuItems = [
  {
    label: "Заказы",
    description: "Список ваших заказов",
    icon: ShoppingCart,
    href: "/orders",
  },
  {
    label: "Заказчики",
    description: "Список заказчиков",
    icon: Users,
    href: "/customers",
  },
  {
    label: "Материалы",
    description: "Список доступных материалов",
    icon: Package,
    href: "/materials",
  },
  {
    label: "Шаблоны изделий",
    description: "Список шаблонов для изделий",
    icon: BookAudio,
    href: "/templates",
  },
  {
    label: "Журнал",
    description: "Журнал выполненных работа",
    icon: BookOpen,
    href: "/journal",
  },
  {
    label: "Персонал",
    description: "Список работников",
    icon: UserCog,
    href: "/staff",
  },
  {
    label: "Отчёты",
    description: "Генерация отчётов",
    icon: BarChart3,
    href: "/reports",
  },
]

export function Sidebar() {
  const pathname = usePathname();
  const setByPath = locationStore((state) => state.setByPath);
  const { title } = locationStore();
  const router = useRouter();
  const [activeItem, setActiveItem] = useState(title)
  const {setTitle,setDescription} = locationStore();
  
  useEffect(()=>{
    setActiveItem(title)
  },[title])

  useEffect(()=>{
    const handleProfile = async () =>{
      try {
        await Api.auth.profile()
        setByPath(pathname);
      } catch (error) {
        router.push("/")
      }
    }
    handleProfile()
  },[])

  return (
    <aside className="flex w-[80px] flex-col border-r border-[#1a2942] bg-[#0f1d30] shadow-2xl">
      <div className="border-b border-[#1a2942] p-4">
        <div
          className="flex flex-col items-center gap-2 rounded-lg p-2 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/20">
            <GalleryVerticalEndIcon className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-medium">CRM</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.label

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => {setActiveItem(item.label);setTitle(item.label);setDescription(item.description)}}
              className={cn(
                "group relative flex flex-col items-center gap-2 rounded-lg p-3 transition-all duration-200",
                isActive
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg"
                  : "text-white/70 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-center text-[10px] font-medium leading-tight">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
