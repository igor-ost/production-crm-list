
import { Orders } from "@/components/orders/orders-table";
import ApiRouter from "./constants";
import { axiosInstance, axiosInstanceServer } from "./instance";
export const getList = async (token:string | undefined): Promise<Orders[]> => {
    const { data } = await axiosInstanceServer.get(ApiRouter.ORDERS,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    return data as Orders[];
}

export const create = async (req:{template_id: string;customer_id: string;size:string;status:  "new" | "in-progress" | "completed";sewing_price: number;cutting_price: number;buttons: number;quantity: number;notes: string}): Promise<Orders> => {
    const { data } = await axiosInstance.post(ApiRouter.ORDERS,req);
    return data as Orders;
}


export const update = async (id:string,req:{status:string;notes:string}): Promise<Orders> => {
    const { data } = await axiosInstance.patch(ApiRouter.ORDERS + "/" + id,req);
    return data as Orders;
}

export const remove = async (id:string): Promise<{status:string}> => {
    const { data } = await axiosInstance.delete(ApiRouter.ORDERS + "/" +id);
    return data as {status:string};
}
