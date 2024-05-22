import {strapiConfig} from "../config/strapiConfig";

export const useStrapiVersion = (): string => {

  return  strapiConfig.version??"v4"
}
