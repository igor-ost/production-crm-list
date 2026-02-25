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
import { useEffect, useState } from "react"
import { materialConsumptionsStore, MaterialConsumptions } from "@/store/material-consumptions"


export interface Materials{
  zippers: Zippers[]
  fabrics: Fabrics[]
  threads: Threads[]
  buttons: Buttons[]
  accessories: Accessories[]
  velcro: Velcro[]
}

export interface MaterialsTableProps{
  zippers: Zippers[]
  fabrics: Fabrics[]
  threads: Threads[]
  buttons: Buttons[]
  accessories: Accessories[]
  velcro: Velcro[]
  materials_consuptions: MaterialConsumptions[]
}

export interface InvoiceList {
  id:string;
  dateArrived: string
  qty:number;
  price:number;
  createdAt: string
}
type AllMaterials = Zippers[] | Fabrics[] | Threads[] | Buttons[] | Accessories[] | Velcro[]
type AllMaterial = Zippers | Fabrics | Threads | Buttons | Accessories | Velcro

export function MaterialsTable({zippers,fabrics,threads,buttons,accessories,velcro,materials_consuptions}:MaterialsTableProps) {

  const {setMaterialConsumptions,materialConsumptions} = materialConsumptionsStore()

  const [zippersList,setZippersList] = useState(zippers);
  const [fabricsList,setFabricsList] = useState(fabrics);
  const [threadsList,setThreadsList] = useState(threads);
  const [buttonsList,setButtonsList] = useState(buttons);
  const [accessoriesList,setAccessoriesList] = useState(accessories);
  const [VelcroList,setVelcroList] = useState(velcro);

  function prepareMaterials(
    materials: AllMaterials,
    materialConsumptions?: MaterialConsumptions[]
  ): (AllMaterial & { qty: number; price: number | null })[] {
    return materials.map(material => {
      const latestInvoice = material.invoices?.reduce<InvoiceList | null>(
        (latest, curr) =>
          !latest || new Date(curr.createdAt) > new Date(latest.createdAt)
            ? curr
            : latest,
        null
      );
      const totalQty =
        (material.invoices?.reduce((sum, i) => sum + (i.qty ?? 0), 0) ?? 0) -
        (materialConsumptions
          ?.filter(mc => mc.material_id === material.id)
          .reduce((sum, i) => sum + (Number(i.qty) || 0), 0) ?? 0);

      const price = latestInvoice?.price ?? null;

      return {
        ...material,
        qty: totalQty,
        price,
      };
    });
  }


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
      ], prepareMaterials(zippers,materialConsumptions)),
      "Молнии"
    )

    XLSX.utils.book_append_sheet(
      wb,
      createSheet("Ткани", [
        { key: "#", title: "#" },
        { key: "name", title: "Название" },
        { key: "color", title: "Цвет" },
        { key: "unit", title: "Ед." },
        { key: "qty", title: "Кол-во" },
        { key: "price", title: "Цена" },
      ], prepareMaterials(fabrics,materialConsumptions)),
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
      ], prepareMaterials(threads,materialConsumptions)),
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
      ], prepareMaterials(buttons,materialConsumptions)),
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
      ], prepareMaterials(accessories,materialConsumptions)),
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
      ], prepareMaterials(velcro,materialConsumptions)),
      "Велькро"
    )

    XLSX.writeFile(wb, `Материалы_${new Date().toISOString().slice(0,10)}.xlsx`)
  }
  useEffect(()=>{
    if(materials_consuptions){
      setMaterialConsumptions(materials_consuptions)
    }
  },[materials_consuptions])
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
          <ZippersTable zippersList={zippersList} setZippersList={setZippersList}/>
        </TabsContent>

        <TabsContent value="fabrics">
           <FabricsTable fabricsList={fabricsList} setFabricsList={setFabricsList}/>
        </TabsContent>

        <TabsContent value="threads">
          <ThreadsTable threadsList={threadsList} setThreadsList={setThreadsList}/>
        </TabsContent>

        <TabsContent value="buttons">
          <ButtonsTable buttonsList={buttonsList} setButtonsList={setButtonsList}/>
        </TabsContent>

        <TabsContent value="accessories">
          <AccessoriesTable accessoriesList={accessoriesList} setAccessoriesList={setAccessoriesList}/>
        </TabsContent>

        <TabsContent value="velcro">
          <VelcroTable VelcroList={VelcroList} setVelcroList={setVelcroList}/>
        </TabsContent>
      </Tabs>
    </div>
  )
}
