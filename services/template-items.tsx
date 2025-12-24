import { Templates } from "@/components/templates/templates-table";
import ApiRouter from "./constants";
import { axiosInstance, axiosInstanceServer } from "./instance";

export const getList = async (token:string | undefined): Promise<{id:string;material_id: string;template_id : string;material_type: string;qty: number;}[]> => {
    const { data } = await axiosInstanceServer.get(ApiRouter.TEMPLATE_ITEMS,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    return data as {id:string;material_id: string;template_id : string;material_type: string;qty: number;}[];
}

export const create = async (req:{material_id: string;template_id : string;material_type: string;qty: number;}): Promise<{id:string;material_id: string;template_id : string;material_type: string;qty: number;template:Templates}> => {
    const { data } = await axiosInstance.post(ApiRouter.TEMPLATE_ITEMS,req);
    return data as {id:string;material_id: string;template_id : string;material_type: string;qty: number;template:Templates};
}


export const update = async (id:string,req:{material_id: string;template_id : string;material_type: string;qty: number;}): Promise<{id:string;material_id: string;template_id : string;material_type: string;qty: number;}> => {
    const { data } = await axiosInstance.patch(ApiRouter.TEMPLATE_ITEMS + "/" + id,req);
    return data as {id:string;material_id: string;template_id : string;material_type: string;qty: number;};
}

export const remove = async (id:string): Promise<{status:string}> => {
    const { data } = await axiosInstance.delete(ApiRouter.TEMPLATE_ITEMS + "/" +id);
    return data as {status:string};
}
