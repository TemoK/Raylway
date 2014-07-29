
$(document).ready(function() {

    var $container = $('#orders-list');
    var $block = $('<div>');

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

                    $block.append($('<div>', {
                        class: 'train-row-title padding7',
                        html: item.PerformanceName
                    }));
                    var $blockBody = $('<div>', {
                        class: 'train-row-body  padding10'
                    });

                    var $div, $row;

                    $div = $('<div>');
                    $div.append($('<div>', {text: item.AuditoriumName}));
                    $div.append($('<div>', {text: app_lang.departure + ': ' + convertDate(item.PerformanceDate)}));
                    $div.append($('<div>', {text: app_lang.tickers + ': ' + item.TiketIDs.length}));
                    $div.append($('<div>', {text: app_lang.status + ': ' + (item.Status == 6 ? app_lang.payment_confirmed : app_lang.payment_canceled)}));

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
                            value: app_lang.view
                        }).data({
                            order: item.ID
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
                }
            });
            $container.append($block);
        }
    });

    $(document).on('click', '.ticket-view', function() {
        var $elem = $(this);
        Http.loc({
            url: '/ticket',
            data: {
                tid: $elem.data('order'),
                type: 'bodymob'
            },
            callback: function(r) {
                target_content('.middle-content', r);
            }
        });
    });
});
