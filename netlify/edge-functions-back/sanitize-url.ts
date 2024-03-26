import { Context } from 'https://edge.netlify.com'

// This edge function is used to remove trailing slashes in the URL and to convert to it lowercase the URL of pre-rendered pages. 
// This is a necessary workaround so Netlify does not make an internal redirect without changing the client's
// browser URL to the good one (it messes up our SEO and Analytics)
// Without this edge function for example /Vakantie/Zoeken/ will return content when it should redirect browser to /vakantie/zoeken

export default async function handler(request: Request, context: Context) {
  console.log('Sanitizing URL is running');
  const url = new URL(request.url)
  let urlSanitized = false;
  // Skip for root, or if we're already proxying the request
  if (url.pathname === '/' || request.headers.get('x-nf-subrequest')) {
    return
  }

  // Redirect to remove the trailing slash
  for (const suffix of ['/', '.htm', '.html']) {
    if (url.pathname.endsWith(suffix)) {
      url.pathname = url.pathname.slice(0, -suffix.length)
      urlSanitized = true
    }
  }

  //Url to lower case
  if (/[A-Z]/.test(url.pathname)) {
    url.pathname = url.pathname.toLocaleLowerCase()
    urlSanitized = true
  }

  // Change underscore to dash
  if (/_/.test(url.pathname)) {
    url.pathname = url.pathname.replace(/_/g, '-')
    urlSanitized = true
  }

  // Change space to dash
  if (/%20| /.test(url.pathname)) {
    url.pathname = url.pathname.replace(/%20| /g, '-')
    urlSanitized = true
  }

  if (urlSanitized) {
    return Response.redirect(url, 301)
  }

  return
}