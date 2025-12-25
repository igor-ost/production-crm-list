
import ApiRouter from "./constants";
import { axiosInstance, axiosInstanceServer } from "./instance";
import { TemplateItems } from "@/components/templates/templates-add-items-modal";

export const getList = async (token:string | undefined): Promise<{id:string;material_id: string;order_id : string;material_type: string;qty: number;}[]> => {
    const { data } = await axiosInstanceServer.get(ApiRouter.ORDER_MATERIALS,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    return data as {id:string;material_id: string;order_id : string;material_type: string;qty: number;}[];
}

export const create = async (id:string,req:TemplateItems[]): Promise<{status:boolean}> => {
    const { data } = await axiosInstance.post(ApiRouter.ORDER_MATERIALS + "/" + id,req);
    return data as {status:boolean};
}


export const update = async (id:string,req:{material_id: string;order_id : string;material_type: string;qty: number;}): Promise<{id:string;material_id: string;order_id : string;material_type: string;qty: number;}> => {
    const { data } = await axiosInstance.patch(ApiRouter.ORDER_MATERIALS + "/" + id,req);
    return data as {id:string;material_id: string;order_id : string;material_type: string;qty: number;};
}

export const remove = async (id:string): Promise<{status:string}> => {
    const { data } = await axiosInstance.delete(ApiRouter.ORDER_MATERIALS + "/" +id);
    return data as {status:string};
}
