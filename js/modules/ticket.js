
$(document).ready(function() {

    var $container = $('#ticket');
    var data = pushObject(Http.params, {
        loginname: getLocalData('loginname'),
        password: getLocalData('password')
    })
    $container.append($('<img>', {
        class: 'width100',
        src: Http.remote + '/ticket.aspx?' + $.param(data)
    }));
});