
$(document).ready(function() {

    var $container = $('#trains-list');
    var $block = $('<div>');

    Http.get({
        cacheOut: 'trains',
        url: '/world.aspx',
        data: Http.params,
        callback: function(r) {

            if (defined(r.error)) {
                alerter(r.error, app_lang.error, [{
                        name: app_lang.close
                    }
                ]);
                return false;
            }

            $.each(r, function(k, v) {

                var $title = '#' + v.TrainNumber + ' ' + v.TrainName + '<br>';
                $title = $title.concat(convertDate(v.Departure) + ' - ' + convertDate(v.Arrival));
                $block.append($('<div>', {
                    class: 'train-row-title padding7',
                    html: $title
                }));
                var $blockBody = $('<div>', {
                    class: 'train-row-body'
                });
                $blockBody.append('<br>');
                $.each(v.WagonOptions, function(key, place) {
                    $blockBody.append($('<div>', {
                        class: 'train-row-item train-icon align-right'
                    }).html($('<input>', {
                        type: 'button',
                        class: 'input-view seat-count',
                        value: place.Name + ' ' + place.Price + ' ' + app_lang.ccy
                    }).data({
                        trainname: $title,
                        name: 'railfindplaces',
                        date: dateFormat(v.SearchDate),
                        fromstationid: v.FromStationID,
                        tostationid: v.ToStationID,
                        trainno: v.TrainNumber,
                        wagon: place.ID,
                        wagonclassid: place.ID,
                        wagonrankid: place.RankID
                    })));
                });
                $blockBody.append('<br>');
                $block.append($blockBody);
            });
            $('.load-container').show();
        }
    });
    $container.append('<br>');
    $container.append($block);


    $(document).on('click', '.seat-count', function() {
        var params = $(this).data();
        Http.loc({
            skip: true,
            url: '/count-dialog',
            callback: function(r) {
                alerter(r, app_lang.please_select_count, [
                    {
                        name: app_lang.find_places,
                        callback: function() {
                            $.each($('#place-finder').find('select'), function(k, item) {
                                params[$(item).attr('name')] = $(item).find('option:selected').val();
                            });
                            Http.get({
                                cacheIn: 'seats',
                                url: '/world.aspx',
                                data: params,
                                callback: function(r) {
                                    if (defined(r.error)) {
                                        alerter(r.error, app_lang.error);
                                    } else {

                                        Http.loc({
                                            url: '/seats',
                                            data: params,
                                            callback: function(data) {
                                                $('.middle-content').html(data);
                                            }
                                        });
                                    }
                                }
                            })
                        }
                    },
                    {
                        name: app_lang.close
                    }
                ]);
            }
        });
    });
});