/**
 * Proxy Config for ACubed front server -> backend tomcat server
 *
 * You can set another proxy url
 * ex) gulp serve.dev --proxy=http://123.4.56:8080/
 * by ysyun
 */
export function getProxyMiddleware(proxy, api) {
    // console.log('> Proxy Server Context:', api);
    const proxyMiddleware = function (req: any, res: any, next: any) {
        req.url = req.originalUrl;
        if (req.url.indexOf(`${api}service`) != -1 || req.url.indexOf(`${api}oauth`) != -1) {
            // if (req.url.indexOf(`portal/service`) != -1 || req.url.indexOf(`portal/oauth`) != -1) {
            console.log('> proxy req:', req.url);
            proxy.web(req, res);
        } else {
            next();
        }
    };
    return proxyMiddleware;
}
