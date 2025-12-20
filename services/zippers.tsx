import ApiRouter from "./constants";
import { axiosInstance, axiosInstanceServer } from "./instance";

export const getList = async (token:string | undefined): Promise<{id:string;color:string;type:string,unit:string,qty:number,price:number}[]> => {
    const { data } = await axiosInstanceServer.get(ApiRouter.ZIPPERS,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    return data as {id:string;color:string;type:string,unit:string,qty:number,price:number}[];
}

export const create = async (req:{color:string;type:string,unit:string,qty:number,price:number}): Promise<{id:string;color:string;type:string,unit:string,qty:number,price:number}> => {
    const { data } = await axiosInstance.post(ApiRouter.ZIPPERS,req);
    return data as {id:string;color:string;type:string,unit:string,qty:number,price:number};
}


export const update = async (id:string,req:{color:string;type:string,unit:string,qty:number,price:number}): Promise<{id:string;color:string;type:string,unit:string,qty:number,price:number}> => {
    const { data } = await axiosInstance.patch(ApiRouter.ZIPPERS + "/" + id,req);
    return data as {id:string;color:string;type:string,unit:string,qty:number,price:number};
}

export const remove = async (id:string): Promise<{status:string}> => {
    const { data } = await axiosInstance.delete(ApiRouter.ZIPPERS + "/" +id);
    return data as {status:string};
}
