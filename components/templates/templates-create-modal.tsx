"use client";

import { useEffect, useState } from "react";
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
import { Textarea } from "../ui/textarea";


export default function TemplatesCreateModal({children,onSubmit,defaultName = ""}:{defaultName?:string,children:React.ReactNode,onSubmit:(id:string,name:string,description:string,cuttingPrice:number,sewingPrice:number,buttonsPrice:number)=>void}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cuttingPrice, setCuttingPrice] = useState(0);
  const [sewingPrice, setSewingPrice] = useState(0);
  const [buttonsPrice, setButtonsPrice] = useState(0);
  const [error,setError] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [open,setOpen] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    const template = {
      name,
      description,
      cuttingPrice,
      sewingPrice,
      buttonsPrice
    };

    if(name == ""){
        setError("Поле (Название) обязательно для заполнения.")
        setIsLoading(false)
        return
    }
    if(description == ""){
        setError("Поле (Описание) обязательно для заполнения.")
        setIsLoading(false)
        return
    }


    try {
        const response = await Api.templates.create(template)
        if(response.id){
            setName("");
            setDescription("");
            onSubmit(response.id,name,description,cuttingPrice,sewingPrice,buttonsPrice)
            setIsLoading(false)
            setOpen(false)
        }
    } catch (error:unknown) {
        setIsLoading(false)
        setError(error instanceof Error ? error.message : "Произошла ошибка")
    }

  };

  useEffect(()=>{setName(defaultName)},[defaultName])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Создание Шаблона - Изделия</DialogTitle>
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
            <Label htmlFor="type">Описание</Label>
            <Textarea
              placeholder="Введите Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            >
            </Textarea>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cutting_price">Цена кроя</Label>
            <Input
              type="number"
              id="cutting_price"
              placeholder="Введите цену кроя"
              value={cuttingPrice}
              onChange={(e) => setCuttingPrice(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sewing_price">Цена пошива</Label>
            <Input
              type="number"
              id="sewing_price"
              placeholder="Введите цену пошива"
              value={sewingPrice}
              onChange={(e) => setSewingPrice(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="buttons_price">Цена бочек-кнопок</Label>
            <Input
              type="number"
              id="buttons_price"
              placeholder="Введите цену пошива"
              value={buttonsPrice}
              onChange={(e) => setButtonsPrice(Number(e.target.value))}
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
