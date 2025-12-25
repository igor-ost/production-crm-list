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


export default function JournalUpdateModal({children,onSubmit,quantity,id}:{children:React.ReactNode,id:string,quantity:number,onSubmit:(id:string,quantity:number)=>void}) {
  const [newquantity, setQuantity] = useState(quantity);
  const [error,setError] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [open,setOpen] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    const journal = {
      quantity:newquantity,
    };


    if(newquantity == 0){
        setError("Поле (Кол-во) обязательно для заполнения.")
        setIsLoading(false)
        return
    }

    try {
        const response = await Api.journal.update(id,journal)
        if(response.id){
            onSubmit(id,newquantity)
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
          <DialogTitle>Редактировать запись</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="quantity">Кол-во</Label>
            <Input
              id="quantity"
              placeholder="Введите кол-во"
              value={newquantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
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
