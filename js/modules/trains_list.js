
$(document).ready(function() {

    $('.return-button').show();

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
                
                var $hiddenTitle = '#' + v.TrainNumber + ' ' + v.TrainName;

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
                        class: 'input-view seat-count input-touch-blue font-normal',
                        value: place.Name + ' ' + place.Price + ' ' + app_lang.ccy
                    }).data({
                        trainname: $hiddenTitle,
                        name: 'railfindplaces',
                        departuredate: outDate(v.Departure),
                        searchdate: outDate(v.SearchDate),
                        departure: v.Departure,
                        seatcategory: place.Name,
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

});