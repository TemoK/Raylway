
var callbacks = {
    postRequest: function(data) {
        
        var btn = [{name: app_lang.close}];
        
        if (defined(data.success)) {
            alerter(app_lang[data.success.code], app_lang.success, btn);
        } else if (defined(data.error)) {
            alerter(app_lang[data.error.code], app_lang.error, btn);
        } else {
            alerter(app_lang.DEFAULT_SYSTEM_ERROR, app_lang.error, btn);
        }
    },
};