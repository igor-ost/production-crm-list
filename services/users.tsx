import ApiRouter from "./constants";
import { axiosInstance, axiosInstanceServer } from "./instance";

export const getList = async (token:string | undefined): Promise<{id:string;login:string;role:string}[]> => {
    const { data } = await axiosInstanceServer.get(ApiRouter.USERS,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    return data as {id:string;login:string;role:string}[];
}

export const create = async (req:{login:string;role:string;password:string}): Promise<{login:string;role:string;password:string;id:string}> => {
    const { data } = await axiosInstance.post(ApiRouter.USERS,req);
    return data as {login:string;role:string;password:string;id:string};
}


export const update = async (id:string,req:{login:string;role:string}): Promise<{login:string;role:string;password:string;id:string}> => {
    const { data } = await axiosInstance.patch(ApiRouter.USERS + "/" + id,req);
    return data as {login:string;role:string;password:string,id:string};
}

export const remove = async (id:string): Promise<{status:string}> => {
    const { data } = await axiosInstance.delete(ApiRouter.USERS + "/" +id);
    return data as {status:string};
}
