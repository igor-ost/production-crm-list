"use client"

import { Trash2, Search, Edit, PlusSquare } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import TemplatesCreateModal from "./templates-create-modal"
import TemplatesUpdateModal from "./templates-update-modal"
import TemplatesRemoveModal from "./templates-remove-modal"
import { Badge } from "../ui/badge"
import TemplatesAddItemsModal, { TemplateItems } from "./templates-add-items-modal"
import { MaterialsTableProps } from "../materials/materials-table"
import TemplatesRemoveItemsModal from "./templates-remove-items-modal"


export interface Templates {
  id: string;
  name: string;
  description:string
  materials: TemplateItems[]
}



interface TemplatesTableProps {
  templates: Templates[]
  materials: MaterialsTableProps
}

export function TemplatesTable({ templates,materials }: TemplatesTableProps) {
  const [search, setSearch] = useState("")
  const [templatesList,setTemplatesList] = useState(templates)

  const handleNew = (id:string,name:string,description:string) => {
    const updated = {
      id:id,
      name:name,
      description:description,
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
  const handleUpdate = (id:string,name:string,description:string)=>{
    setTemplatesList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, name, description}
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
      if (!material) return sum;
      return sum + tm.qty * material.price;
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
  <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-background/60 p-4 shadow-sm backdrop-blur">
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
        <Button className="rounded-lg">
          Добавить
        </Button>
      </TemplatesCreateModal>
    </div>
  </div>

  {/* Таблица */}
  <div className="overflow-hidden rounded-xl border bg-background/60 shadow-sm backdrop-blur">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="w-[80px]">#</TableHead>
          <TableHead className="text-xs">Название</TableHead>
          <TableHead className="text-xs">Описание</TableHead>
          <TableHead className="text-center text-xs">Молнии</TableHead>
          <TableHead className="text-center text-xs">Ткани</TableHead>
          <TableHead className="text-center text-xs">Нитки</TableHead>
          <TableHead className="text-center text-xs">Пуговицы</TableHead>
          <TableHead className="text-center text-xs">Аксессуары</TableHead>
          <TableHead className="text-center text-xs">Велькро</TableHead>
          <TableHead className="text-right text-xs">Общая цена</TableHead>
          <TableHead className="text-right px-4">Действия</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {filteredTemplates.map((template, index) => (
          <TableRow
            key={template.id}
            className="transition-colors hover:bg-muted/40 even:bg-muted/20"
          >
            <TableCell className="font-medium text-muted-foreground">
              {index + 1}
            </TableCell>

            <TableCell className="font-medium text-xs">
              {template.name}
            </TableCell>

            <TableCell className="font-mono text-xs text-muted-foreground">
              {template.description}
            </TableCell>

            <TableCell className="font-medium">
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
                        .map((material,index) => (
                          <Badge className="group flex items-center gap-2 text-[11px]" variant="zippers" key={`${material.id}_${index}`}>
                            {zipper.color} – {zipper.type}
                            {" "}({material.qty} {zipper.unit}) –{" "}
                            {material.qty * zipper.price} тг.
                            <TemplatesRemoveItemsModal id={material.id} onSubmit={handleDeleteItem}/>
                          </Badge>
                        )) ?? []
                    )}
              </div>
            </TableCell>
            <TableCell className="font-medium">
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
                        .map((material,index) => (
                          <Badge className="group flex items-center gap-2 text-[11px]" variant="fabrics" key={`${material.id}_${index}`}>
                            {fabric.name} – {fabric.color} {fabric.type}
                            {" "}({material.qty} {fabric.unit}) –{" "}
                            {material.qty * fabric.price} тг.
                             <TemplatesRemoveItemsModal id={material.id} onSubmit={handleDeleteItem}/>
                          </Badge>
                        )) ?? []
                  )}
              </div>
            </TableCell>
            <TableCell className="font-medium">
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
                        .map((material,index) => (
                          <Badge className="group flex items-center gap-2 text-[11px]"  variant="threads" key={`${material.id}_${index}`}>
                            {thread.color} – {thread.type}
                            {" "}({material.qty} {thread.unit}) –{" "}
                            {material.qty * thread.price} тг.
                             <TemplatesRemoveItemsModal id={material.id} onSubmit={handleDeleteItem}/>
                          </Badge>
                        )) ?? []
                  )}
              </div>
            </TableCell>
            <TableCell className="font-medium">
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
                        .map((material,index) => (
                          <Badge className="group flex items-center gap-2 text-[11px]"  variant="buttons" key={`${material.id}_${index}`}>
                            {button.color} – {button.type}
                            {" "}({material.qty} {button.unit}) –{" "}
                            {material.qty * button.price} тг.
                             <TemplatesRemoveItemsModal id={material.id} onSubmit={handleDeleteItem}/>
                          </Badge>
                        )) ?? []
                  )}
              </div>
            </TableCell>
            <TableCell className="font-medium">
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
                        .map((material,index) => (
                          <Badge className="group flex items-center gap-2 text-[11px]"  variant="accessories" key={`${material.id}_${index}`}>
                            {access.name}
                            {" "}({material.qty} {access.unit}) –{" "}
                            {material.qty * access.price} тг.
                             <TemplatesRemoveItemsModal id={material.id} onSubmit={handleDeleteItem}/>
                          </Badge>
                        )) ?? []
                  )}
              </div>
            </TableCell>
            <TableCell className="font-medium">
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
                        .map((material,index) => (
                          <Badge className="group flex items-center gap-2 text-[11px]"  variant="velcro" key={`${material.id}_${index}`}>
                            {vel.name}
                            {" "}({material.qty} {vel.unit}) –{" "}
                            {material.qty * vel.price} тг.
                             <TemplatesRemoveItemsModal id={material.id} onSubmit={handleDeleteItem}/>
                          </Badge>
                        )) ?? []
                  )}
              </div>
            </TableCell>
            <TableCell className="font-medium text-right">
              <Badge variant="default">{calcTotalPrice(template)} тг.</Badge>
            </TableCell>
            


            <TableCell className="text-right">
                <TemplatesUpdateModal
                  id={template.id}
                  name={template.name}
                  description={template.description}
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
            </TableCell>
          </TableRow>
        ))}

        {filteredTemplates.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={11}
              className="py-10 text-center text-muted-foreground"
            >
              Ничего не найдено
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
</div>

  )
}
