import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { MaterialsTableProps } from "../materials/materials-table";
import { Templates } from "../templates/templates-table";

const materialTypes = [
  { key: "zippers", label: "Молнии", variant: "zippers" },
  { key: "fabrics", label: "Ткани", variant: "fabrics" },
  { key: "threads", label: "Нитки", variant: "threads" },
  { key: "buttons", label: "Пуговицы", variant: "buttons" },
  { key: "accessories", label: "Аксессуары", variant: "accessories" },
  { key: "velcro", label: "Велькро", variant: "velcro" },
];

type MaterialItem = MaterialsTableProps["zippers"][0] |
                    MaterialsTableProps["fabrics"][0] |
                    MaterialsTableProps["threads"][0] |
                    MaterialsTableProps["buttons"][0] |
                    MaterialsTableProps["accessories"][0] |
                    MaterialsTableProps["velcro"][0];

export default function OrdersCreateMaterials({
  templates,
  template_id,
  currentMaterials,
}: {
  template_id: string;
  templates: Templates[];
  currentMaterials: MaterialsTableProps
}) {
  const selectedTemplate = templates.find(t => t.id === template_id);


  const renderMaterial = (materialItem: any, typeKey: string, variant: string) => {
    const templateMaterials = selectedTemplate?.materials?.filter(m => m.material_id === materialItem.id) || [];

    return templateMaterials.map((mat, idx) => (
      <Badge
        key={`${mat.id}_${idx}`}
        variant={variant as  "zippers" | "fabrics" | "threads" | "buttons" | "accessories" | "velcro" }
        className="group flex items-center gap-2 text-[12px] p-2 border rounded-md shadow-sm hover:shadow-md transition"
      >
        {typeKey === "fabrics"
          ? `${materialItem.name} – ${materialItem.color} ${materialItem.type} (${mat.qty} ${materialItem.unit})`
          : typeKey === "accessories" || typeKey === "velcro"
          ? `${materialItem.name} (${mat.qty} ${materialItem.unit})`
          : `${materialItem.color} – ${materialItem.type} (${mat.qty} ${materialItem.unit})`}
        – {mat.qty * materialItem.price} тг.
      </Badge>
    ));
  };

  if(template_id === ""){
    return (
        <div className="p-20 bg-gray-50 flex items-center justify-center">
            <p>Выберите шаблон изделия чтобы увидеть материалы!</p>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {materialTypes.map(({ key, label, variant }) => {
        const items = (currentMaterials as any)[key]?.filter((item: any) =>
          selectedTemplate?.materials?.some(m => m.material_id === item.id)
        );

        if (!items || items.length === 0) return null;

        return (
          <div key={key} className="border rounded-lg p-3 bg-white shadow-sm">
            <h3 className="text-sm font-semibold mb-2">{label}</h3>
            <div className="flex flex-wrap gap-2">
                {items.flatMap((item: MaterialItem) => renderMaterial(item, key, variant))}
            </div>
          </div>
        );
      })}

    </div>
  );
}
