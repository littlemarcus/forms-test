import { Context } from 'https://edge.netlify.com'

const cookieName = 'lang'
const queryStringName = 'hl'
const defaultLanguage = 'nl'

export default async function handler(request: Request, context: Context) {
    console.log('Multilanguage edge function is running');
    const url = new URL(request.url)

    if (url.pathname === '/') {
        const languageCode = getLanguageCode(url, context)

        url.pathname = `/${languageCode}`
        return Response.redirect(url, 301)
    }

    return
}

function getLanguageCode(url: URL, context: Context) {
    let params = url.searchParams
    const queryStringValue = params.get(queryStringName)
    if (queryStringValue) {
        return queryStringValue.toLocaleLowerCase()
    }
    
    const cookieValue = context.cookies.get(cookieName);
    if(cookieValue) {
        return cookieValue.toLocaleLowerCase()
    }

    return defaultLanguage
}