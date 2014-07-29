
$(document).ready(function() {

    var containerLastWidth = 0;
    var frameWidth = $('.payment-frame').width();
    var frame = $('.payment-frame');

    function catchResize() {

        var frame = $('.payment-frame');
        if (frame.length == 0) {
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
        }, 500);
    }
    catchResize();

    frame.bind({
        load: function() {
            Http.wait({type: 'GET'}, 'remove');
        }
    });

    var returnUrl = $(location).attr('href').replace('index', 'return');

    $('#hidAmount').val(Http.params.hidAmount);
    $('#hidOrderID').val('BIL-' + Http.params.PurchaseThreadID + '-5');
    $('#hidLanguage').val(hidLanguageCode);
    $('#hidReturnURL').val(returnUrl);
    Http.wait({type: 'GET'}, 'set');
    $('#kartu').submit();
});