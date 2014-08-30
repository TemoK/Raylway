$(document).ready(function() {
    
    $('.return-button').hide();
    
    $('#startDate').datepicker({
        minDate: 0,
        dateFormat: 'dd-mm-yy',
        altFormat: 'yy-mm-dd',
        altField: '#actualDate'
    });

    var $from = $('#station-from');
    var $to = $('#station-to');

    Http.get({
        url: '/world.aspx',
        data: {
            name: 'stations'
        },
        callback: function(r) {
            $from.html(null);
            $to.html(null);
            $.each(r, function(k, v) {
                $from.append(new Option(v.Name, v.ID));
                $to.append(new Option(v.Name, v.ID));
            });

            initSelectbox();

            $from.bind({
                change: function() {
                    $('#station-name').val($(this).find('option:selected').text());
                    setLocalData({
                        fromto: $('#station-name').val()
                    });
                }
            });
            $from.trigger('change');
            $('.load-container').show();
        }
    });

    $('#find-trains').submit(function() {
        var $form = $(this);
        var params = serializeObj($form);
        Http.get({
            cacheIn: 'trains',
            url: '/world.aspx',
            data: params,
            callback: function(r) {

                if (defined(r.error)) {
                    alerter(r.error, app_lang.error, [{
                            name: app_lang.close
                        }
                    ]);
                    return false;
                }
                Http.loc({
                    url: '/trains',
                    data: params,
                    callback: function(data) {
                        target_content('.middle-content', data);
                    }
                });
            }
        });

        return false;
    });
});