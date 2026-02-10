import { InvoiceList } from "@/components/materials/materials-table";
import ApiRouter from "./constants";
import { axiosInstance, axiosInstanceServer } from "./instance";

export const getList = async (token:string | undefined): Promise<{id:string;color:string;type:string,unit:string}[]> => {
    const { data } = await axiosInstanceServer.get(ApiRouter.ZIPPERS,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    return data as {id:string;color:string;type:string,unit:string}[];
}

export const create = async (req:{color:string;type:string,unit:string}): Promise<{id:string;color:string;type:string,unit:string}> => {
    const { data } = await axiosInstance.post(ApiRouter.ZIPPERS,req);
    return data as {id:string;color:string;type:string,unit:string};
}


export const update = async (id:string,req:{color?:string;type?:string,unit?:string,qty?:number,price?:number}): Promise<{id:string;color:string;type:string,unit:string}> => {
    const { data } = await axiosInstance.patch(ApiRouter.ZIPPERS + "/" + id,req);
    return data as {id:string;color:string;type:string,unit:string};
}

export const remove = async (id:string): Promise<{status:string}> => {
    const { data } = await axiosInstance.delete(ApiRouter.ZIPPERS + "/" +id);
    return data as {status:string};
}
export const createInvoice = async (req: {material_id:string;qty:number;dateArrived:Date}): Promise<InvoiceList> => {
    const { data } = await axiosInstance.post(ApiRouter.ZIPPERS_INVOICE,req);
    return data as InvoiceList;
}

