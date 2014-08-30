
$(document).ready(function() {

    $('.return-button').show();
    var $container = $('#ticket');
    var authData = {
        loginname: getLocalData('loginname'),
        password: getLocalData('password')
    };
    var data = pushObject(authData, {
        name: 'getorders',
        pt: Http.params.order
    });

    Http.get({
        url: '/world.aspx',
        data: data,
        callback: function(r) {

            if (defined(r.error)) {
                alerter(r.error, app_lang.error);
                return false;
            }

            $.each(r, function(k, item) {
                $.each(item.TiketIDs, function(key, ticketId) {
                    $container.append($('<div>', {
                        class: 'train-row-title padding7',
                        html: app_lang.ticket + ' #' + (key + 1)
                    }));
                    var p = pushObject(authData, {
                        tid: ticketId,
                        type: 'bodymob'
                    });
                    $container.append($('<div>', {
                        class: 'train-row-body',
                        html: $('<img>', {
                            class: 'width100',
                            src: Http.remote + '/ticket.aspx?' + $.param(p)
                        })
                    }));
                });
            });
        }
    });
});