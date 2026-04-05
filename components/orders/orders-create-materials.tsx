"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { InvoiceList, Materials } from "../materials/materials-table";
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
  | Materials["zippers"][number]
  | Materials["fabrics"][number]
  | Materials["threads"][number]
  | Materials["buttons"][number]
  | Materials["accessories"][number]
  | Materials["velcro"][number];


export default function OrdersCreateMaterials({
  templates,
  setTemplates,
  currentMaterials,
  quantity,
  buttons,
  sewing_price,
  cutting_price,
  buttonsPrice,
  setButtons,
  setSewingPrice,
  setCuttingPrice,
  setButtonsPrice
}: {
  templates: TemplateItems[];
  setTemplates: React.Dispatch<React.SetStateAction<TemplateItems[]>>;
  currentMaterials: Materials;
  buttons:number
  quantity:number
  sewing_price:number
  cutting_price:number
  buttonsPrice:number
  setButtons: (buttons:number)=>void
  setSewingPrice: (sewing_price:number)=>void
  setCuttingPrice: (cuttin_price:number)=>void
  setButtonsPrice: (buttonsPrice:number)=>void
}) {
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleRemove = (id: string) => {

    setTemplates(prev => prev.filter(item => item.id !== id));
  };
  const findMaterialWithType = (id: string) => {
    for (const { key } of materialTypes) {
      const list = currentMaterials[key as keyof Materials];
      const material = list?.find(item => item.id === id);
      if (material) return { material, material_type: key };
    }
    return null;
  };

  const findMaterial = (id: string) => {
      for (const { key } of materialTypes) {
        const list = currentMaterials[key as keyof Materials];
        const material = list?.find(item => item.id === id);
        if (material) return { material};
      }
  }

const handleAdd = (typeKey: string) => {
  const selectedMaterial = selectedMaterials[typeKey] || "";
  const qty = quantities[typeKey] || 1;

  if (!selectedMaterial || qty <= 0) return;

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

  // Очищаем только текущую секцию
  setSelectedMaterials(prev => ({ ...prev, [typeKey]: "" }));
  setQuantities(prev => ({ ...prev, [typeKey]: 1 }));
};

   const getTypeDetails = (typeKey: string) => {
    const items = templates
      .map(m => {
        const info = findMaterialWithType(m.material_id) as any; 
        const latestInvoice = info?.material?.invoices?.reduce(
          (latest:any, curr:any) =>
          !latest || new Date(curr.createdAt) > new Date(latest.createdAt)
          ? curr
          : latest,
          null
        )
        if (!info || info.material_type !== typeKey) return null;

        const usedQty =
          typeKey === "buttons"
            ? buttons * m.qty
            : quantity * m.qty;

        return {
          name:
            typeKey === "fabrics"
              ? `${info.material.name} – ${info.material.color}`
              : typeKey === "accessories" || typeKey === "velcro"
              ? info.material.name
              : `${info.material.color} – ${info.material.type}`,
          qty: usedQty,
          price: usedQty * (latestInvoice?.price ?? 0),
        };
      })
      .filter(Boolean);

    const totalQty = items.reduce((acc, i) => acc + i!.qty, 0);
    const totalPrice = items.reduce((acc, i) => acc + i!.price, 0);

    return { items, totalQty, totalPrice };
  };
  

  const renderMaterial = (materialItem: MaterialItem, typeKey: string, variant: string) => {
    const templateMaterials = templates.filter(m => m.material_id === materialItem.id);

    return templateMaterials.map((mat, idx) => {

      const material = findMaterial(mat.material_id)
      const latestInvoice = material?.material.invoices?.reduce<InvoiceList | null>(
          (latest, curr) =>
          !latest || new Date(curr.createdAt) > new Date(latest.createdAt)
          ? curr
          : latest,
          null
      )

      const name = "name" in materialItem ? materialItem.name : "";
      const color = "color" in materialItem ? materialItem.color : "";
      const type = "type" in materialItem ? materialItem.type : "";
      const unit = "unit" in materialItem ? materialItem.unit : "";

      return (
        <Badge
          key={`${mat.id}_${idx}`}
          variant={variant as "zippers" | "fabrics" | "threads" | "buttons" | "accessories" | "velcro"}
          className="group flex items-center gap-2 text-[12px] p-2 border rounded-md shadow-sm hover:shadow-md transition"
        >
          {typeKey === "fabrics"
            ? `${name} – ${color} (${mat.qty} ${unit})`
            : typeKey === "accessories" || typeKey === "velcro"
              ? `${name} (${mat.qty} ${unit})`
              : `${color} – ${type} (${mat.qty} ${unit})`}
          – {mat.qty * quantity * (latestInvoice?.price ?? 0)} тг.
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
          <Label>Кол-во (блочек-кнопок) <span className="text-black">необязательное поле*</span></Label>
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
        <div>
          <Label>Цена блочек-кнопок</Label>
          <Input
            type="number"
            value={buttonsPrice}
            onChange={(e) => setButtonsPrice(parseFloat(e.target.value))}
            className="p-3 text-lg bg-white"
          />
        </div>
      </div>
      {materialTypes.map(({ key, label, variant }) => {
        const items = currentMaterials[key as keyof Materials];
        if (!items || items.length === 0) return null;

        const summary = getTypeDetails(key);

        return (
          <div key={key} className="grid grid-cols-[1fr_200px] gap-4 border rounded-lg p-4 bg-white shadow-sm">
            {/* Левая часть */}
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-2">
                <h3 className="text-sm font-semibold">{label}</h3>
                <div className="flex gap-2 flex-wrap">
                 <SelectMaterials
                    placeholder="Выберите материал"
                    value={selectedMaterials[key] || ""}
                    onValueChange={(val) => setSelectedMaterials(prev => ({ ...prev, [key]: val }))}
                    materials={items}
                  />
                  <Input
                    type="number"
                    min={1}
                    className="w-16"
                    value={quantities[key] || 1}
                    onChange={e => setQuantities(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                    placeholder="Кол-во"
                  />
                  <Button size="sm" onClick={() => handleAdd(key)}>Добавить</Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.flatMap(item => renderMaterial(item, key, variant))}
              </div>
            </div>

            {/* Правая сводка */}
            <div className="border-l pl-4 flex flex-col justify-start space-y-1 text-sm">
              {summary.items.length > 0 ? (
                <>
                  {summary.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between text-[12px]">
                      <span className="truncate">{i!.name}</span>
                      <span>{i!.qty} шт. – {i!.price} тг</span>
                    </div>
                  ))}
                  <div className="border-t mt-1 pt-1 flex justify-between font-semibold text-xs">
                    <span>Итого</span>
                    <span>{summary.totalQty} шт. – {summary.totalPrice} тг</span>
                  </div>
                  {key === "buttons" && (
                    <div className="text-[10px] text-muted-foreground mt-1">
                      × кол-во пуговиц
                    </div>
                  )}
                </>
              ) : (
                <span className="text-xs text-muted-foreground">Нет расхода</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
