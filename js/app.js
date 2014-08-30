
$(document).ready(function() {

    app_lang = language[appLanguage];
    var url = getLocalData('loginname') !== null ? '/main' : '/login';

    Http.loc({
        skip: true,
        url: url,
        callback: function(data) {
            $('body').html(data);
            $('.load-container').show();
        }
    });
});
