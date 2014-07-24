
$(function() {

    initSelectbox();

    $('#register').submit(function() {
        
        $('.d-date').remove();
        var bDate = $('.select-year option:selected').val() + '-' +
                $('.select-month option:selected').val() + '-' +
                $('.select-day option:selected').val();
        $(this).append($('<input>', {
            class: 'd-date',
            name: 'birthdate',
            type: 'hidden',
            value: bDate
        }));

        var data = $(this).serialize();

        Http.get({
            url: '/world.aspx',
            data: data,
            callback: function(r) {

                if (defined(r.error)) {
                    alerter(r.error, app_lang.error);
                    return false;
                }

                userData = r;
                Http.loc({
                    url: '/main',
                    callback: function(r) {
                        target_content('body', r);
                    }
                });
            }
        });

        return false;

    });
});