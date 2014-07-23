
initLayout();

Http.loc({
    url: '/default',
    callback: function(data) {
        $('.middle-content').html(data);
    }
});
