import { InvoiceList } from "@/components/materials/materials-table";
import ApiRouter from "./constants";
import { axiosInstance, axiosInstanceServer } from "./instance";

export const getList = async (token:string | undefined): Promise<{id:string;name:string;color:string;type:string,unit:string}[]> => {
    const { data } = await axiosInstanceServer.get(ApiRouter.FABRICS,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    return data as {id:string;name:string;color:string;type:string,unit:string}[];
}

export const create = async (req:{name:string;color:string;type:string,unit:string}): Promise<{id:string;name:string;color:string;type:string,unit:string}> => {
    const { data } = await axiosInstance.post(ApiRouter.FABRICS,req);
    return data as {id:string;name:string;color:string;type:string,unit:string};
}


export const update = async (id:string,req:{name?:string;color?:string;type?:string,unit?:string,qty?:number,price?:number}): Promise<{id:string;name:string;color:string;type:string,unit:string}> => {
    const { data } = await axiosInstance.patch(ApiRouter.FABRICS + "/" + id,req);
    return data as {id:string;name:string;color:string;type:string,unit:string};
}

export const remove = async (id:string): Promise<{status:string}> => {
    const { data } = await axiosInstance.delete(ApiRouter.FABRICS + "/" +id);
    return data as {status:string};
}
export const createInvoice = async (req: {material_id:string;qty:number;dateArrived:Date}): Promise<InvoiceList> => {
    const { data } = await axiosInstance.post(ApiRouter.FABRICS_INVOICE,req);
    return data as InvoiceList;
}

export const removeInvoice = async (id:string): Promise<{status:string}> => {
    const { data } = await axiosInstance.delete(ApiRouter.FABRICS_INVOICE + "/" + id);
    return data as {status:string};
}

export const updateInvoce = async (id:string,req:{qty?:number,price?:number}): Promise<{id:string;color:string;type:string,unit:string}> => {
    const { data } = await axiosInstance.patch(ApiRouter.FABRICS_INVOICE + "/" + id,req);
    return data as {id:string;color:string;type:string,unit:string};
}
