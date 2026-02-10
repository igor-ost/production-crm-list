"use client"

import React, { useMemo, useState } from "react"
import { CalendarIcon, PackageIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { DialogTrigger } from "@radix-ui/react-dialog"

import { format, parseISO } from "date-fns"
import { ru } from "date-fns/locale"
import { materialConsumptionsStore } from "@/store/material-consumptions"


interface ArrivalTimelineModalProps {
  children: React.ReactNode
  material_id: string;
}


export function ViewConsumptionsList({
  children,
  material_id
}: ArrivalTimelineModalProps) {

  const {materialConsumptions} = materialConsumptionsStore()

  const data = useMemo(()=>{
    return materialConsumptions.filter(i => i.material_id === material_id)
  },[materialConsumptions])

  const [open,setOpen] = useState(false)

  const sortedData = useMemo(() => {
    return [...data].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [data])

  const totalQty = useMemo(() => {
    return data.reduce((sum, item) => sum + parseFloat(item.qty), 0)
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



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            История расходов
          </DialogTitle>
          <DialogDescription>
            Хронология
          </DialogDescription>
        </DialogHeader>

        {/* Summary Stats */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            <PackageIcon className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Всего расходов:
            </span>
            <Badge variant="accessories">-{totalQty.toLocaleString("ru-RU")}</Badge>
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
                const isLast = index === sortedData.length - 1

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "relative flex gap-4 py-3 transition-colors rounded-lg hover:bg-muted/30",
                      isFirst && "bg-primary-5"
                    )}
                  >
                    {/* Timeline dot */}
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className={cn(
                          "size-6 rounded-full border-2 flex items-center justify-center transition-all",
                          isFirst
                            ? "border-red-500 bg-red-400 text-primary-foreground"
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
                            {formatDate(item.createdAt)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(item.createdAt) || "—"}
                          </p>
                        </div>
                        <p className="font-bold text-sm">{item.order.order_number}</p>
                        <Badge
                          variant={"accessories"}
                        >
                          - {parseFloat(item.qty)}
                        </Badge>
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
              Нет данных о расходах
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
