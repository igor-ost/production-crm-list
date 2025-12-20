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


export default function CustomerCreateModal({children,onSubmit}:{children:React.ReactNode,onSubmit:(name:string,bin:string,id:string)=>void}) {
  const [name, setName] = useState("");
  const [bin, setBin] = useState("");
  const [error,setError] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [open,setOpen] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    const customer = {
      name,
      bin,
    };

    if(name == ""){
        setError("Поле (Название) обязательно для заполнения.")
        setIsLoading(false)
        return
    }

    try {
        const response = await Api.customers.create(customer)
        if(response.id){
            setName("");
            setBin("");
            onSubmit(name,bin,response.id)
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
          <DialogTitle>Новый заказчик</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              placeholder="Введите название"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bin">Бин</Label>
            <Input
              id="bin"
              placeholder="Введите BIN"
              value={bin}
              onChange={(e) => setBin(e.target.value)}
            />
          </div>

        {error && (
            <div className="p-2">
              <p className="text-red-600 font-bold text-sm">{error}</p>
            </div>
        )}
        </div>

        <DialogFooter>
          <Button disabled={isLoading} onClick={handleSubmit}>{!isLoading ? "Создать" : "Создание..."}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
