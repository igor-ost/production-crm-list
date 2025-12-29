"use client"

import { Search, Info, Download } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import SelectOrders from "@/components/ui/select-orders"
import { Orders } from "@/components/orders/orders-table"
import { MaterialsTableProps } from "@/components/materials/materials-table"



interface MaterialsReportTableProps {
  orders: Orders[]
  materilas: MaterialsTableProps
}

export function MaterialsTable({ orders,materilas }: MaterialsReportTableProps) {

  const [search, setSearch] = useState("")
  const [materialsList, seMaterilasList] = useState(materilas)
  const [order,setOrder] = useState("")



  // useEffect(() => {
  //   seMaterilasList();
  // }, [staffs]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-background/60 p-4 shadow-sm backdrop-blur">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Поиск</label>
          <div className="relative w-60 max-w-sm">
            <SelectOrders orders={orders} value={order} onValueChange={setOrder}/>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Ecxel</label>
          <Button className="bg-green-600 hover:bg-green-700 cursor-pointer">
            Скачать отчёт<Download />
          </Button>
        </div>
      </div>

      {/* Таблица */}
      <div className="overflow-hidden rounded-xl border bg-background/60 shadow-sm backdrop-blur">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px]">#</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Название</TableHead>
              <TableHead className="text-center">Кол-во</TableHead>
              <TableHead className="text-center">Цена за ед.</TableHead>
              <TableHead className="text-center">Общая стоимость.</TableHead>
              <TableHead className="text-center">Номер заказа</TableHead>
              <TableHead className="text-center">Заказчик</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* {order.map((materials, index) => (
              <TableRow
                key={index}
                className="transition-colors hover:bg-muted/40 even:bg-muted/20"
              >
                <TableCell className="font-medium text-muted-foreground">
                  {index + 1}
                </TableCell>

                <TableCell className="font-medium">
   
                </TableCell>

                <TableCell>
                  
                </TableCell>

                <TableCell className="text-center">
                  <Badge variant="default">
                    
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">
                    
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="fabrics">
                    
                  </Badge>
                </TableCell>
              </TableRow>
            ))}

            {materialsList.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  Ничего не найдено
                </TableCell>
              </TableRow>
            )} */}
          </TableBody>
        </Table>
      </div>
    </div>

  )
}
