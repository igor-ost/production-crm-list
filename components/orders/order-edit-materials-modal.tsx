"use client"

import { useState } from "react"
import { Edit } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OrdersEditMaterialModalProps {
  materialId: string
  currentQty: number
  materialName: string
  onUpdate: (id: string, qty: number) => Promise<void>
}

export default function OrdersEditMaterialModal({
  materialId,
  currentQty,
  materialName,
  onUpdate,
}: OrdersEditMaterialModalProps) {
  const [open, setOpen] = useState(false)
  const [qty, setQty] = useState(currentQty)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (qty <= 0) return
    setIsLoading(true)
    try {
      await onUpdate(materialId, qty)
      setOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
          <Edit className="w-3 h-3 cursor-pointer opacity-0 group-hover:opacity-100 text-blue-600" />
        </div>
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Изменить количество</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">{materialName}</p>
          <div className="space-y-2">
            <Label htmlFor="qty">Количество</Label>
            <Input
              id="qty"
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || qty <= 0}>
            {isLoading ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
