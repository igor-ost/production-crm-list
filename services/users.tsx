import axios from "axios";
import ApiRouter from "./constants";
import { axiosInstance, axiosInstanceServer } from "./instance";
import { redirect } from "next/navigation";
import { Staff } from "@/components/staff/staff-table";

export const getList = async (token:string | undefined): Promise<Staff[]> => {
    try{
        const { data } = await axiosInstanceServer.get(ApiRouter.USERS,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return data as Staff[];
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            redirect("/");
        }

        throw error;
    }
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
