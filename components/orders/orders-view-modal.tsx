"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Orders, statusColors, statusLabels } from "./orders-table";
import { MaterialsTableProps } from "../materials/materials-table";
import OrdersViewMaterials from "./orders-view-materials";
import { createPortal } from "react-dom";
import { Badge } from "../ui/badge";
import { JournalTable } from "../journal/journal-table";
import { Staff } from "../staff/staff-table";
import OrdersViewPhoto, { Photos } from "./orders-view-photo";


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
  const [activeTab, setActiveTab] = useState<"info" | "materials" | "photo" | "journal">("info");

  const [orderPhotos,setPhotos] = useState(photos) 
  
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
                      {order.quantity}
                    </p>
                  </div>

                  <div className="rounded-lg bg-blue-50 border border-blue-100 p-4">
                    <Label className="text-xs text-blue-600">Пуговицы</Label>
                    <p className="text-xl font-semibold mt-1">
                      {order.buttons}
                    </p>
                  </div>
                </div>


                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-green-50 border border-green-100 p-4">
                    <Label className="text-xs text-green-700">Цена кроя</Label>
                    <p className="text-lg font-semibold mt-1">
                      {order.cutting_price} ₸
                    </p>
                  </div>

                  <div className="rounded-lg bg-green-50 border border-green-100 p-4">
                    <Label className="text-xs text-green-700">Цена пошива</Label>
                    <p className="text-lg font-semibold mt-1">
                      {order.sewing_price} ₸
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
                  <OrdersViewMaterials currentMaterials={materials} materials={order?.materials}/>
              </div>
            )}

            {activeTab === "photo" && (
              <div className="text-gray-500 text-center">
                  <OrdersViewPhoto order_id={order.id} setPhotos={setPhotos} photos={orderPhotos}/>
              </div>
            )}

            {activeTab === "journal" && (
              <div className="text-gray-500 text-center">
                  <JournalTable order_id={order.id} orders={Array(order)} staff={staff} journal={order?.journal || []}/>
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
