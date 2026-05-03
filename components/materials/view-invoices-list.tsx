"use client"

import React, { useMemo, useState } from "react"
import { CalendarIcon, PackageIcon, Pencil, Trash2, Check, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { DialogTrigger } from "@radix-ui/react-dialog"

import { format, parseISO } from "date-fns"
import { ru } from "date-fns/locale"
import { InvoiceList } from "./materials-table"


interface ViewInvoicesListProps {
  data: InvoiceList[]
  children: React.ReactNode
  onDelete?: (id: string) => void
  onUpdate?: (id: string, qty: number, price: number) => void
}

export function ViewInvoicesList({
  data,
  children,
  onDelete,
  onUpdate,
}: ViewInvoicesListProps) {
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editQty, setEditQty] = useState(0)
  const [editPrice, setEditPrice] = useState(0)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const sortedData = useMemo(() => {
    return [...data].sort(
      (a, b) =>
        new Date(b.dateArrived).getTime() - new Date(a.dateArrived).getTime()
    )
  }, [data])

  const totalQty = useMemo(() => {
    return data.reduce((sum, item) => sum + item.qty, 0)
  }, [data])

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return format(date, "d MMMM yyyy", { locale: ru })
    } catch {
      return dateString
    }
  }

  const formatTime = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return format(date, "HH:mm", { locale: ru })
    } catch {
      return ""
    }
  }

  const startEdit = (item: InvoiceList) => {
    setEditingId(item.id)
    setEditQty(item.qty)
    setEditPrice(item.price)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditQty(0)
    setEditPrice(0)
  }

  const saveEdit = () => {
    if (editingId && onUpdate) {
      onUpdate(editingId, editQty, editPrice)
    }
    cancelEdit()
  }

  const confirmDelete = () => {
    if (deleteId && onDelete) {
      onDelete(deleteId)
    }
    setDeleteId(null)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="size-5 text-primary" />
              История поступлений
            </DialogTitle>
            <DialogDescription>
              Хронология добавления материала
            </DialogDescription>
          </DialogHeader>

          {/* Summary Stats */}
          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-2">
              <PackageIcon className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Всего записей:
              </span>
              <Badge variant="secondary">{data.length}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Итого:</span>
              <Badge>{totalQty.toLocaleString("ru-RU")} шт.</Badge>
            </div>
          </div>

          {/* Timeline */}
          <ScrollArea className="h-[320px] pr-4">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-border" />

              <div className="space-y-1">
                {sortedData.map((item, index) => {
                  const isFirst = index === 0
                  const isEditing = editingId === item.id

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "relative flex gap-4 py-3 transition-colors rounded-lg hover:bg-muted/30 group",
                        isFirst && "bg-primary/5"
                      )}
                    >
                      {/* Timeline dot */}
                      <div className="relative z-10 flex-shrink-0">
                        <div
                          className={cn(
                            "size-6 rounded-full border-2 flex items-center justify-center transition-all",
                            isFirst
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background"
                          )}
                        >
                          {isFirst && (
                            <span className="size-2 rounded-full bg-primary-foreground animate-pulse" />
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {formatDate(item.dateArrived)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatTime(item.dateArrived) || "—"}
                            </p>
                          </div>

                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={editQty}
                                onChange={(e) =>
                                  setEditQty(Number(e.target.value))
                                }
                                className="w-20 h-7 text-xs"
                                placeholder="Кол-во"
                              />
                              <Input
                                type="number"
                                value={editPrice}
                                onChange={(e) =>
                                  setEditPrice(Number(e.target.value))
                                }
                                className="w-20 h-7 text-xs"
                                placeholder="Цена"
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                className="size-7"
                                onClick={saveEdit}
                              >
                                <Check className="size-4 text-green-600" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="size-7"
                                onClick={cancelEdit}
                              >
                                <X className="size-4 text-red-600" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={isFirst ? "default" : "outline"}
                                className={cn(
                                  "flex-shrink-0 tabular-nums",
                                  isFirst && "animate-in fade-in-0 zoom-in-95"
                                )}
                              >
                                +{item.qty.toLocaleString("ru-RU")}
                              </Badge>
                              <Badge variant="secondary">
                                {item.price} тг.
                              </Badge>

                              {/* Action buttons */}
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="size-7"
                                  onClick={() => startEdit(item)}
                                >
                                  <Pencil className="size-3.5 text-muted-foreground" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="size-7"
                                  onClick={() => setDeleteId(item.id)}
                                >
                                  <Trash2 className="size-3.5 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </ScrollArea>

          {data.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <PackageIcon className="size-12 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                Нет данных о поступлениях
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить запись?</DialogTitle>
            <DialogDescription>
              Это действие нельзя отменить. Запись будет удалена навсегда.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose><Button variant="outline">Отмена</Button></DialogClose>
            <Button
              onClick={confirmDelete}
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
