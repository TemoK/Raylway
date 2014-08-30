
$(document).ready(function() {

    var frameFound = true;

    window.addEventListener("message", function() {

        frameFound = false;

        Http.get({
            skip: true,
            url: '/world.aspx',
            data: {
                name: 'getorderstatus',
                pt: Http.params.PurchaseThreadID
            },
            callback: function(r) {
                if (defined(r.statusId) && r.statusId == 6) {
                    Http.loc({
                        url: '/orders',
                        callback: function(data) {
                            target_content('.middle-content', data);
                        }
                    });
                    return false;
                }
                window.location.reload();
            }
        });
    }, false);

    $('.return-button').show();

    var containerLastWidth = 0;
    var frameWidth = $('.payment-frame').width();
    var frame = $('.payment-frame');

    function catchResize() {

        if (!frameFound) {
            return false;
        }

        var cssProperties = ['-moz-transform', 'webkit-transform', '-o-transform', '-ms-transform', 'transform'];
        var containerWidth = $('.ui-layout-pane-center').width();

        if (containerLastWidth != containerWidth) {
            containerLastWidth = containerWidth;
            var scaleW = (new String(containerWidth / frameWidth).substr(0, 4));
            $.each(cssProperties, function(k, v) {
                $('#payment-intervale').css({
                    'margin-left': containerWidth - frameWidth,
                });
                frame.css(v, 'scale(' + scaleW + ', ' + scaleW + ')');
            });
        }
        setTimeout(function() {
            catchResize();
        }, 1000);
    }
    catchResize();

    frame.bind({
        load: function() {
            Http.wait({type: 'GET'}, 'remove');
        }
    });

    Http.get({
        url: '/world.aspx',
        data: {
            name: 'preparecartupayment',
            pt: Http.params.PurchaseThreadID,
            amount: Http.params.hidAmount
        },
        callback: function(r) {
            
            if (defined(r.error)){
                alerter(r.error, app_lang.error);
                return false;
            }else if(!defined(r.amount)){
                alerter(app_lang.unknown, app_lang.error);
                return false;
            }
            
            Http.wait({type: 'GET'}, 'set');
            
            $('#hidAmount').val(r.amount);
            $('#hidOrderID').val('BIL-' + Http.params.pt + '-5');
            $('#hidLanguage').val(hidLanguageCode);
            $('#hidReturnURL').val('https://biletebi.ge/mobcartu.aspx');
            $('#kartu').submit();
        }
    });
});