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
import SelectUnit from "@/components/ui/select-unit";
import { Textarea } from "../ui/textarea";


export default function TemplatesUpdateModal({children,onSubmit,name,description,cuttingPrice,sewingPrice,buttonsPrice,id}:{children:React.ReactNode,id:string,name:string,description:string,cuttingPrice:number,sewingPrice:number,buttonsPrice:number,onSubmit:(id:string,name:string,description:string,cuttingPrice:number,sewingPrice:number,buttonsPrice:number)=>void}) {
  const [newname, setName] = useState(name);
  const [newdescription, setDescription] = useState(description);
  const [newCuttingPrice, setCuttingPrice] = useState(cuttingPrice);
  const [newSewingPrice, setSewingPrice] = useState(sewingPrice);
  const [newButtonsPrice, setButtonsPrice] = useState(buttonsPrice);
  const [error,setError] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [open,setOpen] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    const template = {
      name:newname,
      description:newdescription,
      cuttingPrice: newCuttingPrice,
      buttonsPrice: newButtonsPrice,
      sewingPrice: newSewingPrice
    };

    if(newname == ""){
        setError("Поле (Название) обязательно для заполнения.")
        setIsLoading(false)
        return
    }
    if(newdescription == ""){
        setError("Поле (Описание) обязательно для заполнения.")
        setIsLoading(false)
        return
    }


    try {
        const response = await Api.templates.update(id,template)
        if(response.id){
            onSubmit(id,newname,newdescription,newCuttingPrice,newSewingPrice,newButtonsPrice)
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
          <DialogTitle>Редактировать шаблон - Изделие</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              placeholder="Введите название"
              value={newname}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Описание</Label>
            <Textarea
              id="type"
              placeholder="Введите описание"
              value={newdescription}
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
              value={newCuttingPrice}
              onChange={(e) => setCuttingPrice(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sewing_price">Цена пошива</Label>
            <Input
              type="number"
              id="sewing_price"
              placeholder="Введите цену пошива"
              value={newSewingPrice}
              onChange={(e) => setSewingPrice(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="buttons_price">Цена бочек-кнопок</Label>
            <Input
              type="number"
              id="buttons_price"
              placeholder="Введите цену пошива"
              value={newButtonsPrice}
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
          <Button disabled={isLoading} onClick={handleSubmit}>{!isLoading ? "Сохранить" : "Сохранение..."}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
