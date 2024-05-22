import Cookies from 'js-cookie';
import {strapiConfig} from "../config/strapiConfig";

export const useStrapiToken = () => {
    const getToken = (): string | null => {
        const token = Cookies.get(`${strapiConfig.cookieName ?? 'strapi_jwt'}`)
        return token === null || token === "null" ?   null:token;
    }
    const setToken = (token: string | null) => {
        Cookies.set(`${strapiConfig.cookieName ?? 'strapi_jwt'}`, token)
    }
    return {
        getToken,
        setToken
    }
}
