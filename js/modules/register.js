
$(function() {

    var $days = $('.select-day');
    for (var i = 1; i <= 31; i++) {
        var d = i < 10 ? '0' + i : i;
        $days.append(new Option(d, d));
    }

    var $months = $('.select-month');
    $.each(app_lang.months, function(k, v) {
        $months.append(new Option(v, (k++ < 10 ? '0' + k : k)));
    });

    var maxYear = (new Date().getFullYear()) - 10;
    var minYear = (new Date().getFullYear()) - 100;
    
    var $years = $('.select-year');
    for (var i = minYear; i <= maxYear; i++) {
        var d = i < 10 ? '0' + i : i;
        $years.append(new Option(d, d));
    }

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

        var data = serializeObj($(this));

        Http.get({
            url: '/world.aspx',
            data: data,
            callback: function(r) {

                if (defined(r.error)) {
                    alerter(r.error, app_lang.error);
                    return false;
                }
                setLocalData({
                    loginname: data.loginname,
                    password: data.password
                });
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