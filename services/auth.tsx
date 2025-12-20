import axios from "axios";
import ApiRouter from "./constants";
import { axiosInstance } from "./instance";

export const login = async (request:{login:string;password:string}): Promise<{token:string}> => {
    try {
        const { data } = await axiosInstance.post(ApiRouter.LOGIN, request);
        return data as {token:string};
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
        throw new Error(
            error.response?.data?.message || "Ошибка авторизации"
        );
        }

        throw new Error("Неизвестная ошибка");
    }
}



export const profile = async (): Promise<any> => {
    try {
        const { data } = await axiosInstance.get(ApiRouter.PROFILE);
        return data as any;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
        throw new Error(
            error.response?.data?.message || "Ошибка авторизации"
        );
        }

        throw new Error("Неизвестная ошибка");
    }
}
