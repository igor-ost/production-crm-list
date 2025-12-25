"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Orders } from "../orders/orders-table";
import CustomersOrdersTable from "./customers-orders-modal";


export default function CustomersViewModal({
  children,
  orders,
}: {
  children: React.ReactNode;
  orders: Orders[];
}) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders">("orders");

  
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
                  activeTab === "orders"
                    ? "border-b-4 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab("orders")}
              >
                Заказы
              </button>
            </div>

            {activeTab === "orders" && (
              <div>
                <CustomersOrdersTable orders={orders}/>
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
