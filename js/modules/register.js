
$(function() {

    initSelectbox();

    $('#register').submit(function() {

        var bDate = $('.select-year option:selected').val() + '-' + 
                $('.select-month option:selected').val() + '-' + 
                $('.select-day option:selected').val();
        $(this).append($('<input>', {
            name: 'birthdate',
            type: 'hidden',
            value: bDate
        }));

        var data = $(this).serialize();

        http.post({
            url: '/world.aspx',
            data: data,
            callback: function(result) {

                if (defined(result.Error)) {
                    alerter(result.Error, app_lang.error);
                } else if (defined(result.success) && defined(result.success.tpl)) {

                    http.loc({
                        url: '/' + result.success.tpl + '',
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