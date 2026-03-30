"use client"

import { Trash2, Search, Edit, PlusSquare } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import TemplatesCreateModal from "./templates-create-modal"
import TemplatesUpdateModal from "./templates-update-modal"
import TemplatesRemoveModal from "./templates-remove-modal"
import { Badge } from "../ui/badge"
import TemplatesAddItemsModal, { TemplateItems } from "./templates-add-items-modal"
import { InvoiceList, MaterialsTableProps } from "../materials/materials-table"
import TemplatesRemoveItemsModal from "./templates-remove-items-modal"


export interface Templates {
  id: string;
  name: string;
  description:string
  cuttingPrice:number;
  sewingPrice:number;
  buttonsPrice:number
  materials: TemplateItems[]
}



interface TemplatesTableProps {
  templates: Templates[]
  materials: MaterialsTableProps
}

export function TemplatesTable({ templates,materials }: TemplatesTableProps) {
  const [search, setSearch] = useState("")
  const [templatesList,setTemplatesList] = useState(templates)

  const handleNew = (id:string,name:string,description:string,cuttingPrice:number,sewingPrice:number,buttonsPrice:number) => {
    const updated = {
      id:id,
      name:name,
      description:description,
      cuttingPrice:cuttingPrice,
      sewingPrice:sewingPrice,
      buttonsPrice:buttonsPrice,
      materials: []
    }
    setTemplatesList((prev) => [...prev, updated]);
  }

  const handleAddItems = (
    id: string,
    material_id: string,
    material_type: string,
    qty: number,
    template_id: string
  ) => {
    const newMaterial = {
      id, material_id, material_type, qty
    }
    console.log(newMaterial)
    setTemplatesList(prev =>
      prev.map(t =>
        t.id === template_id
          ? {
              ...t,
              materials: [
                ...(t.materials ?? []),
                newMaterial
              ]
            }
          : t
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    setTemplatesList(prev =>
      prev.map(t => ({
        ...t,
        materials: t.materials?.filter(m => m.id !== id)
      }))
    );
  };

  const handleDelete = (id:string) => {
    const updated = templatesList.filter(item => item.id != id)
    setTemplatesList(updated)
  }
  const handleUpdate = (id:string,name:string,description:string,cuttingPrice:number,sewingPrice:number,buttonsPrice:number)=>{
    setTemplatesList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, name, description,cuttingPrice,sewingPrice,buttonsPrice}
          : item
      )
    );
  }

  const calcTotalPrice = (template: Templates) => {
    if (!template.materials) return 0;

    const allMaterials = [
      ...materials.zippers,
      ...materials.fabrics,
      ...materials.threads,
      ...materials.buttons,
      ...materials.accessories,
      ...materials.velcro,
    ];

    return template.materials.reduce((sum, tm) => {
      const material = allMaterials.find(m => m.id === tm.material_id);
      const latestInvoice = material?.invoices?.reduce<InvoiceList | null>(
        (latest, curr) =>
          !latest || new Date(curr.createdAt) > new Date(latest.createdAt)
          ? curr
          : latest,
         null
      )
      if (!material) return sum;
      return sum + tm.qty * (latestInvoice?.price ?? 0);
    }, 0);
  };

  const filteredTemplates = useMemo(() => {
    return templatesList.filter((tempalte) => {
      const matchesSearch =
        tempalte.name.toLowerCase().includes(search.toLowerCase()) ||
        tempalte.description.toLowerCase().includes(search.toLowerCase()) ||
        tempalte.id.toString().includes(search)


      return matchesSearch 
    })
  }, [templatesList, search])

  useEffect(() => {
      setTemplatesList(templates);
   }, [templates]);


  return (
<div className="space-y-4">
  <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4 shadow-sm backdrop-blur">
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Поиск"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-9"
      />
    </div>

    <div className="ml-auto">
      <TemplatesCreateModal onSubmit={handleNew}>
        <Button variant="yellow" className="rounded-lg">
          Добавить
        </Button>
      </TemplatesCreateModal>
    </div>
  </div>

  {/* Таблица */}
<div className="overflow-hidden rounded-xl border bg-white shadow-sm backdrop-blur">
  <div className="overflow-x-auto max-w-full max-h-175">
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-muted sticky top-0 z-50">
          <th className="text-xs font-medium text-left p-3 border-b sticky top-0 left-0 bg-amber-300 z-10 min-w-12.5 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
           #</th>

           <th className="text-xs font-medium text-left p-3 border-b sticky top-0 left-12.5 bg-amber-300 z-10 min-w-37.5 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
            Название
          </th>

           <th className="text-xs font-medium text-left p-3 border-b">
            Описание
          </th>
          <th className="text-xs font-medium text-left p-3 border-b">Цена кроя</th>
          <th className="text-xs font-medium text-left p-3 border-b">Цена пошива</th>
          <th className="text-xs font-medium text-left p-3 border-b">Цена бочек-кнопок</th>
          <th className="text-xs font-medium text-center p-3 border-b">Молнии</th>
          <th className="text-xs font-medium text-center p-3 border-b">Ткани</th>
          <th className="text-xs font-medium text-center p-3 border-b">Нитки</th>
          <th className="text-xs font-medium text-center p-3 border-b">Пуговицы</th>
          <th className="text-xs font-medium text-center p-3 border-b">Аксессуары</th>
          <th className="text-xs font-medium text-center p-3 border-b">Велькро</th>
          <th className="text-xs font-medium text-right p-3 border-b">Общая цена</th>
          <th className="text-right px-4 p-3 border-b">Действия</th>
        </tr>
      </thead>

      <tbody>
        {filteredTemplates.map((template, index) => (
          <tr
            key={template.id}
            className="transition-colors hover:bg-muted/40 even:bg-muted/20 group/row"
          >
            <td className="font-bold text-xs text-muted-foreground p-3 border-b sticky top-0 left-0 bg-white z-10 min-w-37.5 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] group-hover/row:bg-white group-even/row:bg-white">
              {index}
            </td>

            <td className="font-bold text-xs text-muted-foreground p-3 border-b sticky left-12.5 bg-white z-10 min-w-37.5 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] group-hover/row:bg-white group-even/row:bg-white">
              {template.name}
            </td>

             <td className="font-bold text-xs text-muted-foreground p-3 border-b">
              {template.description}
            </td>

<td className="font-mono text-xs text-muted-foreground p-3 border-b">
              <Badge>
                {template.cuttingPrice}
              </Badge>
            </td>

            <td className="font-mono text-xs text-muted-foreground p-3 border-b">
              <Badge>
              {template.sewingPrice}
              </Badge>
            </td>

            <td className="font-mono text-xs text-muted-foreground p-3 border-b">
              <Badge>
              {template.buttonsPrice}
              </Badge>
            </td>


            <td className="font-medium p-3 border-b">
              <div className="text-center">
                <TemplatesAddItemsModal onSubmit={handleAddItems} materials={materials.zippers} id={template.id} type="zippers">
                  <Button size="sm" variant="ghost"><PlusSquare/></Button>
                </TemplatesAddItemsModal>
              </div>
              <div className="flex flex-wrap gap-1 justify-center">
                  {materials.zippers
                    .filter(zipper =>
                      template.materials?.some(m => m.material_id === zipper.id)
                    )
                    .flatMap(zipper =>
                      template.materials
                        ?.filter(m => m.material_id === zipper.id)
                        .map((material,index) => {
                          const latestInvoice = zipper.invoices?.reduce<InvoiceList | null>(
                            (latest, curr) =>
                              !latest || new Date(curr.createdAt) > new Date(latest.createdAt)
                                ? curr
                                : latest,
                            null
                          )
                          return(
                          <Badge className="group flex items-center gap-2 text-[11px]" variant="zippers" key={`${material.id}_${index}`}>
                            {zipper.color} – {zipper.type}
                            {" "}({material.qty} {zipper.unit}) –{" "}
                            {material.qty * (latestInvoice?.price ?? 0)} тг.
                            <TemplatesRemoveItemsModal id={material.id} onSubmit={handleDeleteItem}/>
                          </Badge>
                        )}) ?? []
                    )}
              </div>
            </td>
            <td className="font-medium p-3 border-b">
              <div className="text-center">
                <TemplatesAddItemsModal onSubmit={handleAddItems} materials={materials.fabrics} id={template.id} type="fabrics">
                  <Button size="sm" variant="ghost"><PlusSquare/></Button>
                </TemplatesAddItemsModal>
              </div>
              <div className="flex flex-wrap gap-1">
                  {materials.fabrics
                    .filter(fabric =>
                      template.materials?.some(m => m.material_id === fabric.id)
                    )
                    .flatMap(fabric =>
                      template.materials
                        ?.filter(m => m.material_id === fabric.id)
                        .map((material,index) => {
                          const latestInvoice = fabric.invoices?.reduce<InvoiceList | null>(
                            (latest, curr) =>
                              !latest || new Date(curr.createdAt) > new Date(latest.createdAt)
                                ? curr
                                : latest,
                            null
                          )
                          return(
                          <Badge className="group flex items-center gap-2 text-[11px]" variant="fabrics" key={`${material.id}_${index}`}>
                            {fabric.name} – {fabric.color}
                            {" "}({material.qty} {fabric.unit}) –{" "}
                            {material.qty * (latestInvoice?.price ?? 0)} тг.
                             <TemplatesRemoveItemsModal id={material.id} onSubmit={handleDeleteItem}/>
                          </Badge>
                        )}) ?? []
                  )}
              </div>
            </td>
            <td className="font-medium p-3 border-b">
              <div className="text-center">
                <TemplatesAddItemsModal onSubmit={handleAddItems} materials={materials.threads} id={template.id} type="threads">
                  <Button size="sm" variant="ghost"><PlusSquare/></Button>
                </TemplatesAddItemsModal>
              </div>
               <div className="flex flex-wrap gap-1 justify-center">
                  {materials.threads
                    .filter(thread =>
                      template.materials?.some(m => m.material_id === thread.id)
                    )
                    .flatMap(thread =>
                      template.materials
                        ?.filter(m => m.material_id === thread.id)
                        .map((material,index) => {
                          const latestInvoice = thread.invoices?.reduce<InvoiceList | null>(
                            (latest, curr) =>
                              !latest || new Date(curr.createdAt) > new Date(latest.createdAt)
                                ? curr
                                : latest,
                            null
                          )
                          return(
                          <Badge className="group flex items-center gap-2 text-[11px]"  variant="threads" key={`${material.id}_${index}`}>
                            {thread.color} – {thread.type}
                            {" "}({material.qty} {thread.unit}) –{" "}
                            {material.qty * (latestInvoice?.price ?? 0)} тг.
                             <TemplatesRemoveItemsModal id={material.id} onSubmit={handleDeleteItem}/>
                          </Badge>
                        )}) ?? []
                  )}
              </div>
            </td>
            <td className="font-medium p-3 border-b">
              <div className="text-center">
                <TemplatesAddItemsModal onSubmit={handleAddItems} materials={materials.buttons} id={template.id} type="buttons">
                  <Button size="sm" variant="ghost"><PlusSquare/></Button>
                </TemplatesAddItemsModal>
              </div>
              <div className="flex flex-wrap gap-1 justify-center">
                  {materials.buttons
                    .filter(button =>
                      template.materials?.some(m => m.material_id === button.id)
                    )
                    .flatMap(button =>
                      template.materials
                        ?.filter(m => m.material_id === button.id)
                        .map((material,index) => {
                          const latestInvoice = button.invoices?.reduce<InvoiceList | null>(
                            (latest, curr) =>
                              !latest || new Date(curr.createdAt) > new Date(latest.createdAt)
                                ? curr
                                : latest,
                            null
                          )
                          return(
                          <Badge className="group flex items-center gap-2 text-[11px]"  variant="buttons" key={`${material.id}_${index}`}>
                            {button.color} – {button.type}
                            {" "}({material.qty} {button.unit}) –{" "}
                            {material.qty * (latestInvoice?.price ?? 0)} тг.
                             <TemplatesRemoveItemsModal id={material.id} onSubmit={handleDeleteItem}/>
                          </Badge>
                        )}) ?? []
                  )}
              </div>
            </td>
            <td className="font-medium p-3 border-b">
              <div className="text-center">
                <TemplatesAddItemsModal onSubmit={handleAddItems} materials={materials.accessories} id={template.id} type="accessories">
                  <Button size="sm" variant="ghost"><PlusSquare/></Button>
                </TemplatesAddItemsModal>
              </div>
              <div className="flex flex-wrap gap-1 justify-center">
                  {materials.accessories
                    .filter(access =>
                      template.materials?.some(m => m.material_id === access.id)
                    )
                    .flatMap(access =>
                      template.materials
                        ?.filter(m => m.material_id === access.id)
                        .map((material,index) => {
                          const latestInvoice = access.invoices?.reduce<InvoiceList | null>(
                            (latest, curr) =>
                              !latest || new Date(curr.createdAt) > new Date(latest.createdAt)
                                ? curr
                                : latest,
                            null
                          )
                          return(
                          <Badge className="group flex items-center gap-2 text-[11px]"  variant="accessories" key={`${material.id}_${index}`}>
                            {access.name}
                            {" "}({material.qty} {access.unit}) –{" "}
                            {material.qty * (latestInvoice?.price ?? 0)} тг.
                             <TemplatesRemoveItemsModal id={material.id} onSubmit={handleDeleteItem}/>
                          </Badge>
                        )}) ?? []
                  )}
              </div>
            </td>
            <td className="font-medium p-3 border-b">
              <div className="text-center">
                <TemplatesAddItemsModal onSubmit={handleAddItems} materials={materials.velcro} id={template.id} type="velcro">
                  <Button size="sm" variant="ghost"><PlusSquare/></Button>
                </TemplatesAddItemsModal>
              </div>
              <div className="flex flex-wrap gap-1 justify-center">
                  {materials.velcro
                    .filter(vel =>
                      template.materials?.some(m => m.material_id === vel.id)
                    )
                    .flatMap(vel =>
                      template.materials
                        ?.filter(m => m.material_id === vel.id)
                        .map((material,index) => {
                          const latestInvoice = vel.invoices?.reduce<InvoiceList | null>(
                            (latest, curr) =>
                              !latest || new Date(curr.createdAt) > new Date(latest.createdAt)
                                ? curr
                                : latest,
                            null
                          )
                          return(
                          <Badge className="group flex items-center gap-2 text-[11px]"  variant="velcro" key={`${material.id}_${index}`}>
                            {vel.name}
                            {" "}({material.qty} {vel.unit}) –{" "}
                            {material.qty * (latestInvoice?.price ?? 0)} тг.
                             <TemplatesRemoveItemsModal id={material.id} onSubmit={handleDeleteItem}/>
                          </Badge>
                        )}) ?? []
                  )}
              </div>
            </td>
            <td className="font-medium text-right p-3 border-b">
              <Badge variant="default">{calcTotalPrice(template)} тг.</Badge>
            </td>
            


            <td className="text-right p-3 border-b">
                <TemplatesUpdateModal
                  id={template.id}
                  name={template.name}
                  description={template.description}
                  cuttingPrice={template.cuttingPrice}
                  sewingPrice={template.sewingPrice}
                  buttonsPrice={template.buttonsPrice}
                  onSubmit={handleUpdate}
                >
                  <Button size="icon" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                </TemplatesUpdateModal>

                <TemplatesRemoveModal
                  id={template.id}
                  onSubmit={handleDelete}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TemplatesRemoveModal>
            </td>
          </tr>
        ))}

        {filteredTemplates.length === 0 && (
          <tr>
            <td
              colSpan={14}
              className="py-10 text-center text-muted-foreground"
            >
              Ничего не найдено
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
</div>
  )
}
