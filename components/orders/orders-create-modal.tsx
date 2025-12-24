"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import SelectTemplates from "../ui/select-templates";
import SelectCustomers from "../ui/select-customers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Api } from "@/services/api-clients";
import { Orders } from "./orders-table";
import { Customers } from "../customers/customers-table";
import { Templates } from "../templates/templates-table";
import { MaterialsTableProps } from "../materials/materials-table";
import OrdersCreateMaterials from "./orders-create-materials";
import OrdersCreatePhoto from "./orders-create-photo";
import { TemplateItems } from "../templates/templates-add-items-modal";


export default function OrdersCreateFullScreen({
  children,
  templates,
  customers,
  materials,
  onSubmit,
}: {
  children: React.ReactNode;
  templates: Templates[];
  customers: Customers[];
  materials: MaterialsTableProps;
  onSubmit: (id: string, response: Orders) => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "materials" | "photo">("info");
  const [currentMaterials,setCurrentMaterials] = useState(materials)
  const [materialOrderList, setMaterialOrderList] = useState<TemplateItems[]>([])
  const [photos,setPhotos] = useState<File[]>([])
  const [template_id, setTemplate] = useState("");
  const [customer_id, setCustomer] = useState("");
  const [size, setSize] = useState("");
  const [status, setStatus] = useState<"new" | "in-progress" | "completed">("new");
  const [sewing_price, setSewingPrice] = useState(0);
  const [cutting_price, setCuttingPrice] = useState(0);
  const [buttons, setButtons] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  console.log(photos)
  const handleSubmit = async () => {
    setIsLoading(true);
    if (!template_id){setError("Поле (Изделие) обязательно для заполнения.");setIsLoading(false);return}
    if (!customer_id){setError("Поле (Заказчик) обязательно для заполнения.");setIsLoading(false);return}
    if (!size){setError("Поле (Размер) обязательно для заполнения.");setIsLoading(false);return}
    if (!sewing_price){setError("Поле (Цена пошива) обязательно для заполнения.");setIsLoading(false);return}
    if (!cutting_price){setError("Поле (Цена кроя) обязательно для заполнения.");setIsLoading(false);return}
    if (!quantity){setError("Поле (Кол-во) обязательно для заполнения.");setIsLoading(false);return}
    if (!buttons){setError("Поле (Кол-во пуговиц) обязательно для заполнения.");setIsLoading(false);return}

    const order = {
      template_id,
      customer_id,
      size,
      status,
      sewing_price,
      cutting_price,
      buttons,
      quantity,
      notes,
    };

    try {
      const response = await Api.orders.create(order);
      if (response.id) {
        try {
          const response_materials = await Api.order_materials.create(response.id,materialOrderList)
          console.log(response_materials)
        } catch (error) {
          setError(error instanceof Error ? error.message : "Произошла ошибка");
        }finally{
          setIsLoading(false);
        }
        setTemplate("");
        setCustomer("");
        setSize("");
        setStatus("new");
        setQuantity(0);
        setButtons(0);
        setCuttingPrice(0);
        setSewingPrice(0);
        setNotes("");
        onSubmit(response.id, response);
        setOpen(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMaterialOrderList(
      templates.find(i => i.id === template_id)?.materials || []
    );
  }, [template_id]);
  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/50 overflow-auto p-4">
          <div className="bg-white w-full max-w-4xl h-full md:h-auto rounded-lg shadow-lg relative p-6 animate-fadeIn">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === "info"
                    ? "border-b-4 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab("info")}
              >
                Основная информация
              </button>
              <button
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === "materials"
                    ? "border-b-4 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab("materials")}
              >
                Материалы
              </button>
              <button
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === "photo"
                    ? "border-b-4 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab("photo")}
              >
                Фото
              </button>
            </div>

            {/* Tab content */}
            {activeTab === "info" && (
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label>Изделие</Label>
                  <SelectTemplates value={template_id} onValueChange={setTemplate} templates={templates} />
                  <p className="text-sm text-gray-500">
                    {templates.find((t) => t.id === template_id)?.description}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label>Заказчик</Label>
                  <SelectCustomers value={customer_id} onValueChange={setCustomer} customers={customers} />
                  {customers.find((c) => c.id === customer_id)?.bin && (
                    <p className="text-sm text-gray-500">
                      БИН: {customers.find((c) => c.id === customer_id)?.bin}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label>Размер</Label>
                  <Input
                    placeholder="Введите размер"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="p-3 text-lg"
                  />
                </div>

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

                <div className="grid gap-2">
                  <Label>Статус</Label>
                  <Select value={status} onValueChange={(v: "new" | "in-progress" | "completed") => setStatus(v)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Новый</SelectItem>
                      <SelectItem value="in-progress">В работе</SelectItem>
                      <SelectItem value="completed">Завершен</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Примечание</Label>
                  <Textarea
                    placeholder="Введите описание"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="p-3 text-lg min-h-[120px]"
                  />
                </div>

                {error && <p className="text-red-600 font-bold">{error}</p>}
              </div>
            )}

            {activeTab === "materials" && (
              <div className="text-gray-500 text-center">
                  <OrdersCreateMaterials currentMaterials={currentMaterials}  template_id={template_id} templates={templates}/>
              </div>
            )}

            {activeTab === "photo" && (
              <div className="text-gray-500 text-center">
                  <OrdersCreatePhoto photos={photos} setPhotos={setPhotos}/>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Отмена
              </Button>
              <Button disabled={isLoading} onClick={handleSubmit}>
                {!isLoading ? "Создать" : "Создание..."}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
