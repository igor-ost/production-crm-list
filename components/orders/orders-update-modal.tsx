"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Api } from "@/services/api-clients";
import SelectCustomers from "../ui/select-customers";
import { Customers } from "../customers/customers-table";
import SelectTemplates from "../ui/select-templates";
import { Templates } from "../templates/templates-table";

type Status = "new" | "in-progress" | "completed";

interface Props {
  children: React.ReactNode;
  id: string;
  size: string;
  status: Status;
  sewing_price: number;
  customer:string;
  cutting_price: number;
  buttons: number;
  quantity: number;
  notes: string;
  deadline: string;
  template_id: string;
  templates: Templates[]
  customerList: Customers[]
  onSubmit: (
    id: string,
    size: string,
    status: Status,
    sewing_price: number,
    cutting_price: number,
    buttons: number,
    quantity: number,
    notes: string,
    deadline: string,
    customer:Customers,
    templates:Templates
  ) => void;
}

export default function OrdersUpdateModal({
  children,
  id,
  size,
  status,
  sewing_price,
  cutting_price,
  customer,
  buttons,
  quantity,
  notes,
  deadline,
  template_id,
  customerList,
  templates,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(false);
  const [newsize, setSize] = useState(size);
  const [newstatus, setStatus] = useState<Status>(status);
  const [newsewing_price, setSewingPrice] = useState<number>(sewing_price);
  const [newcutting_price, setCuttingPrice] = useState<number>(cutting_price);
  const [newbuttons, setButtons] = useState(buttons);
  const [newquantity, setQuantity] = useState(quantity);
  const [newnotes, setNotes] = useState(notes);
  const [newdeadline, setDeadline] = useState(deadline);
  const [newcustomer, setCustomer] = useState(customer);
  const [newtemplate_id, setTemplate] = useState(template_id);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [templatesList,setTemplatesList] = useState(templates)
  const [customersList,setCustomersList] = useState(customerList)

  const createCustomer = (name:string,bin:string,id:string) => {
    const updated = {
      name:name,
      bin:bin,
      id:id
    }
    setCustomersList((prev) => [...prev, updated]);
  }

  const createTemplate = (id:string,name:string,description:string,cuttingPrice:number,sewingPrice:number,buttonsPrice:number) => {
    const updated = {
      id:id,
      name:name,
      description:description,
      cuttingPrice,
      sewingPrice,
      buttonsPrice,
      materials: []
    }
    setTemplatesList((prev) => [...prev, updated]);
  }


  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      const sewing = Number(newsewing_price);
      const cutting = Number(newcutting_price);
      const response = await Api.orders.update(id, {
        size: newsize,
        sewing_price: sewing,
        cutting_price: cutting,
        buttons: newbuttons,
        quantity: newquantity,
        status: newstatus,
        notes: newnotes,
        deadline: newdeadline,
        customer_id: newcustomer,
        template_id: newtemplate_id
      });

      if (response?.id) {
        onSubmit(
          id,
          newsize,
          newstatus,
          newsewing_price,
          newcutting_price,
          newbuttons,
          newquantity,
          newnotes,
          newdeadline,
          response.customer,
          response.template
        );
        setOpen(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>

      {open && createPortal(
        <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/50 overflow-auto p-4">
          <div className="bg-white w-full max-w-4xl h-full md:h-auto rounded-lg shadow-lg relative p-6 animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>

            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`px-6 py-3 font-medium transition-colors ${1 === 1
                    ? "border-b-4 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-blue-500"
                  }`}
              >
                Основная информация
              </button>
            </div>


            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label>Срок исполнения</Label>
                <Input
                  type="date"
                  placeholder="Введите срок исполнения"
                  value={newdeadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="p-3 text-lg"
                />
              </div>

              <div className="grid gap-2">
                <Label>Заказчик</Label>
                <SelectCustomers onCreate={createCustomer} value={newcustomer} onValueChange={setCustomer} customers={customersList} />
                {customersList.find((c) => c.id === newcustomer)?.bin && (
                  <p className="text-sm text-gray-500">
                    БИН: {customersList.find((c) => c.id === newcustomer)?.bin}
                  </p>
                )}  
              </div>

              <div className="grid gap-2">
                <Label>Изделие</Label>
                <SelectTemplates onCreate={createTemplate} value={newtemplate_id} onValueChange={setTemplate} templates={templatesList} />
                <p className="text-sm text-gray-500">
                  {templates.find((t) => t.id === newtemplate_id)?.description}
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Размер</Label>
                <Input
                  placeholder="Введите размер"
                  value={newsize}
                  onChange={(e) => setSize(e.target.value)}
                  className="p-3 text-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-md bg-green-50 hidden">
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
                  <Label>Кол-во (кнопок-бочек)</Label>
                  <Input
                    type="number"
                    value={newbuttons}
                    onChange={(e) => setButtons(Number(e.target.value))}
                    className="p-3 text-lg bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-md bg-green-50 hidden">
                <div>
                  <Label>Цена кроя</Label>
                  <Input
                    type="number"
                    value={newcutting_price}
                    onChange={(e) => setCuttingPrice(Number(e.target.value))}
                    className="p-3 text-lg bg-white"
                  />
                </div>
                <div>
                  <Label>Цена пошива</Label>
                  <Input
                    type="number"
                    value={newsewing_price}
                    onChange={(e) => setSewingPrice(Number(e.target.value))}
                    className="p-3 text-lg bg-white"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Статус</Label>
                <Select value={newstatus} onValueChange={(v: "new" | "in-progress" | "completed") => setStatus(v)}>
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
                  value={newnotes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="p-3 text-lg min-h-[120px]"
                />
              </div>

              {error && <p className="text-red-600 font-bold">{error}</p>}
            </div>




            {/* Footer */}
            <div className="mt-6 flex justify-end gap-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Отмена
              </Button>
              <Button disabled={isLoading} onClick={handleSubmit}>
                {!isLoading ? "Обновить" : "Обновление..."}
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
