import { Badge } from "../ui/badge";
import { MaterialsTableProps } from "../materials/materials-table";
import { TemplateItems } from "../templates/templates-add-items-modal";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Api } from "@/services/api-clients";
import SelectMaterials from "../ui/select-materials";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

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

export default function OrdersViewMaterials({
  materials,
  currentMaterials,
  order_id,
}: {
  order_id: string;
  materials?: TemplateItems[];
  currentMaterials: MaterialsTableProps
}) {

  const [materialsList,setMaterialsList] = useState<TemplateItems[]>([])

  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [qty, setQty] = useState<number>(1);

  const findMaterialWithType = (id: string) => {
    for (const { key } of materialTypes) {
        const list = currentMaterials[key as keyof MaterialsTableProps];
        const material = list?.find(item => item.id === id);
        if (material) return { material, material_type: key };
    }
  }

  const handleAdd = async () => {
     if (!selectedMaterial || qty < 1) return;

    const materialInfo = findMaterialWithType(selectedMaterial);
    if (!materialInfo) return;

    try {
      const response = await Api.order_materials.create({
        order_id: order_id,
        material_id: selectedMaterial,
        material_type: materialInfo.material_type,
        qty: qty
      })
      
      if(response){
        setMaterialsList(prev=> [...prev, response]);
        setSelectedMaterial("");
        setQty(1);
      }
    } catch (error) {
      
    }
  }

  const handleRemove = async (id:string) => {
    try {
      const response = await Api.order_materials.remove(id)
      if(response.status){
        setMaterialsList((prev)=> prev?.filter(i=>i.id !== id))
      }  
    } catch (error) {
      console.log(error)
    }
    
  }

  useEffect(()=>{if(materials)setMaterialsList(materials)},[materials])

  const renderMaterial = (materialItem: any, typeKey: string, variant: string) => {
    const templateMaterials = materialsList?.filter(m => m.material_id === materialItem.id) || [];

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
         <div onClick={() => handleRemove(mat.id)} className="cursor-pointer">
          <Trash2
            className="w-3 h-3 cursor-pointer opacity-0 group-hover:opacity-100 text-red-600"
          />
        </div>
      </Badge>
    ));
  };

  return (
    <div className="flex flex-col gap-4">
      {materialTypes.map(({ key, label, variant }) => {
        const items = (currentMaterials as any)[key]?.filter((item: any) =>
          materialsList?.some(m => m.material_id === item.id)
        );


        return (
          <div key={key} className="border rounded-lg p-3 bg-white shadow-sm">
           <div className="flex items-center justify-start gap-4 mb-2">
              <h3 className="text-sm font-semibold">{label}</h3>
              <div className="flex gap-2">
                <SelectMaterials
                  placeholder="Выберите материал"
                  value={selectedMaterial}
                  onValueChange={setSelectedMaterial}
                  materials={currentMaterials[key as keyof MaterialsTableProps]}
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
                {items.flatMap((item: MaterialItem) => renderMaterial(item, key, variant))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
