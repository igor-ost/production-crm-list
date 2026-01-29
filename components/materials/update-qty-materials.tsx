"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Api } from "@/services/api-clients";


export default function UpdateQtyModal({children,onSubmit,qty,id,type}:{children:React.ReactNode,id:string,type:"zippers" | "velcro" | "fabrics" | "threads" | "buttons" | "accessories",qty:number,onSubmit:(id:string,qty:number)=>void}) {
  const [newqty, setQty] = useState(qty);
  const [error,setError] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [open,setOpen] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    const update = {
      qty:newqty,
    };


    try {
        const response = await Api[type].update(id,update as any)
        if(response.id){
            onSubmit(id,newqty)
            setIsLoading(false)
            setOpen(false)
        }
    } catch (error:unknown) {
        setIsLoading(false)
        setError(error instanceof Error ? error.message : "Произошла ошибка")
    }

  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить кол-во материала</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="qty">Кол-во</Label>
            <Input
              id="qty"
              placeholder="Введите Кол-во"
              type="number"
              value={newqty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
          </div>

        {error && (
            <div className="p-2">
              <p className="text-red-600 font-bold text-sm">{error}</p>
            </div>
        )}
        </div>

        <DialogFooter>
          <Button disabled={isLoading} onClick={handleSubmit}>{!isLoading ? "Сохранить" : "Сохранение..."}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
