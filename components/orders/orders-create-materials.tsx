"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { MaterialsTableProps } from "../materials/materials-table";
import { TemplateItems } from "../templates/templates-add-items-modal";
import SelectMaterials from "../ui/select-materials";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const materialTypes = [
  { key: "zippers", label: "Молнии", variant: "zippers" },
  { key: "fabrics", label: "Ткани", variant: "fabrics" },
  { key: "threads", label: "Нитки", variant: "threads" },
  { key: "buttons", label: "Пуговицы", variant: "buttons" },
  { key: "accessories", label: "Аксессуары", variant: "accessories" },
  { key: "velcro", label: "Велькро", variant: "velcro" },
];

type MaterialItem =
  | MaterialsTableProps["zippers"][number]
  | MaterialsTableProps["fabrics"][number]
  | MaterialsTableProps["threads"][number]
  | MaterialsTableProps["buttons"][number]
  | MaterialsTableProps["accessories"][number]
  | MaterialsTableProps["velcro"][number];


export default function OrdersCreateMaterials({
  templates,
  setTemplates,
  currentMaterials,
  quantity,
  buttons,
  sewing_price,
  cutting_price,
  setQuantity,
  setButtons,
  setSewingPrice,
  setCuttingPrice
}: {
  templates: TemplateItems[];
  setTemplates: React.Dispatch<React.SetStateAction<TemplateItems[]>>;
  currentMaterials: MaterialsTableProps;
  quantity: number
  buttons:number
  sewing_price:number
  cutting_price:number
  setQuantity: (quantity:number)=>void
  setButtons: (buttons:number)=>void
  setSewingPrice: (sewing_price:number)=>void
  setCuttingPrice: (cuttin_price:number)=>void
}) {
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [qty, setQty] = useState<number>(1);

  const handleRemove = (id: string) => {

    setTemplates(prev => prev.filter(item => item.id !== id));
  };
  const findMaterialWithType = (id: string) => {
    for (const { key } of materialTypes) {
      const list = currentMaterials[key as keyof MaterialsTableProps];
      const material = list?.find(item => item.id === id);
      if (material) return { material, material_type: key };
    }
    return null;
  };

  const handleAdd = () => {
    if (!selectedMaterial || qty < 1) return;

    const materialInfo = findMaterialWithType(selectedMaterial);
    if (!materialInfo) return;

    setTemplates(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        material_id: selectedMaterial,
        material_type: materialInfo.material_type,
        qty,
      },
    ]);

    setSelectedMaterial("");
    setQty(1);
  };

  const renderMaterial = (materialItem: MaterialItem, typeKey: string, variant: string) => {
    const templateMaterials = templates.filter(m => m.material_id === materialItem.id);

    return templateMaterials.map((mat, idx) => {

      const name = "name" in materialItem ? materialItem.name : "";
      const color = "color" in materialItem ? materialItem.color : "";
      const type = "type" in materialItem ? materialItem.type : "";
      const unit = "unit" in materialItem ? materialItem.unit : "";
      const price = "price" in materialItem ? materialItem.price : 0;

      return (
        <Badge
          key={`${mat.id}_${idx}`}
          variant={variant as "zippers" | "fabrics" | "threads" | "buttons" | "accessories" | "velcro"}
          className="group flex items-center gap-2 text-[12px] p-2 border rounded-md shadow-sm hover:shadow-md transition"
        >
          {typeKey === "fabrics"
            ? `${name} – ${color} ${type} (${mat.qty} ${unit})`
            : typeKey === "accessories" || typeKey === "velcro"
              ? `${name} (${mat.qty} ${unit})`
              : `${color} – ${type} (${mat.qty} ${unit})`}
          – {mat.qty * price} тг.
          <div onClick={() => handleRemove(mat.id)} className="cursor-pointer">
            <Trash2
              className="w-3 h-3 cursor-pointer opacity-0 group-hover:opacity-100 text-red-600"
            />
          </div>
        </Badge>
      );
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 p-4 rounded-md bg-green-50">
        <div>
          <Label>Кол-во</Label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="p-3 text-lg bg-white"
          />
        </div>
        <div>
          <Label>Кол-во (Пуговицы)</Label>
          <Input
            type="number"
            value={buttons}
            onChange={(e) => setButtons(Number(e.target.value))}
            className="p-3 text-lg bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 rounded-md bg-green-50">
        <div>
          <Label>Цена кроя</Label>
          <Input
            type="number"
            value={cutting_price}
            onChange={(e) => setCuttingPrice(Number(e.target.value))}
            className="p-3 text-lg bg-white"
          />
        </div>
        <div>
          <Label>Цена пошива</Label>
          <Input
            type="number"
            value={sewing_price}
            onChange={(e) => setSewingPrice(Number(e.target.value))}
            className="p-3 text-lg bg-white"
          />
        </div>
      </div>
      {materialTypes.map(({ key, label, variant }) => {
        const items = currentMaterials[key as keyof MaterialsTableProps];
        if (!items || items.length === 0) return null;

        return (
          <div key={key} className="border rounded-lg p-3 bg-white shadow-sm">
            <div className="flex items-center justify-start gap-4 mb-2">
              <h3 className="text-sm font-semibold">{label}</h3>
              <div className="flex gap-2">
                <SelectMaterials
                  placeholder="Выберите материал"
                  value={selectedMaterial}
                  onValueChange={setSelectedMaterial}
                  materials={items}
                />
                <div>
                  <Input
                    type="number"
                    min={1}
                    className="w-15"
                    value={qty}
                    onChange={e => setQty(Number(e.target.value))}
                    placeholder="Кол-во"
                  />
                </div>
                <Button size="sm" onClick={handleAdd}>Добавить</Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {items.flatMap(item => renderMaterial(item, key, variant))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
