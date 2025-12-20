"use client"

import { locationStore } from "@/store/location-store"


export function TopHeader() {
  const {title,description} = locationStore() 
  return (
    <header className="flex h-18 items-center justify-between border-b border-[#1a2942] bg-[#0f1d30] px-6 shadow-md">
      <div>
        <h1 className="font-semibold uppercase tracking-wide text-white">{title}</h1>
        <p className="text-sm tracking-wide text-gray-300">{description}</p>
      </div>
    </header>
  )
}
