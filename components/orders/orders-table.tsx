"use client"

import { Eye, Trash2, Search } from "lucide-react"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export interface Order {
  id: string
  date: string
  customer: string
  product: string
  size: string
  quantity: number
  buttons: number
  cuttingCost: number
  sewingCost: number
  status: "new" | "in-progress" | "completed"
}

const statusLabels: Record<Order["status"], string> = {
  new: "Новый",
  "in-progress": "В работе",
  completed: "Готов",
}

const statusColors: Record<Order["status"], string> = {
  new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "in-progress": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
}

interface OrdersTableProps {
  orders: Order[]
  onView: (orderId: string) => void
  onDelete: (orderId: string) => void
}

export function OrdersTable({ orders, onView, onDelete }: OrdersTableProps) {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"all" | Order["status"]>("all")

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.product.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toString().includes(search)

      const matchesStatus = status === "all" || order.status === status

      return matchesSearch && matchesStatus
    })
  }, [orders, search, status])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border p-4 backdrop-blur">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
          <Input
            placeholder="Поиск"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={status} onValueChange={(v) => setStatus(v as any)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="new">Новый</SelectItem>
            <SelectItem value="in-progress">В работе</SelectItem>
            <SelectItem value="completed">Готов</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto text-sm text-black/50">
          <Button>Создать новый заказ</Button>
        </div>
      </div>

      {/* Таблица */}
      <div className="rounded-lg border border-black/20 shadow-xl backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-black/20">
              <TableHead>ID</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Заказчик</TableHead>
              <TableHead>Изделие</TableHead>
              <TableHead>Размер</TableHead>
              <TableHead className="text-center">Кол-во</TableHead>
              <TableHead className="text-center">Пуговицы</TableHead>
              <TableHead className="text-right">Крой</TableHead>
              <TableHead className="text-right">Пошив</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-center">Действия</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-black/5">
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.size}</TableCell>
                <TableCell className="text-center">{order.quantity}</TableCell>
                <TableCell className="text-center">{order.buttons}</TableCell>
                <TableCell className="text-right">{order.cuttingCost} тг</TableCell>
                <TableCell className="text-right">{order.sewingCost} тг</TableCell>
                <TableCell>
                  <Badge className={`${statusColors[order.status]} border`}>
                    {statusLabels[order.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onView(order.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(order.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="py-8 text-center text-black/50"
                >
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
