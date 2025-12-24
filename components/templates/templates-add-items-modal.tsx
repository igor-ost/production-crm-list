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
import SelectMaterials from "../ui/select-materials";

export interface TemplateItems {
  id: string;
  material_id: string;
  material_type: string;
  qty: number;

}


export default function TemplatesAddItemsModal({children,onSubmit,id,materials,type}:{type:string,materials:{id:string,name?:string;type?:string;color?:string}[],id:string,children:React.ReactNode,onSubmit:(id:string,material_id:string,material_type:string,qty:number,template_id:string)=>void}) {
  const [material_id, setMaterialId] = useState("");
  const [materialsList,setMaterialList] = useState(materials)
  const [qty, setQty] = useState(0);
  const [template_id,setTemplateId] = useState(id);
  const [error,setError] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [open,setOpen] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    const template_item = {
      material_id:material_id,
      template_id :template_id,
      material_type: type,
      qty:qty
    };

    if(material_id == ""){
        setError("Поле (Материал) обязательно для заполнения.")
        setIsLoading(false)
        return
    }
    if(qty == 0){
        setError("Поле (Кол-во) обязательно для заполнения.")
        setIsLoading(false)
        return
    }


    try {
        const response = await Api.template_items.create(template_item)
        if(response.id){
            setQty(0);
            onSubmit(response.id,response.material_id,response.material_type,response.qty,response.template.id)
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
          <DialogTitle>Добавление материала</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Материал</Label>
            <SelectMaterials materials={materialsList} value={material_id} onValueChange={setMaterialId}/>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Кол-во</Label>
            <Input
              placeholder="Введите кол-во"
              type="number"
              value={qty}
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
          <Button disabled={isLoading} onClick={handleSubmit}>{!isLoading ? "Добавить" : "Добавление..."}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
