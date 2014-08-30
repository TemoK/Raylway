
$(document).ready(function() {

    $('.return-button').show();

    Http.get({
        url: '/world.aspx',
        data: {
            name: 'getorders',
            loginname: getLocalData('loginname'),
            password: getLocalData('password')
        },
        callback: function(r) {

            if (defined(r.error)) {
                alerter(r.error, app_lang.error);
                return false;
            }
            $.each(r, function(key, item) {
                
                if (item.OrganizationName == 'Railway') {
                
                    var $block = $('<div>');

                    $block.append($('<div>', {
                        class: 'train-row-title padding7',
                        html: item.PerformanceName
                    }));
                    var $blockBody = $('<div>', {
                        class: 'train-row-body  padding10'
                    });

                    var $div, $row;

                    $div = $('<div>');
                    $div.append($('<div>', {text: app_lang.order + ': ' + item.ID}));
                    $div.append($('<div>', {text: item.AuditoriumName}));
                    $div.append($('<div>', {text: app_lang.departure + ': ' + convertDate(item.PerformanceDate)}));
                    $div.append($('<div>', {text: app_lang.tickers + ': ' + item.TiketIDs.length}));
                    $div.append($('<div>', {
                        html: app_lang.status + ': ' + (item.Status == 6 ?
                                '<span class="green">' + app_lang.payment_confirmed + '</span>' :
                                '<span class="red">' + app_lang.payment_canceled + '</span>')
                    }));

                    $row = $('<div>', {class: 'row'});
                    $row.append($('<div>', {
                        class: 'col align-left',
                        html: $div
                    }));
                    $div = $('<div>', {
                        class: 'align-right',
                        html: (item.Status == 6 ? $('<input>', {
                            type: 'button',
                            class: 'input-view ticket-view input-touch-blue font-normal',
                            value: app_lang.view,
                            'data-order': item.ID
                        }) : '')
                    });
                    $row.append($('<div>', {
                        class: 'col align-right',
                        html: $div
                    }));
                    $blockBody.append($('<div>', {
                        class: 'table-div',
                        html: $row
                    }));
                    $block.append($blockBody);
                    if (item.Status == 6) {
                        $('.tickets-accepted').append($block);
                    } else {
                        $('.tickets-refused').append($block);
                    }
                }
            });
        }
    });

});
