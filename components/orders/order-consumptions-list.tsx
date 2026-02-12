"use client"

import React, { useMemo, useState } from "react"
import { PackageIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { DialogTrigger } from "@radix-ui/react-dialog"

import { MaterialConsumptions, materialConsumptionsStore } from "@/store/material-consumptions"
import { Materials } from "../materials/materials-table"
import { materialTypes } from "./orders-view-materials"

interface ArrivalTimelineModalProps {
  children: React.ReactNode
  order_id: string
  materials: Materials
}

type MaterialKey = keyof Materials;

export function OrderConsumptionsList({ children, order_id,materials }: ArrivalTimelineModalProps) {
  const { materialConsumptions } = materialConsumptionsStore()
  const [open, setOpen] = useState(false)

  const data = useMemo(() => {
    return materialConsumptions.filter(i => i.order.id.toString() === order_id.toString())
  }, [materialConsumptions, order_id])

  const groupedData = useMemo(() => {
    const map = new Map<string, MaterialConsumptions>()

    data.forEach(item => {
      if (map.has(item.material_id)) {
        const existing = map.get(item.material_id)!
        map.set(item.material_id, {
          ...existing,
          qty: (parseFloat(existing.qty) + parseFloat(item.qty)).toFixed(3),
          createdAt: item.createdAt 
        })
      } else {
        map.set(item.material_id, { ...item })
      }
    })

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [data])


  const totalQty = useMemo(() => {
    return groupedData.reduce((sum, item) => sum + parseFloat(item.qty), 0)
  }, [groupedData])


  const findNameMaterials = (id:string,type:string) => {
    const info = materials[type as keyof Materials]
      ?.find(i => i.id === id) as any[typeof type][number] | undefined;

    if(type == "fabrics"){
      return `${info.name} – ${info.color}`
    }
    if(type === "accessories" || type === "velcro"){
      return info.name
    }
    return `${info.color} – ${info.type}`

  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Расходов Заказа
          </DialogTitle>
        </DialogHeader>

        {/* Summary Stats */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            <PackageIcon className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Всего расходов:</span>
            <Badge variant="accessories">-{totalQty.toLocaleString("ru-RU")}</Badge>
          </div>
        </div>

        {/* Timeline */}
        <ScrollArea className="h-[320px] pr-4">
          <div className="relative">
            <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-border" />

            <div className="space-y-1">
              {groupedData.map((item, index) => {
                const isFirst = index === 0

                return (
                  <div
                    key={item.material_id}
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
                          <p className="text-xs font-medium leading-none">
                            <span className="text-xs">{materialTypes.find(i=>i.key == item.material_type)?.label}</span>
                          </p>
                        </div>
                        <p className="font-bold text-xs">{findNameMaterials(item.material_id,item.material_type)}</p>
                        <Badge variant={"accessories"}>- {parseFloat(item.qty)}</Badge>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </ScrollArea>

        {groupedData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <PackageIcon className="size-12 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Нет данных о расходах</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
