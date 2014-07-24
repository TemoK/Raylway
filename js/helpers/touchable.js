
function isTouchDevice() {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}

function scrollableDiv(selector) {
return false;
    return {
        startPoint: null,
        timeout: 0,
        timer: 150,
        duration: 200,
        flip: 0,
        direction: null,
        elem: selector,
        init: function() {

            var $parent = this;

            this.elem.bind({
                touchmove: function(e) {

                    var event = e.originalEvent;

                    if ($parent.startPoint === null) {
                        $parent.startPoint = event.touches[0].pageY;
                        console.log('Set Start Point ' + $parent.startPoint);
                        return false;
                    }

                    var distance = $parent.startPoint - event.touches[0].pageY;
                    var currentDirection = distance > 0 ? 'up' : 'down';

                    if (($parent.direction === null || currentDirection === $parent.direction) &&
                            Math.abs($parent.flip) < Math.abs(distance)
                            )
                    {
                        $parent.direction = currentDirection;
                        $parent.flip = distance;
                        var $elem = $(this);

                        if ($parent.timeout) {
                            clearTimeout($parent.timeout);
                        }

                        $parent.timeout = setTimeout(function() {
                            $elem.animate({scrollTop: $elem.scrollTop() + $parent.flip},
                            {
                                duration: $parent.duration,
                                start: function() {
                                    console.log('Start animation ' + $parent.flip + ' Direction: ' + $parent.direction);
                                },
                                done: function() {
                                    $parent.startPoint = null;
                                    $parent.flip = 0;
                                    $parent.direction = null;
                                    clearTimeout($parent.timeout);
                                }
                            });
                        }, $parent.timer);
                    }
                }
            });
        }
    }
}


// device APIs are available
//
function touchScroll() {

    if (
            isTouchDevice() &&
            defined(device.platform) &&
            defined(device.version) &&
            device.platform.toLowerCase() == 'android' &&
            device.version.substr(0, 2) == '2.')
    {

        $('.scrollable-div').each(function(k, item) {
            new scrollableDiv($(item)).init();
        });
    }
}