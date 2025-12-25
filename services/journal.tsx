
import { Orders } from "@/components/orders/orders-table";
import ApiRouter from "./constants";
import { axiosInstance, axiosInstanceServer } from "./instance";
import { Journal } from "@/components/journal/journal-table";
export const getList = async (token:string | undefined): Promise<Journal[]> => {
    const { data } = await axiosInstanceServer.get(ApiRouter.JOURNAL,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    return data as Journal[];
}

export const create = async (req:{order_id:string;user_id:string,type:string,quantity:number}): Promise<Journal> => {
    const { data } = await axiosInstance.post(ApiRouter.JOURNAL,req);
    return data as Journal;
}


export const update = async (id:string,req:{quantity:number}): Promise<Journal> => {
    const { data } = await axiosInstance.patch(ApiRouter.JOURNAL + "/" + id,req);
    return data as Journal;
}

export const remove = async (id:string): Promise<{status:string}> => {
    const { data } = await axiosInstance.delete(ApiRouter.JOURNAL + "/" +id);
    return data as {status:string};
}
