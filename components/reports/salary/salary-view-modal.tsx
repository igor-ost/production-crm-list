"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Staff } from "@/components/staff/staff-table";
import { createPortal } from "react-dom";
import { workTypeColor, workTypeLabel } from "@/components/journal/journal-table";
import { Badge } from "@/components/ui/badge";



export default function SalaryViewModal({
  children,
  staff,
  month
}: {
  children: React.ReactNode;
  staff: Staff;
  month:string
}) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"info">("info");

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
            </div>

            {activeTab === "info" && (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">#</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Номер заказа</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Цена пошива</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Цена кроя</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Тип</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Количество</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Дата</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {staff.journal?.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-700">{index + 1}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{item.order.order_number}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{item.order.sewing_price}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{item.order.cutting_price}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          <Badge className={workTypeColor(item.type)}>
                            {workTypeLabel(item.type)}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">{item.quantity}</td>
                         <td className="px-4 py-2 text-sm text-gray-700">{item.createdAt && (item.createdAt).toString() }</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
