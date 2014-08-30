
$(document).ready(function() {

    $('.lang-switch').click(function() {

        $l = $(this).attr('href');
        if ($l == 'ka_GE') {
            setLocalData({
                languageCode: '01',
                apiLanguage: '4',
                language: $l
            });
        } else {
            setLocalData({
                languageCode: '02',
                apiLanguage: '3',
                language: $l
            });
        }
        app_lang = language[$l];


        Http.loc({
            skip: true,
            url: '/login',
            callback: function(data) {
                target_content('body', data);
            }
        });
        return false;
    });

    $('#authentify').submit(function() {

        var data = serializeObj($(this));
        Http.get({
            url: '/world.aspx',
            data: data,
            callback: function(result) {

                if (defined(result.error)) {

                    alerter(result.error, app_lang.error);

                } else {
                    setLocalData(data);
                    Http.loc({
                        skip: true,
                        url: '/main',
                        callback: function(result) {
                            target_content('body', result);
                        }
                    });
                }
            }
        });
        return false;
    });
});