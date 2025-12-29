"use client"

import { Search, Info, Download } from "lucide-react"
import { useEffect, useState } from "react"

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
import SelectOrders from "@/components/ui/select-orders"
import { Orders } from "@/components/orders/orders-table"
import { Badge } from "@/components/ui/badge"
import * as XLSX from "xlsx";
interface OrdersReportTableProps {
  orders: Orders[]
}

export function OrdersReportTable({ orders }: OrdersReportTableProps) {
  const [search, setSearch] = useState("")
  const [ordersList, setOrdersList] = useState(orders)
  const [selectedOrder, setSelectedOrder] = useState("")

  const exportToExcel = () => {
    const header = ["#", "Номер заказа", "Продукт", "Требуется изделий", "Требуется пуговок", "Пошив по заказу", "Крой по заказу", "Пуговицы", "Статус"];

    const data = ordersList.map((order, index) => {
      const sewingQty = order.journal?.reduce((sum, i) => i.type === "sewing" ? sum + i.quantity : sum, 0) || 0;
      const cuttingQty = order.journal?.reduce((sum, i) => i.type === "cutting" ? sum + i.quantity : sum, 0) || 0;
      const buttonsQty = order.journal?.reduce((sum, i) => i.type === "buttons" ? sum + i.quantity : sum, 0) || 0;

      let status = "";
      if (sewingQty < order.quantity || cuttingQty < order.quantity || buttonsQty < order.buttons) {
        status = "В работе";
      } else if (sewingQty > order.quantity || cuttingQty > order.quantity || buttonsQty > order.buttons) {
        status = "Перевыполнено";
      } else {
        status = "Завершено";
      }

      return [
        index + 1,
        order.order_number,
        order.template.name,
        order.quantity,
        order.buttons,
        sewingQty,
        cuttingQty,
        buttonsQty,
        status
      ];
    });


    data.unshift(header);

    const ws = XLSX.utils.aoa_to_sheet(data);

    ws["!cols"] = header.map(h => ({ wch: Math.max(15, h.length + 2) }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Отчёт");

    XLSX.writeFile(wb, `Отчёт_заказов.xlsx`);
  };

  useEffect(() => {
    let filtered = orders

    if (selectedOrder) {
      filtered = filtered.filter(o => o.id === selectedOrder)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(o =>
        o.order_number.toLowerCase().includes(searchLower) ||
        o.template.name.toLowerCase().includes(searchLower)
      )
    }

    setOrdersList(filtered)
  }, [orders, search, selectedOrder])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-background/60 p-4 shadow-sm backdrop-blur">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Поиск</label>
          <Input
            placeholder="Поиск по номеру заказа или продукту"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-60 max-w-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Фильтр по заказу</label>
          <div className="relative w-60 max-w-sm">
            <SelectOrders
              orders={orders}
              value={selectedOrder}
              onValueChange={setSelectedOrder}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Excel</label>
          <Button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700 cursor-pointer">
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
              <TableHead>Номер заказа</TableHead>
              <TableHead>Продукт</TableHead>
              <TableHead className="text-center">Требуется изделий</TableHead>
              <TableHead className="text-center">Требуется пуговок</TableHead>
              <TableHead className="text-center">Пошив по заказу</TableHead>
              <TableHead className="text-center">Крой по заказу</TableHead>
              <TableHead className="text-center">Пуговицы</TableHead>
              <TableHead className="text-center">Статус</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {ordersList.map((order, index) => {
              const sewingQty = order.journal?.reduce((sum, i) => i.type === "sewing" ? sum + i.quantity : sum, 0) || 0
              const cuttingQty = order.journal?.reduce((sum, i) => i.type === "cutting" ? sum + i.quantity : sum, 0) || 0
              const buttonsQty = order.journal?.reduce((sum, i) => i.type === "buttons" ? sum + i.quantity : sum, 0) || 0

              let status = ""
              let color: "threads" | "fabrics" | "buttons"

              if (sewingQty < order.quantity || cuttingQty < order.quantity || buttonsQty < order.buttons) {
                status = "В работе";
                color = "threads";
              } else if (sewingQty > order.quantity || cuttingQty > order.quantity || buttonsQty > order.buttons) {
                status = "Перевыполнено";
                color = "buttons";
              } else {
                status = "Завершено";
                color = "fabrics";
              }
              

              return (
                <TableRow key={index} className="transition-colors hover:bg-muted/40 even:bg-muted/20">
                  <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>{order.template.name}</TableCell>
                  <TableCell className="text-center"><Badge variant="outline">{order.quantity}</Badge></TableCell>
                  <TableCell className="text-center"><Badge variant="outline">{order.buttons}</Badge></TableCell>
                  <TableCell className="text-center"><Badge variant="default">{sewingQty}</Badge></TableCell>
                  <TableCell className="text-center"><Badge variant="default">{cuttingQty}</Badge></TableCell>
                  <TableCell className="text-center"><Badge variant="default">{buttonsQty}</Badge></TableCell>
                  <TableCell className="text-center">
                    <Badge variant={color}>{status}</Badge>
                  </TableCell>
                </TableRow>
              )
            })}

            {ordersList.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="py-10 text-center text-muted-foreground">
                  Ничего не найдено
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
