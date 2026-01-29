"use client"

import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import * as XLSX from "xlsx"

export interface MaterialsTableProps{
  zippers: Zippers[]
  fabrics: Fabrics[]
  threads: Threads[]
  buttons: Buttons[]
  accessories: Accessories[]
  velcro: Velcro[]
}

export function MaterialsTable({zippers,fabrics,threads,buttons,accessories,velcro}:MaterialsTableProps) {

  function createSheet<T>(
    title: string,
    columns: {
      key: string
      title: string
      width?: number
    }[],
    rows: T[]
  ) {
    const header = columns.map(c => c.title)

    const data = rows.map((row: any, index) =>
      columns.map(c =>
        c.key === "#" ? index + 1 : row[c.key] ?? ""
      )
    )

    data.unshift(header)

    const ws = XLSX.utils.aoa_to_sheet(data)

    ws["!cols"] = columns.map(c => ({
      wch: c.width ?? Math.max(14, c.title.length + 2),
    }))

    header.forEach((_, i) => {
      const cell = ws[XLSX.utils.encode_cell({ r: 0, c: i })]
      if (cell) {
        cell.s = {
          font: { bold: true },
          alignment: { horizontal: "center" },
        }
      }
    })

    return ws
  }

  const handleDownload = () => {
    const wb = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      wb,
      createSheet("Молнии", [
        { key: "#", title: "#" },
        { key: "color", title: "Цвет" },
        { key: "type", title: "Тип" },
        { key: "unit", title: "Ед." },
        { key: "qty", title: "Кол-во" },
        { key: "price", title: "Цена" },
      ], zippers),
      "Молнии"
    )

    XLSX.utils.book_append_sheet(
      wb,
      createSheet("Ткани", [
        { key: "#", title: "#" },
        { key: "name", title: "Название" },
        { key: "color", title: "Цвет" },
        { key: "type", title: "Тип" },
        { key: "unit", title: "Ед." },
        { key: "qty", title: "Кол-во" },
        { key: "price", title: "Цена" },
      ], fabrics),
      "Ткани"
    )

    XLSX.utils.book_append_sheet(
      wb,
      createSheet("Нитки", [
        { key: "#", title: "#" },
        { key: "color", title: "Цвет" },
        { key: "type", title: "Тип" },
        { key: "unit", title: "Ед." },
        { key: "qty", title: "Кол-во" },
        { key: "price", title: "Цена" },
      ], threads),
      "Нитки"
    )

    XLSX.utils.book_append_sheet(
      wb,
      createSheet("Пуговицы", [
        { key: "#", title: "#" },
        { key: "color", title: "Цвет" },
        { key: "type", title: "Тип" },
        { key: "unit", title: "Ед." },
        { key: "qty", title: "Кол-во" },
        { key: "price", title: "Цена" },
      ], buttons),
      "Пуговицы"
    )

    XLSX.utils.book_append_sheet(
      wb,
      createSheet("Аксессуары", [
        { key: "#", title: "#" },
        { key: "name", title: "Название" },
        { key: "unit", title: "Ед." },
        { key: "qty", title: "Кол-во" },
        { key: "price", title: "Цена" },
      ], accessories),
      "Аксессуары"
    )

    XLSX.utils.book_append_sheet(
      wb,
      createSheet("Велькро", [
        { key: "#", title: "#" },
        { key: "name", title: "Название" },
        { key: "unit", title: "Ед." },
        { key: "qty", title: "Кол-во" },
        { key: "price", title: "Цена" },
      ], velcro),
      "Велькро"
    )

    XLSX.writeFile(wb, `Материалы_${new Date().toISOString().slice(0,10)}.xlsx`)
  }
  return (
    <div className="space-y-6">
      <Tabs defaultValue="zippers" className="space-y-4">
        <div className="flex gap-2">
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

        <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 cursor-pointer">
            Скачать отчёт<Download />
        </Button>

        </div>
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
