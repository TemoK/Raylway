
var app_lang;
var userData = null;

$(document).ready(function() {

    app_lang = language['ka_GE'];

    Http.loc({
        skip: true,
        url: '/login',
        callback: function(data) {
            $('body').html(data);
            $('.load-container').show();
        }
    });
});
