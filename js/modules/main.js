
initLayout();

Http.loc({
    url: '/default',
    callback: function(data) {
        target_content('.middle-content', data);
    }
});
