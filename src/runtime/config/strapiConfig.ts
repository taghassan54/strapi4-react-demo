export const strapiConfig={
    url: process.env.STRAPI_URL || 'http://localhost:1337',
    prefix: 'api',
    admin: 'admin',
    version: 'v4',
    cookie: {},
    auth: {},
    cookieName: 'strapi_jwt',
    loggedUserKey: 'loggedUser',
    devtools: false
}