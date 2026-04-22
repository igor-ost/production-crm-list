
import { Orders } from "@/components/orders/orders-table";
import ApiRouter from "./constants";
import { axiosInstance, axiosInstanceServer } from "./instance";
import { TemplateItems } from "@/components/templates/templates-add-items-modal";

export const getList = async (token:string | undefined): Promise<{id:string;material_id: string;order_id : string;material_type: string;qty: string;createdAt:string;updatedAt:string;order:Orders}[]> => {
    const { data } = await axiosInstanceServer.get(ApiRouter.MATERIALS_CONSUPTIONS,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    return data as {id:string;material_id: string;order_id : string;material_type: string;qty: string;createdAt:string;updatedAt:string;order:Orders}[];
}

export const createMany = async (id:string,req:TemplateItems[]): Promise<{status:boolean}> => {
    const { data } = await axiosInstance.post(ApiRouter.MATERIALS_CONSUPTIONS + "/" + id,req);
    return data as {status:boolean};
}

export const create = async (req:{material_id:string;material_type:string;order_id:string;qty:string}): Promise<{id:string;material_id:string;material_type:string;order_id:string;qty:string}> => {
    const { data } = await axiosInstance.post(ApiRouter.MATERIALS_CONSUPTIONS,req);
    return data as {id:string;material_id:string;material_type:string;order_id:string;qty:string};
}


export const remove = async (order_id:string,material_id:string): Promise<{status:string}> => {
    const response = {
        order_id:order_id,
        material_id: material_id
    }
    const { data } = await axiosInstance.post(ApiRouter.MATERIALS_CONSUPTIONS_REMOVE,response);
    return data as {status:string};
}

export const update = async (order_id:string,material_id:string,qty:number): Promise<{status:string}> => {
    const response = {
        order_id:order_id,
        material_id: material_id,
        qty: qty
    }
    const { data } = await axiosInstance.patch(ApiRouter.MATERIALS_CONSUPTIONS_UPDATE,response);
    return data as {status:string};
}
