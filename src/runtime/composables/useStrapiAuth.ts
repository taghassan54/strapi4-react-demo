import {useStrapiUrl} from "./useStrapiUrl";
import {useStrapiToken} from "./useStrapiToken";
import {useStrapiClient} from "./useStrapiClient";
import {useStrapiUser} from "./useStrapiUser";
import {
    StrapiAdminAuthenticationData, StrapiAdminAuthenticationResponse, StrapiAdminUser,
    StrapiAuthenticationData,
    StrapiAuthenticationResponse,
    StrapiAuthProvider,
    StrapiChangePasswordData,
    StrapiEmailConfirmationData,
    StrapiForgotPasswordData,
    StrapiRegistrationData,
    StrapiResetPasswordData,
    StrapiUser
} from "../types";
import React from "react";

export interface AuthOptions {
    populate?: string | string[]
    fields?: string | string[]
}

export const useStrapiAuth = () => {
    const {userUrl, adminUrl} = useStrapiUrl()
    let {getToken, setToken} = useStrapiToken()
    const {user, setCurrentUser, getUser} = useStrapiUser()
    const client = useStrapiClient()

    const fetchUser = async (): Promise<React.MutableRefObject<StrapiUser>> => {
        const token = getToken()
        if (token) {
            try {
                const apiUser: StrapiUser = await client('users/me', {method: "get"})
                setCurrentUser({current: apiUser})
                return {current:apiUser}
            } catch (e) {
                console.log('====================================');
                console.log(e);
                console.log('====================================');
                setToken(null)
            }
        }

        return user
    }

    const fetchAdmin = async (): Promise<React.MutableRefObject<StrapiUser>> => {
        const token = getToken()
        if (token) {
            try {
                const apiUser: StrapiAdminUser = await client('admin/users/me', {method: "get"}, true)
                console.log('====================================');
                console.log("apiUser admin", apiUser);
                console.log('====================================');
                setCurrentUser({current: apiUser})
                return {current:apiUser}
            } catch (e) {
                console.log('====================================');
                console.log(e);
                console.log('====================================');
                setToken(null)
            }
        }

        return user
    }

    /**
     * Authenticate user & retrieve his JWT
     *
     * @param  {StrapiAuthenticationData} data - User authentication form: `identifier`, `password`
     * @param  {string} data.identifier - The email or username of the user
     * @param  {string} data.password - The password of the user
     * @returns Promise<StrapiAuthenticationResponse>
     */
    const login = async (data: StrapiAuthenticationData): Promise<StrapiAuthenticationResponse> => {
        setToken(null)

        const {jwt}: StrapiAuthenticationResponse = await client('auth/local', {method: 'post', data: data})

        setToken(jwt)

        const user = await fetchUser()

        return {
            user,
            jwt
        }
    }

    /**
     * Authenticate admin user & retrieve his JWT
     *
     * @param  {StrapiAuthenticationData} data - User authentication form: `identifier`, `password`
     * @param  {string} data.identifier - The email or username of the user
     * @param  {string} data.password - The password of the user
     * @returns Promise<StrapiAuthenticationResponse>
     */
    const adminLogin = async (data: StrapiAdminAuthenticationData): Promise<StrapiAdminAuthenticationResponse> => {
        setToken(null)

        const response: StrapiAdminAuthenticationResponse = await client('admin/login', {
            method: 'post',
            data: data
        }, true)

        setToken(response.data.token)

        const user = await fetchAdmin()

        return {
            data:{
                user,
                token: response.data.token
            }
        }
    }


    /**
     * Logout by removing authentication token
     */
    const logout = (): void => {
        setToken(null)
        setCurrentUser({current: null})
    }

    /**
     * Register a new user & retrieve JWT
     *
     * @param  {StrapiRegistrationData} data - New user registration form: `username`, `email`, `password`
     * @param  {string} data.username - Username of the new user
     * @param  {string} data.email - Email of the new user
     * @param  {string} data.password - Password of the new user
     * @returns Promise<StrapiAuthenticationResponse>
     */
    const register = async (data: StrapiRegistrationData): Promise<StrapiAuthenticationResponse> => {
        setToken(null)

        const {jwt} = await client('auth/local/register', {method: 'POST', data: data})

        setToken(jwt)

        const user = await fetchUser()

        return {
            user,
            jwt
        }
    }


    /**
     * Email a user in order to reset his password
     *
     * @param  {StrapiForgotPasswordData} data - Forgot password form: `email`
     * @param  {string} data.email - Email of the user who forgot his password
     * @returns Promise<void>
     */
    const forgotPassword = async (data: StrapiForgotPasswordData): Promise<void> => {
        setToken(null)

        await client('auth/forgot-password', {method: 'POST', data: data})
    }

    /**
     * Reset the user password
     *
     * @param  {StrapiResetPasswordData} data - Reset password form: `code`, `password`, `passwordConfirmation`
     * @param  {string} data.code - Code received by email after calling the `forgotPassword` method
     * @param  {string} data.password - New password of the user
     * @param  {string} data.passwordConfirmation - Confirmation of the new password of the user
     * @returns Promise<StrapiAuthenticationResponse>
     */
    const resetPassword = async (data: StrapiResetPasswordData): Promise<StrapiAuthenticationResponse> => {
        setToken(null)

        const {jwt}: StrapiAuthenticationResponse = await client('auth/reset-password', {method: 'POST', data: data})

        setToken(jwt)

        const user = await fetchUser()

        return {
            user,
            jwt
        }
    }

    /**
     * Change the user password
     *
     * @param  {StrapiChangePasswordData} data - Change password form: `currentPassword`, `password`, `passwordConfirmation`
     * @param  {string} data.currentPassword - Current password of the user
     * @param  {string} data.password - New password of the user
     * @param  {string} data.passwordConfirmation - Confirmation of the new password of the user
     * @returns Promise<void>
     */
    const changePassword = async (data: StrapiChangePasswordData): Promise<void> => {
        await client('auth/change-password', {method: 'POST', data: data})
    }

    /**
     * Send programmatically an email to a user in order to confirm his account
     *
     * @param  {StrapiEmailConfirmationData} data - Email confirmation form: `email`
     * @param  {string} data.email - Email of the user who want to be confirmed
     * @returns Promise<void>
     */
    const sendEmailConfirmation = async (data: StrapiEmailConfirmationData): Promise<void> => {
        await client('auth/send-email-confirmation', {method: 'POST', data: data})
    }

    /**
     * Get the correct URL to authenticate with provider
     *
     * @param  {StrapiAuthProvider} provider - Provider name
     * @returns string
     */
    const getProviderAuthenticationUrl = (provider: StrapiAuthProvider): string => {
        return `${userUrl()}/connect/${provider}`
    }

    /**
     * Authenticate user with the access_token
     *
     * @param  {StrapiAuthProvider} provider - Provider name
     * @param  {string} access_token - Access token returned by Strapi
     * @returns Promise<StrapiAuthenticationResponse>
     */
    const authenticateProvider = async (provider: StrapiAuthProvider, access_token: string): Promise<StrapiAuthenticationResponse> => {
        setToken(null)

        const {jwt}: StrapiAuthenticationResponse = await client(`auth/${provider}/callback`, {
            method: 'GET',
            params: {access_token}
        })

        setToken(jwt)

        const user = await fetchUser()

        return {
            user,
            jwt
        }
    }

    const renewToken = async () => {
        const token = getToken()
        const response = await client('admin/renew-token', {
            method: 'post', data: {
                token: token
            }
        }, true)

        console.log('====================================');
        console.log(response);
        console.log('====================================');
    }

    return {
        setToken,
        setCurrentUser,
        fetchUser,
        fetchAdmin,
        login,
        logout,
        register,
        forgotPassword,
        resetPassword,
        changePassword,
        sendEmailConfirmation,
        getProviderAuthenticationUrl,
        authenticateProvider,
        adminLogin,
        renewToken
    }
}