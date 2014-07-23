
var userData = null;

$(document).ready(function() {

    Http.loc({
        skip: true,
        url: '/login',
        callback: function(data) {
            $('body').html(data);
        }
    });
});
