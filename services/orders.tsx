
import { Orders } from "@/components/orders/orders-table";
import ApiRouter from "./constants";
import { axiosInstance, axiosInstanceServer } from "./instance";
import axios from "axios";
import { redirect } from "next/navigation";

export async function getList(token: string | undefined) {
  try {
    const { data } = await axiosInstanceServer.get(ApiRouter.ORDERS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      redirect("/");
    }

    throw error;
  }
}

export const findById = async (id:string): Promise<Orders> => {
    const { data } = await axiosInstance.get(ApiRouter.ORDERS + "/" + id);
    return data as Orders;
}

export const create = async (req:{template_id: string;customer_id: string;size:string;status:  "new" | "in-progress" | "completed";sewing_price: number;cutting_price: number;buttons: number;quantity: number;notes: string}): Promise<Orders> => {
    const { data } = await axiosInstance.post(ApiRouter.ORDERS,req);
    return data as Orders;
}


export const update = async (id:string,req:{size: string, status: string, sewing_price: number, cutting_price: number, buttons: number, quantity: number, notes: string}): Promise<Orders> => {
    const { data } = await axiosInstance.patch(ApiRouter.ORDERS + "/" + id,req);
    return data as Orders;
}

export const remove = async (id:string): Promise<{status:string}> => {
    const { data } = await axiosInstance.delete(ApiRouter.ORDERS + "/" +id);
    return data as {status:string};
}
