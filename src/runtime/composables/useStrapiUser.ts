import type {StrapiUser} from '../types'

import  {MutableRefObject} from "react";
import {StrapiAdminUser} from "../types";
import {strapiConfig} from "../config/strapiConfig";
import Cookies from "js-cookie";

export const useStrapiUser = <T = StrapiUser>() => {

    let user: MutableRefObject<StrapiUser|StrapiAdminUser|null> = {current:null}

    const getUser=async ()=>{
        return user.current??getLoggedUser()
    }

    const  setCurrentUser=(newUser: MutableRefObject<StrapiUser|StrapiAdminUser>)=>{

        if(!newUser) return
        // Convert user object to JSON string for storing in cookie
        const userJson = JSON.stringify(newUser.current);
        // Set cookie for 90 days
        Cookies.set(strapiConfig.loggedUserKey, userJson, { expires:90, path: '', secure: true });

       user = newUser
    }

    const getLoggedUser=(): StrapiUser|StrapiAdminUser | null=> {
        const userJson = Cookies.get(strapiConfig.loggedUserKey);
        if (userJson) {
            return JSON.parse(userJson) as StrapiUser|StrapiAdminUser;
        }
        return null;
    }


    return {user,getUser,setCurrentUser}
}
