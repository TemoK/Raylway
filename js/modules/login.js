
$(function() {

    $('#authentify').submit(function() {

        var data = $(this).serialize();
        Http.get({
            url: '/world.aspx',
            data: data,
            callback: function(result) {

                if (defined(result.error)) {

                    alerter(result.error, app_lang.error);

                } else {
                    userData = result;
                    Http.loc({
                        skip: true,
                        url: '/main',
                        callback: function(result) {
                            $('body').html(result);
                        }
                    });
                }
            }
        });
        return false;
    });
});