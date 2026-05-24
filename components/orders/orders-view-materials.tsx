import { Badge } from "../ui/badge";
import { InvoiceList, Materials, MaterialsTableProps } from "../materials/materials-table";
import { TemplateItems } from "../templates/templates-add-items-modal";
import { Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Api } from "@/services/api-clients";
import SelectMaterials from "../ui/select-materials";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import OrdersEditMaterialModal from "./order-edit-materials-modal";


export const materialTypes = [
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
  setMaterials,
  sewing_price,
  cutting_price,
  buttonsPrice,
  buttons,
  quantity,
  onUpdate
}: {
  order_id: string;
  materials?: TemplateItems[];
  currentMaterials: MaterialsTableProps,
  setMaterials?: (materials: TemplateItems[]) => void
  sewing_price: number;
  cutting_price: number;
  buttonsPrice: number;
  buttons: number;
  quantity: number;
  onUpdate?: (quantity:number,buttons:number,sewing_price:number,cuttin_price:number,buttonsPrice:number)=>void
}) {

  const [materialsList, setMaterialsList] = useState<TemplateItems[]>([])

const [selectedMaterials, setSelectedMaterials] = useState<Record<string, string>>({});
const [quantities, setQuantities] = useState<Record<string, number>>({});

  const [isUpdated,setIsUpdated] = useState(false)
  const [newsewing_price, setSewingPrice] = useState<number>(sewing_price);
  const [newcutting_price, setCuttingPrice] = useState<number>(cutting_price);
  const [newButtonsPrice, setButtonsPrice] = useState<number>(buttonsPrice);
  const [newbuttons, setButtons] = useState(buttons);
  const [newquantity, setQuantity] = useState(quantity);


  const findMaterialWithType = (id: string) => {
    for (const { key } of materialTypes) {
      const list = currentMaterials[key as keyof Materials];
      const material = list?.find(item => item.id === id);
      if (material) return { material, material_type: key };
    }
  }
  const findMaterial = (id: string) => {
    for (const { key } of materialTypes) {
      const list = currentMaterials[key as keyof Materials];
      const material = list?.find(item => item.id === id);
      if (material) return { material};
    }
  }


const handleAdd = async (typeKey: string) => {
  const selectedMaterial = selectedMaterials[typeKey] || "";
  const qty = quantities[typeKey] || 1;
  
  if (!selectedMaterial || qty <= 0) return;

    const materialInfo = findMaterialWithType(selectedMaterial);
    if (!materialInfo) return;

    try {
      const response = await Api.order_materials.create({
        order_id: order_id,
        material_id: selectedMaterial,
        material_type: materialInfo.material_type,
        qty: qty
      })

      if (response) {
        const response_2 = await Api.materials_consumptions.createMany(order_id,[{
        id: order_id,
        material_id: selectedMaterial,
        material_type: materialInfo.material_type,
        qty: qty
      }])
        if(response_2){
          const newArray = [...materialsList, response]
          setMaterialsList(newArray);
          if (setMaterials) {
            setMaterials(newArray)
          }
          setSelectedMaterials(prev => ({ ...prev, [typeKey]: "" }));
          setQuantities(prev => ({ ...prev, [typeKey]: 1 }));
        }
      }
    } catch (error) {

    }
  }

const handleRemove = async (id: string) => {
    try {
      const response = await Api.order_materials.remove(id)
      const mat_id = materialsList.find(i=>i.id == id)?.material_id || ""
      if (response.status) {
        const updatedArray = materialsList.filter(i => i.id !== id)
        setMaterialsList(updatedArray)
        if (setMaterials) {
          console.log(mat_id)
          const response_2 = await Api.materials_consumptions.remove(order_id,mat_id)
          if(response_2){
            setMaterials(updatedArray)
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateQty = async (id: string, newQty: number) => {
    try {
      const data = {
        qty: newQty
      }
      const response = await Api.order_materials.update(id,data)
      if(response){
        const mat_id = materialsList.find(i=>i.id == id)?.material_id || ""
        const updatedArray = materialsList.map(item =>item.id === id ? { ...item, qty: newQty } : item)
        const response_2 = await Api.materials_consumptions.update(order_id,mat_id,newQty)
        if(response_2){
          setMaterialsList(updatedArray)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  const handleUpdate = async () => {
    try {
      const data = {
        quantity: newquantity,
        buttons: newbuttons,
        cutting_price: Number(newcutting_price),
        sewing_price: Number(newsewing_price),
        buttonsPrice: Number(newButtonsPrice)
      }
      const response = await Api.orders.update(order_id,data)
      if(response){
        onUpdate?.(newquantity,newbuttons,newsewing_price,newcutting_price,newButtonsPrice);
        setIsUpdated(true)
        setTimeout(()=>{
          setIsUpdated(false)
        },2000)
      }
    } catch (error) {
      console.log(error)
    }
  }

   const getTypeDetails = (typeKey: string) => {
    const items = materialsList
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
            unit: info.material.unit,
            price: usedQty * (latestInvoice?.price ?? 0),
          };
      })
      .filter(Boolean);

const totalQtyByUnit = items.reduce((acc, i) => {
  if (!i) return acc;
  const unit = i.unit || "шт";

  if (!acc[unit]) acc[unit] = 0;
  acc[unit] += i.qty;

  return acc;
}, {} as Record<string, number>);
    const totalPrice = items.reduce((acc, i) => acc + i!.price, 0);

    return { items, totalQtyByUnit, totalPrice };
  };

  useEffect(() => { if (materials) setMaterialsList(materials) }, [materials])

  // Общий расход по всем материалам
  const totalExpenseAllMaterials = useMemo(() => {
    return materialTypes.reduce((total, { key }) => {
      const summary = getTypeDetails(key);
      return total + summary.totalPrice;
    }, 0);
  }, [materialsList, newquantity, newbuttons])

  const renderMaterial = (materialItem: any, typeKey: string, variant: string) => {
    const templateMaterials = materialsList?.filter(m => m.material_id === materialItem.id) || [];
    return templateMaterials.map((mat, idx) => {
      const material = findMaterial(mat.material_id)
      const latestInvoice = material?.material.invoices?.reduce<InvoiceList | null>(
          (latest, curr) =>
          !latest || new Date(curr.createdAt) > new Date(latest.createdAt)
          ? curr
          : latest,
          null
      )
      return(
      <Badge
        key={`${mat.id}_${idx}`}
        onClick={()=>console.log(mat.id)}
        variant={variant as "zippers" | "fabrics" | "threads" | "buttons" | "accessories" | "velcro"}
        className="group flex items-center gap-2 text-[12px] p-2 border rounded-md shadow-sm hover:shadow-md transition"
      >
        {typeKey === "fabrics"
          ? `${materialItem.name} – ${materialItem.color} (${mat.qty} ${materialItem.unit})`
          : typeKey === "accessories" || typeKey === "velcro"
            ? `${materialItem.name} (${mat.qty} ${materialItem.unit})`
            : `${materialItem.color} – ${materialItem.type} (${mat.qty} ${materialItem.unit})`}
– {mat.qty * quantity * (latestInvoice?.price ?? 0)} тг.
        <OrdersEditMaterialModal
          materialId={mat.id}
          currentQty={mat.qty}
          materialName={
            typeKey === "fabrics"
              ? `${materialItem.name} – ${materialItem.color}`
              : typeKey === "accessories" || typeKey === "velcro"
                ? materialItem.name
                : `${materialItem.color} – ${materialItem.type}`
          }
          onUpdate={handleUpdateQty}
        />
        <div onClick={() => handleRemove(mat.id)} className="cursor-pointer">
          <Trash2
            className="w-3 h-3 cursor-pointer opacity-0 group-hover:opacity-100 text-red-600"
          />
        </div>
      </Badge>
    )});
  };

  return (
    <div className="flex flex-col gap-4">

      <div className="grid grid-cols-2 gap-4 p-4 rounded-md bg-green-50">
        <div>
          <Label>Кол-во</Label>
          <Input
            type="number"
            value={newquantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="p-3 text-lg bg-white"
          />
        </div>
        <div>
          <Label>Кол-во (блочек-кнопок) <span className="text-black">необязательное поле*</span></Label>
          <Input
            type="number"
            value={newbuttons}
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
            value={newcutting_price}
            onChange={(e) => setCuttingPrice(parseFloat(e.target.value))}
            className="p-3 text-lg bg-white"
          />
        </div>
        <div>
          <Label>Цена пошива</Label>
          <Input
            type="number"
            value={newsewing_price}
            onChange={(e) => setSewingPrice(parseFloat(e.target.value))}
            className="p-3 text-lg bg-white"
          />
        </div>
        <div>
          <Label>Цена блочек-кнопок</Label>
          <Input
            type="number"
            value={newButtonsPrice}
            onChange={(e) => setButtonsPrice(parseFloat(e.target.value))}
            className="p-3 text-lg bg-white"
          />
        </div>
      </div>

<Button disabled={isUpdated} onClick={handleUpdate} variant="yellow" className={`${isUpdated == true ? "bg-green-700 " : null} transition-all duration-75`}>{isUpdated ? "Успех!" : "Обновить кол-во/цену"}</Button>

      {/* Общий расход по всем материалам */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Общий расход по всем материалам</span>
          <span className="text-xl font-bold">{totalExpenseAllMaterials.toLocaleString("ru-RU")} тг</span>
          <span className="text-xl font-bold">{(totalExpenseAllMaterials / quantity).toLocaleString("ru-RU")} тг (за единицу)</span>
        </div>
      </div>

      {materialTypes.map(({ key, label, variant }) => {
        const items = (currentMaterials as any)[key]?.filter((item: any) =>
          materialsList?.some(m => m.material_id === item.id)
        );

        const summary = getTypeDetails(key);


        return (
          <div
            key={key}
            className="grid grid-cols-[1fr_180px] gap-4 border rounded-lg p-4 bg-white"
          >
            {/* Левая часть */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3 className="text-sm font-semibold">{label}</h3>
                <SelectMaterials
                  value={selectedMaterials[key] || ""}
                  onValueChange={(val) => setSelectedMaterials(prev => ({ ...prev, [key]: val }))}
                  materials={currentMaterials[key as keyof MaterialsTableProps]}
                />
                <Input
                  type="number"
                  className="w-16"
                  value={quantities[key] || 1}
                  onChange={e => setQuantities(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                />
                <Button size="sm" onClick={() => handleAdd(key)}>
                Добавить
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {items.flatMap((item: MaterialItem) =>
                  renderMaterial(item, key, variant)
                )}
              </div>
            </div>

            {/* Правая сводка */}
            <div className="border-l pl-4 text-sm flex flex-col justify-start space-y-1">
              {summary.items.length > 0 ? (
                <>
                  {summary.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between text-[12px]">
                      <span className="truncate">{i!.name}</span>
                      <span>
                        <span>
                          {i!.qty} {i!.unit} – {i!.price} тг
                        </span>
                      </span>
                    </div>
                  ))}
                  <div className="border-t mt-1 pt-1 flex justify-between font-semibold text-xs">
                    <span>Итого</span>
                    <span>
                    <span>
                      {Object.entries(summary.totalQtyByUnit)
                        .map(([unit, qty]) => `${qty} ${unit}`)
                        .join(", ")} – {summary.totalPrice} тг
                    </span>
                    </span>
                  </div>
                  {key === "buttons" && (
                    <div className="text-[10px] text-muted-foreground mt-1">
                      × кол-во пуговиц
                    </div>
                  )}
                </>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Нет расхода
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
