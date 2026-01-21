import { Templates } from "@/components/templates/templates-table";
import ApiRouter from "./constants";
import { axiosInstance, axiosInstanceServer } from "./instance";

export const getList = async (token:string | undefined): Promise<Templates[]> => {
    const { data } = await axiosInstanceServer.get(ApiRouter.ORDER_STAFFS,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    return data as Templates[];
}

export const create = async (req:{order_id:string;staff_id:string}): Promise<Templates> => {
    const { data } = await axiosInstance.post(ApiRouter.ORDER_STAFFS,req);
    return data as Templates;
}


export const remove = async (id:string): Promise<{status:string}> => {
    const { data } = await axiosInstance.delete(ApiRouter.ORDER_STAFFS + "/" +id);
    return data as {status:string};
}
