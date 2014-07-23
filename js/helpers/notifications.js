
function isNotificationSupported() {

    if (!defined(device) || !defined(device.platform)) {
        return false;
    }

    var os = device.platform.toLowerCase();

    if (os != 'android' && os != 'iphone' && os != 'ipad') {
        return false;
    }

    if (os == 'android' && device.version.substr(0, 2) == '2.') {
        return false;
    }

    return true;
}

function statusBarNotify(event, message) {

    if (!isNotificationSupported()) {
//        return false;
    }

    if (globalParams.notification.paused === false) {
        
        globalParams.notification.message = message;
        globalParams.notification.event = event;
        
        return false;
    }

    if (message > 0 && globalParams.notification.message != message) {

        var eventID = 'evt_2557';
        window.plugin.notification.local.cancel(eventID);
        window.plugin.notification.local.add({
            id: eventID,
            title: app_lang.notification.message.title,
            message: message + ' ' + app_lang.notification.message.descr
        });
        globalParams.notification.message = message;

    } else if (event > 0 && globalParams.notification.event != event) {

        var eventID = 'evt_2558';
        window.plugin.notification.local.cancel(eventID);
        window.plugin.notification.local.add({
            id: eventID,
            title: app_lang.notification.event.title,
            message: event + ' ' + app_lang.notification.event.descr
        });
        globalParams.notification.event = event;
    }
}

function clearStatusBar() {

    if (!isNotificationSupported()) {
    //    return false;
    }
    window.plugin.notification.local.cancelAll();
}