"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Orders, statusColors, statusLabels } from "./orders-table";
import { MaterialsTableProps } from "../materials/materials-table";
import OrdersViewMaterials from "./orders-view-materials";
import { createPortal } from "react-dom";
import { Badge } from "../ui/badge";
import { Journal, JournalTable } from "../journal/journal-table";
import { Staff } from "../staff/staff-table";
import OrdersViewPhoto, { Photos } from "./orders-view-photo";
import OrdersViewStaff from "./orders-view-staff";


export default function OrdersViewModal({
  children,
  order,
  materials,
  staff,
  photos
}: {
  children: React.ReactNode;
  order: Orders;
  staff: Staff[];
  materials: MaterialsTableProps;
  photos: Photos[]
}) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "materials" | "photo" | "journal" | "staff">("info");
  const [journalList, setJournalList] = useState<Journal[]>(order.journal || []);
  const [materialList, setMaterialList] = useState(order.materials)
  const [orderPhotos,setPhotos] = useState(photos) 
  const [sewing_price, setSewingPrice] = useState(order.sewing_price);
  const [cutting_price, setCuttingPrice] = useState(order.cutting_price);
  const [buttons, setButtons] = useState(order.buttons);
  const [quantity, setQuantity] = useState(order.quantity);

  const handleUpdatePriceQuantity = (quantity:number,buttons:number,sewing_price:number,cutting_price:number) => {
    setSewingPrice(sewing_price)
    setQuantity(quantity)
    setButtons(buttons)
    setCuttingPrice(cutting_price)
  }

  const sewingQty = order.journal?.reduce((sum, i) => i.type === "sewing" ? sum + i.quantity : sum, 0) || 0
  const cuttingQty = order.journal?.reduce((sum, i) => i.type === "cutting" ? sum + i.quantity : sum, 0) || 0
  const buttonsQty = order.journal?.reduce((sum, i) => i.type === "buttons" ? sum + i.quantity : sum, 0) || 0

  let status = ""
  let color: "yellow" | "destructive" | "green"

  if (sewingQty < order.quantity || cuttingQty < order.quantity || buttonsQty < order.buttons) {
    status = "В работе";
    color = "yellow";
  } else if (sewingQty > order.quantity || cuttingQty > order.quantity || buttonsQty > order.buttons) {
    status = "Перевыполнено";
    color = "destructive";
  } else {
    status = "Завершено";
    color = "green";
  }
  
  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>

      {open && createPortal(
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
              <button
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === "staff"
                    ? "border-b-4 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab("staff")}
              >
                Исполнители
              </button>
              <button
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === "journal"
                    ? "border-b-4 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab("journal")}
              >
                Журнал Работ
              </button>
            </div>

            {activeTab === "info" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4 bg-gray-50">
                    <Label className="text-xs text-muted-foreground">Заказ №</Label>
                    <div className="flex gap-2 items-center">
                      <p className="text-base font-medium mt-1">
                        {order.order_number} 
                      </p>
                      <Badge className={`${statusColors[order.status]} border`}>
                          {statusLabels[order.status]}
                      </Badge>
                    </div>  
                  </div>
                 <div className="rounded-lg border p-4 bg-gray-50">
                    <Label className="text-xs text-muted-foreground">Срок исполнения</Label>
                    <div className="flex gap-2 items-center">
                      <p className="text-base font-medium mt-1">
                        {order.deadline ? order.deadline.toString() : "Не указан"} 
                      </p>
                    </div>  
                  </div>
                </div>

                <div className="rounded-lg border p-4 bg-gray-50">
                  <Label className="text-xs text-muted-foreground">Изделие</Label>
                  <p className="text-base font-medium mt-1">
                    {order.template.name}
                  </p>
                  {order.template.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {order.template.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4">
                    <Label className="text-xs text-muted-foreground">Заказчик</Label>
                    <p className="font-medium mt-1">{order.customer.name}</p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <Label className="text-xs text-muted-foreground">Размер</Label>
                    <p className="font-medium mt-1">{order.size}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-blue-50 border border-blue-100 p-4">
                    <Label className="text-xs text-blue-600">Кол-во изделий</Label>
                    <p className="text-xl font-semibold mt-1">
                      {quantity}
                    </p>
                  </div>

                  <div className="rounded-lg bg-blue-50 border border-blue-100 p-4">
                    <Label className="text-xs text-blue-600">Кнопки</Label>
                    <p className="text-xl font-semibold mt-1">
                      {buttons}
                    </p>
                  </div>
      
                </div>

                 <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-blue-50 border border-blue-100 p-4">
                    <Label className="text-xs text-blue-600">Изготовлено изделий (пошив/покрой)</Label>
                    <p className="text-xl font-semibold mt-1">
                          <Badge variant={sewingQty > quantity ? "destructive" : sewingQty == quantity ? "green" : "yellow"}>{sewingQty}</Badge>/
                          <Badge variant={cuttingQty > quantity ? "destructive" : cuttingQty == quantity ? "green" : "yellow"}>{cuttingQty}</Badge>
                    </p>
                  </div>

                  <div className="rounded-lg bg-blue-50 border border-blue-100 p-4">
                    <Label className="text-xs text-blue-600">Изготовлено кнопок</Label>
                    <p className="text-xl font-semibold mt-1">
                     <Badge variant={buttonsQty > buttons ? "destructive" : buttonsQty == buttons ? "green" : "yellow"}>{buttonsQty}</Badge>
                    </p>
                  </div>

                   <div className="rounded-lg bg-blue-50 border border-blue-100 p-4">
                    <Label className="text-xs text-blue-600">Готовность</Label>
                    <p className="text-xl font-semibold mt-1">
                      <Badge variant={color}>{status}</Badge>
                    </p>
                  </div>
      
                </div>


                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-green-50 border border-green-100 p-4">
                    <Label className="text-xs text-green-700">Цена кроя</Label>
                    <p className="text-lg font-semibold mt-1">
                      {cutting_price} ₸
                    </p>
                  </div>

                  <div className="rounded-lg bg-green-50 border border-green-100 p-4">
                    <Label className="text-xs text-green-700">Цена пошива</Label>
                    <p className="text-lg font-semibold mt-1">
                      {sewing_price} ₸
                    </p>
                  </div>
                </div>


                {order.notes && (
                  <div className="rounded-lg border p-4 bg-yellow-50">
                    <Label className="text-xs text-yellow-700">Примечание</Label>
                    <p className="text-sm text-gray-700 mt-1">
                      {order.notes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "materials" && (
              <div className="text-gray-500 text-center">
                  <OrdersViewMaterials onUpdate={handleUpdatePriceQuantity} buttons={buttons} quantity={quantity} cutting_price={cutting_price} sewing_price={sewing_price} order_id={order.id} currentMaterials={materials} materials={materialList} setMaterials={setMaterialList}/>
              </div>
            )}

            {activeTab === "photo" && (
              <div className="text-gray-500 text-center">
                  <OrdersViewPhoto order_id={order.id} setPhotos={setPhotos} photos={orderPhotos}/>
              </div>
            )}

            {activeTab === "journal" && (
              <div className="text-gray-500 text-center">
                  <JournalTable order_id={order.id} orders={Array(order)} staff={staff} journal={journalList || []} setJournal={setJournalList}/>
              </div>
            )}

            {activeTab === "staff" && (
              <div className="text-gray-500 text-center">
                  <OrdersViewStaff order_id={order.id} staffs={order.staffs || []}/>
              </div>
            )}

           
          </div>
        </div>,
        document.body
      )

      }
    </>
  );
}
