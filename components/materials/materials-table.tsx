"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { Zippers, ZippersTable } from "./zippers/zippers-table"
import { Fabrics, FabricsTable } from "./fabrics/fabrics-table"
import { Threads, ThreadsTable } from "./threads/threads-table"
import { Buttons, ButtonsTable } from "./buttons/buttons-table"
import { Accessories, AccessoriesTable } from "./accessories/accessories-table"
import { Velcro, VelcroTable } from "./velcro/velcro-table"

export interface MaterialsTableProps{
  zippers: Zippers[]
  fabrics: Fabrics[]
  threads: Threads[]
  buttons: Buttons[]
  accessories: Accessories[]
  velcro: Velcro[]
}

export function MaterialsTable({zippers,fabrics,threads,buttons,accessories,velcro}:MaterialsTableProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="zippers" className="space-y-4">
        <TabsList className="flex flex-wrap gap-2 bg-gray-100 rounded-lg p-1">
          {[
            { value: "zippers", label: "Молнии" },
            { value: "fabrics", label: "Ткани" },
            { value: "threads", label: "Нитки" },
            { value: "buttons", label: "Пуговицы" },
            { value: "accessories", label: "Аксессуары" },
            { value: "velcro", label: "Велькро" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="px-4 py-2 rounded-lg text-gray-700 data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-blue-600 hover:bg-white hover:text-blue-600 transition-all"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="zippers">
          <ZippersTable zippers={zippers}/>
        </TabsContent>

        <TabsContent value="fabrics">
           <FabricsTable fabrics={fabrics}/>
        </TabsContent>

        <TabsContent value="threads">
          <ThreadsTable threads={threads}/>
        </TabsContent>

        <TabsContent value="buttons">
          <ButtonsTable buttons={buttons}/>
        </TabsContent>

        <TabsContent value="accessories">
          <AccessoriesTable accessories={accessories}/>
        </TabsContent>

        <TabsContent value="velcro">
         <VelcroTable velcro={velcro}/>
        </TabsContent>
      </Tabs>
    </div>
  )
}
