
$(document).ready(function() {

    $('.return-button').show();
    var $container = $('#seat-list');
    var purchaseData = {
        departuredate: outDate(Http.params.departure),
        trainno: Http.params.trainno,
        trainname: Http.params.trainname,
        seatcategory: Http.params.seatcategory
    };

    Http.get({
        cacheOut: 'seats',
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

            $.each(r, function(k, wagon) {

                purchaseData = pushObject(purchaseData, {
                    RequestGuid: wagon.RequestGuid,
                    RequestID: wagon.RequestID,
                    InternetPurchaseGUID: wagon.InternetPurchaseGUID,
                    TrainGUID: wagon.TrainGUID,
                    wagon: wagon.Number,
                });

                $('#wagon-descr').html(app_lang.wagon + ': ' + wagon.Number + ', ' + wagon.RankName);
                $('#train-descr').html($('<div>', {html: Http.params.trainname}));

                var $cont = $('<div>', {class: 'table-div'});
                var number = 0;
                $.each(wagon.Seats, function(key, seat) {
                    var price = (seat.IsChild === true ? wagon.TariffTeen : wagon.TariffAdult);
                    var pInfo = $('<input>', {
                        type: 'button',
                        class: 'input-view passager-info input-touch-blue font-normal',
                        value: app_lang.passenger_info
                    }).data({
                        index: number,
                        firstname: '',
                        lastname: '',
                        pin: '',
                        no: seat.Number,
                        price: amount(price, false),
                        purchaseguid: seat.PurchaseGUID
                    });

                    number++;

                    var $row = $('<div>', {class: 'row'});
                    $row.append($('<div>', {
                        class: 'col',
                        text: app_lang.seat_number + seat.Number
                    }));
                    $row.append($('<div>', {
                        class: 'col',
                        text: app_lang.price + amount(price, true)
                    }));
                    $row.append($('<div>', {
                        class: 'col align-right',
                        html: pInfo
                    }));
                    $cont.append($row);
                });
                $container.append($cont);
                $('.load-container').show();
                return false;
            });
        }});

    $('.checkout-seats').click(function() {

        var errors = null;
        var total_amount = 0;
        var data = {
            name: 'raillockplaces',
            requestid: purchaseData.RequestID,
            requestguid: purchaseData.RequestGuid,
            internetpurchaseidguid: purchaseData.InternetPurchaseGUID,
            trainguid: purchaseData.TrainGUID,
            departuredate: purchaseData.departuredate.replace('T', '-'),
            trainno: purchaseData.trainno,
            wagon: purchaseData.wagon,
            seatcategory: purchaseData.seatcategory,
            trainname: purchaseData.trainname,
            fromto: getLocalData('fromto')
        };
        $('.passager-info').each(function(k, item) {
            var params = $(item).data();
            if (
                    params.firstname.length == 0 ||
                    params.lastname.length == 0 ||
                    params.pin.length == 0
                    ) {
                errors = app_lang.passenger_info_error;
                return false;
            }
            total_amount += parseFloat(params.price);
            data['seatinfos-passenger-' + params.index] = params.firstname + ' ' + params.lastname + ', ' + params.pin;
            data['seatinfos-no-' + params.index] = params.no;
            data['seatinfos-price-' + params.index] = params.price;
            data['seatinfos-purchaseguid-' + params.index] = params.purchaseguid;
        });
        if (errors !== null) {
            alerter(errors, app_lang.error);
            return false;
        }

        data = pushObject(data, {
            departuredate: purchaseData.departuredate,
            trainno: purchaseData.trainno,
            trainname: purchaseData.trainname,
            seatcategory: purchaseData.seatcategory,
            fromto: getLocalData('fromto')
        });
        Http.get({
            url: '/world.aspx',
            data: data,
            callback: function(r) {
                if (defined(r.error)) {
                    alerter(r.error, app_lang.error);
                    return false;
                }

                var paymentData = {
                    PurchaseThreadID: r.PurchaseThreadID,
                    hidAmount: total_amount
                };
                Http.get({
                    url: '/world.aspx',
                    data: {
                        name: 'setorderowner',
                        loginname: getLocalData('loginname'),
                        password: getLocalData('password'),
                        pt: r.PurchaseThreadID,
                        created: nowDate()
                    },
                    callback: function(r) {

                        if (defined(r.error)) {
                            alerter(r.error, app_lang.error);
                            return false;
                        }
                        Http.loc({
                            url: '/payment',
                            data: paymentData,
                            callback: function(res) {
                                target_content('.middle-content', res);
                            }
                        });
                    }
                });
            }
        });
    });
});