
var device = {};
var pagingLimit = 10;
var documentSize = {
    width: 0,
    height: 0,
    old: -1
};
var glb = {
    raylway: {
        tmp: null,
    }
};

var sessionId = function() {

    if (defined(localStorage.sessionId)) {
        return localStorage.getItem('sessionId');
    }

    var ses = 'a' + Math.random().toString(36).substr(2, 20);
    localStorage.setItem('sessionId', ses);
    return ses;
}();
var historyLogger = {
    log: {},
    index: 0,
    set: function(url, data) {

        this.index++;
        this.log[this.index] = {
            'url': url,
            'data': data
        };
    },
    get: function(index) {
        return this.log[index];
    },
    back: function() {

        if (this.index <= 1) {
            return this.log[this.index];
        }

        var u = this.log[this.index - 1];
        delete this.log[this.index];
        this.index--;
        return u;
    }
}

function amount(int, ccy) {
    return (new String(int / 100) + (!ccy ? '' : app_lang.GEL));
}

function pushObject(obj, elements) {
    $.each(elements, function(key, value) {
        obj[key] = value;
    });
    return obj;
}

function initLanguage(str) {

    var expr = new RegExp('{@(.+?)}', 'g');
    var match = str.match(expr);
    for (i in match) {
        var key = match[i].replace(expr, "$1");
        str = str.replace(match[i], app_lang[key]);
    }

    return str;
}

function renderDateOption(name, start, end) {

    var selectbox = $('select[name="' + name + '"]');
    for (i = start; i <= end; i++) {
        var value = (i < 10 ? '0' + i : i);
        selectbox.append($('<option value="' + value + '">' + value + '</option>'));
    }
}

function initSelectbox() {

    $('select').select2({
        placeholder: '',
        minimumResultsForSearch: -1
    });
    $('.select2-focusser').prop("readonly", true);
}

function initLayout() {

    var myLayout = $('#container').layout({
        defaults: {
            fxName: "slideOffscreen",
            spacing_closed: 0,
            spacing_open: 0,
            initClosed: true,
            onclose: function() {
            },
            onopen: function() {
            }
        }
    });
    //myLayout.bindButton('#openWestPane', 'open', 'west');
    //myLayout.bindButton('#openWestPane', 'close', 'east');
    //myLayout.bindButton('#closeWestPane', 'close', 'west');
    //myLayout.bindButton('#openEastPane', 'open', 'east');
    //myLayout.bindButton('#openEastPane', 'close', 'west');
    //myLayout.bindButton('#closeEastPane', 'close', 'east');
}

function defined(v) {
    return !(typeof v === 'undefined');
}

function isJson(data) {

    if (!data)
        return false;
    if (data.length < 2)
        return false;
    var start = data.substr(0, 1);
    var end = data.substr((data.length - 1), 1);
    if ((start == '{' && end == '}') || (start == '[' && end == ']')) {
        return true;
    }
    return false;
}

function alerter(msg, title, button) {

    $('.alerter').remove();
    var block = $('<div class="alerter">');
    block.css({
        //     width: documentSize.width,
        //     height: documentSize.height,
    });
    var html = $('<div class="content">').bind({
        click: function() {
            return false;
        }
    });
    html.append('<div class="title">' + title + '</div>');
    html.append('<div class="message"><div class="inner">' + msg + '</div></div>');
    if (!defined(button)) {
        button = [{
                name: app_lang.ok
            }];
    }

    var cont = $('<div>', {class: "buttons"});
    var inner = $('<div>', {class: "inner"});
    var btn = $('<div>', {class: "table-div"});
    var row = $('<div>', {class: 'row'});
    var count = 0;

    $.each(button, function(key, val) {
        if (count > 0) {
            row.append($('<div>', {html: '&nbsp;'}));
        }
        count++;
        var col = $('<div>', {class: 'col'});
        var b = $('<button>', {
            class: 'link-button-blue',
            text: val.name
        }).bind({
            click: function() {

                if (defined(val.callback)) {
                    val.callback();
                }
                block.remove();
                return false;
            }
        });
        col.append(b);
        row.append(col);
    });
    btn.append(row);
    inner.append(btn);
    cont.append(inner);
    html.append(cont);
    block.append($('<div>', {
        class: 'table-div alert-table',
        html: $('<div>', {
            class: 'row',
            html: $('<div>', {
                class: 'col',
                html: html
            })
        })
    }));
    block.bind({
        click: function() {
            block.remove();
        }
    });
    $('body').append(block);
}

function target_content(selector, content) {
    $(selector).html(content);
    $('.load-container').show();
}

function convertDate(str) {

    var s = str.split('T');
    var date = s[0].split('-');
    var time = s[1].split(':');
    
    return (date[2] + " " + app_lang.months[parseInt(date[1])-1] + " " + time[0] + ':' + time[1]);
}

function dateFormat(str) {
    var s = str.split('T');
    return s[0];
}

////////////////

$(document).on("click", '.error-border', function() {
    $(this).removeClass("error-border");
});
$(document).on("touchstart", '.block-link', function() {
    $(this).addClass("block-link-active");
});
$(document).on("touchend", '.block-link', function() {
    $(this).removeClass("block-link-active");
});
$(document).on("touchstart", 'input[type="submit"]', function() {
    $(this).addClass("input-touch-blue");
});
$(document).on("touchend", 'input[type="submit"]', function() {
    $(this).removeClass("input-touch-blue");
});
$(document).on("touchcacnel", 'input[type="submit"]', function() {
    $(this).removeClass("input-touch-blue");
});

$(document).on("click", '.custom-checkbox', function() {
    if ($(this).find('input').is(':checked')) {
        $(this).css({backgroundPosition: '-30px 0'});
    } else {
        $(this).css({backgroundPosition: '0 0'});
    }
});


$(document).on("click", '.block-link, .block-link-normal, .gray-button-link', function() {

    var $elem = $(this);
    var $url = $elem.attr('href');
    var $query = $elem.data();
    var skip = defined($query.skip);

    Http.loc({
        skip: skip,
        url: $url,
        data: $query,
        callback: function(data) {

            if (defined($elem.data('target'))) {
                target_content($elem.data('target'), data);
                return false;
            }
            target_content('.middle-content', data);
        }
    });
    return false;
});
