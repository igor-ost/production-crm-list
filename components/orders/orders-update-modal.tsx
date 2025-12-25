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

type Status = "new" | "in-progress" | "completed";

interface Props {
  children: React.ReactNode;
  id: string;
  size: string;
  status: Status;
  sewing_price: number;
  cutting_price: number;
  buttons: number;
  quantity: number;
  notes: string;
  onSubmit: (
    id: string,
    size: string,
    status: Status,
    sewing_price: number,
    cutting_price: number,
    buttons: number,
    quantity: number,
    notes: string
  ) => void;
}

export default function OrdersUpdateModal({
  children,
  id,
  size,
  status,
  sewing_price,
  cutting_price,
  buttons,
  quantity,
  notes,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(false);
  const [newsize, setSize] = useState(size);
  const [newstatus, setStatus] = useState<Status>(status);
  const [newsewing_price, setSewingPrice] = useState(sewing_price);
  const [newcutting_price, setCuttingPrice] = useState(cutting_price);
  const [newbuttons, setButtons] = useState(buttons);
  const [newquantity, setQuantity] = useState(quantity);
  const [newnotes, setNotes] = useState(notes);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await Api.orders.update(id, {
        size: newsize,
        sewing_price: newsewing_price,
        cutting_price: newcutting_price,
        buttons: newbuttons,
        quantity: newquantity,
        status: newstatus,
        notes: newnotes,
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
          newnotes
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
                className={`px-6 py-3 font-medium transition-colors ${
                  1 === 1
                    ? "border-b-4 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-blue-500"
                }`}
              >
                Основная информация
              </button>
            </div>


              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label>Размер</Label>
                  <Input
                    placeholder="Введите размер"
                    value={newsize}
                    onChange={(e) => setSize(e.target.value)}
                    className="p-3 text-lg"
                  />
                </div>

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
                    <Label>Кол-во (Пуговицы)</Label>
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
