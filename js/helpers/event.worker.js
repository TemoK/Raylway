
/* worker */

$(document).ready(function() {
    
    return false;
    
    var $loadBreak = false;
    var bgworker = function () {

        if ($loadBreak === true) {
            return setTimeout(arguments.callee, globalParams.eventRefresh * 1000);
        }

        $loadBreak = true;

        http.post({
            bg: true,
            url: '/Token',
            data: {
                users: globalParams.usersOn
            },
            callback: function(result) {

                $loadBreak = false;

                if (defined(result.online)) {
                    var $cnt = $(globalParams.middleContainer);
                    $.each(result.online, function(k, status) {
                        if (status == 1) {
                            $cnt.find('.user-' + k).removeClass('offline').addClass('online');
                        } else if (status == 0) {
                            $cnt.find('.user-' + k).removeClass('online').addClass('offline');
                        }
                    });
                }
                if (defined(result.events)) {
                    $.each(result.events, function(selector, value) {
                        $('#' + selector).html(value)
                    });
                    
                    statusBarNotify(result.events.notification, result.events.message);
                }
            }
        });
        return setTimeout(arguments.callee, globalParams.eventRefresh * 1000);
    }();
});