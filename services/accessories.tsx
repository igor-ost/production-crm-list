import { InvoiceList } from "@/components/materials/materials-table";
import ApiRouter from "./constants";
import { axiosInstance, axiosInstanceServer } from "./instance";

export const getList = async (token:string | undefined): Promise<{id:string;name:string,unit:string}[]> => {
    const { data } = await axiosInstanceServer.get(ApiRouter.ACCESSORIES,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    return data as {id:string;name:string,unit:string}[];
}

export const create = async (req:{name:string,unit:string}): Promise<{id:string;name:string,unit:string}> => {
    const { data } = await axiosInstance.post(ApiRouter.ACCESSORIES,req);
    return data as {id:string;name:string;unit:string};
}


export const update = async (id:string,req:{name?:string,unit?:string,qty?:number,price?:number}): Promise<{id:string;name:string,unit:string}> => {
    const { data } = await axiosInstance.patch(ApiRouter.ACCESSORIES + "/" + id,req);
    return data as {id:string;name:string,unit:string};
}

export const remove = async (id:string): Promise<{status:string}> => {
    const { data } = await axiosInstance.delete(ApiRouter.ACCESSORIES + "/" +id);
    return data as {status:string};
}
export const createInvoice = async (req: {material_id:string;qty:number;dateArrived:Date}): Promise<InvoiceList> => {
    const { data } = await axiosInstance.post(ApiRouter.ACCESSORIES_INVOICE,req);
    return data as InvoiceList;
}

export const removeInvoice = async (id:string): Promise<{status:string}> => {
    const { data } = await axiosInstance.delete(ApiRouter.ACCESSORIES_INVOICE + "/" + id);
    return data as {status:string};
}
export const updateInvoce = async (id:string,req:{qty?:number,price?:number}): Promise<{id:string;color:string;type:string,unit:string}> => {
    const { data } = await axiosInstance.patch(ApiRouter.ACCESSORIES_INVOICE + "/" + id,req);
    return data as {id:string;color:string;type:string,unit:string};
}
