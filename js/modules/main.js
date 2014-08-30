initLayout();

Http.loc({
    url: '/default',
    callback: function(data) {
        target_content('.middle-content', data, function() {
            if (navigator.userAgent.match(/(iPad.*|iPhone.*|iPod.*);.*CPU.*OS 7_\d/i)) {
                $('.header').css('top', 20);
                $('.middle-content').css('padding-top', 20);
                $('.pane-header').css('margin-top', 20);
                $('.ios-7-fix').show();
            }
        });
    }
});
