import {useStrapiVersion} from "./useStrapiVersion";
import {strapiConfig} from "../config/strapiConfig";

export const useStrapiUrl = () => {

    const userUrl = (): string => {
        const version = useStrapiVersion()
        // return version === 'v3' ? config.strapi.url : `${config.strapi.url}${config.strapi.prefix}`
        return `${strapiConfig.url ?? 'http://localhost:1337'}/${strapiConfig.prefix ?? 'api'}`
    }
    const adminUrl = (): string => {
        const version = useStrapiVersion()
        // return version === 'v3' ? config.strapi.url : `${config.strapi.url}${config.strapi.prefix}`
        return `${strapiConfig.url ?? 'http://localhost:1337'}`
    }
    return {
        userUrl,
        adminUrl
    }
}
