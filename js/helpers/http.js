
/* Override standart jQuery methods */

var Http = {
    remote: 'https://biletebi.ge',
    local: './views',
    params: {},
    cache: {},
    handle: function(r, options) {

        if ($.type(r) != 'object' && $.type(r) != 'array') {
            return initLanguage(r);
        }

        if (defined(options.cacheIn) && !defined(r.error)) {
            Http.cache[options.cacheIn] = r;
        }
        return r;
    },
    wait: function(options, action) {

        if (defined(options.bg) && options.bg === true) {
            return false;
        }

        if (options.type == 'GET' || options.type == 'POST') {
            if (action == 'set') {
                $('body').append($('<div>', {
                    class: 'request-wait-bg table-div',
                    html: $('<div>', {
                        class: 'row',
                        html: $('<div>', {
                            class: 'col',
                            html: $('<div>', {
                                class: 'request-wait-block',
                                text: app_lang.please_wait
                            })
                        })
                    })
                }));
            } else if (action == 'remove') {
                $('.request-wait-bg').remove();
            }
        }
    },
    get: function(options) {
        options.type = 'GET';
        options.data['format'] = 2;
        options.data['LanguageID'] = getLocalData('apiLanguage');
        this.request(options, false);
    },
    post: function(options) {
        options.type = 'POST';
        options.data['format'] = 2;
        options.data['LanguageID'] = getLocalData('apiLanguage');
        this.request(options, false);
    },
    loc: function(options) {

        options.domain = this.local;
        if (options.url == 'back') {
            var backData = historyLogger.back();
            options.url = backData.url;
            options.data = backData.data;
        } else if (!defined(options.skip) && options.url.length > 0) {
            historyLogger.set(options.url, defined(options.data) ? options.data : {});
        }

        options.url = options.url + '.html';
        this.request(options, true);
    },
    request: function(options, cache) {

        if (!defined(options.url)) {
            return {error: 'Invalid request URL'};
        }
        if (!defined(options.domain)) {
            options.domain = this.remote;
        }

        if (!defined(options.data)) {
            options.data = {};
        }

        if (defined(options.cacheOut) && defined(Http.cache[options.cacheOut])) {

            if (defined(options.callback)) {
                options.callback(Http.cache[options.cacheOut]);
            }
            return false;
        }

        this.params = options.data;
        
        Http.wait(options, 'set');
        $.ajax({
            url: options.domain + options.url,
            data: options.data,
            type: options.type,
            timeout: 40000,
            success: function(response) {

                Http.wait(options, 'remove');

                if (defined(options.callback)) {
                    response = Http.handle(response, options);
                    options.callback(response);
                }
            },
            error: function(e) {

                Http.wait(options, 'remove');

                if (e.statusText == 'timeout') {
                    alerter(app_lang.inet_connection_error, app_lang.error,
                            [{
                                    name: app_lang.close,
                                }
                            ]);
                } else {
                    alerter(app_lang.DEFAULT_SYSTEM_ERROR, app_lang.error,
                            [{
                                    name: app_lang.close
                                }
                            ]);
                }
            }
        });
    }
};

