export class RestfulUtil {

    /**
     * @see portal/session/login.service.ts
     */
    static jsonToQueryString(json: any) {
        return '?' +
            Object.keys(json).map(function (key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
            }).join('&');
    }

    static parseQueryString(querystring: any) {
        if (!querystring) { return undefined; }
        // remove any preceding url and split
        querystring = querystring.substring(querystring.indexOf('?') + 1).split('&');
        var params = {}, pair, d = decodeURIComponent;
        // march and parse
        for (var i = querystring.length - 1; i >= 0; i--) {
            pair = querystring[i].split('=');
            params[d(pair[0])] = d(pair[1] || '');
        }

        return params;
    }

    /**
     * API Address는 REStful API 호출을 위한 구분 주소 context
     * @see tools/env/config.json, tools/utils/template_local.ts
     */
    static getAPIAddress() {
        // gulp build --config-env=prod (또는 --env-config=prod)
        // 빌드시에 dev 또는 prod인지에 따라서 context적용이 틀려진다. 
        let config = JSON.parse('<%= ENV_CONFIG %>');
        if (config && config.ENV) {
            if (config.ENV === 'DEV') {
                return A3_CONFIG.DEV.API_CONTEXT;
            }
            else if (config.ENV === 'PROD') {
                return A3_CONFIG.PROD.API_CONTEXT;
            }
            else {
                return '/';
            }
        } else {
            return '/';
        }
    }

    /**
     * App Base는 물리적인 파일이 위치한 경로
     * @see index.html의 <base href="<%= APP_BASE %>"> 설정과 같다
     */
    static getAppBase() {
        let config = JSON.parse('<%= ENV_CONFIG %>');
        if (config && config.ENV) {
            if (config.ENV === 'DEV') {
                return A3_CONFIG.DEV.APP_BASE;
            }
            else if (config.ENV === 'PROD') {
                return A3_CONFIG.PROD.APP_BASE;
            }
            else {
                return '/';
            }
        } else {
            return '/';
        }
    }

    /**
     * not refresh browser and then add url
     * ex) uri is /login or /2324
     */
    static notRefreshAndAddUri(uri: string, isPushState: boolean = true) {
        // not refresh url and set query string
        // @see http://stackoverflow.com/questions/10970078/modifying-a-query-string-without-reloading-the-page

        // const appBase = "<%= APP_BASE %>".replace(/\/$/, '');
        const appBase = this.getAppBase().replace(/\/$/, '');
        // console.log('> restful.util appBase "' + appBase+ '"');
        let newUrl = `${window.location.protocol}//${window.location.host}${appBase}${uri}`;
        if (history.pushState && isPushState) {
            window.history.pushState({ path: newUrl }, '', newUrl);
        }
        return newUrl;
    }

}
