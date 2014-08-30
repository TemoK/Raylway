
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

function serializeObj(selector) {
    var data = {};
    $(selector).find('input, select').each(function(k, elem) {
        var $elem = $(elem);
        if (defined($elem.attr('name'))) {
            var $value = new String();
            if ($elem.attr('type') == 'checkbox') {
                if ($elem.is(':checked')) {
                    $value = $elem.val();
                } else {
                    $value = '';
                }
            } else {
                $value = $elem.val();
            }
            data[$elem.attr('name')] = $value;
        }
    });
    return data;
}

function setLocalData(data) {
    if (defined(window.localStorage)) {
        for (var i in data) {
            window.localStorage.setItem(i, data[i]);
        }
    }
}

function getLocalData(key) {
    if (!key) {
        return window.localStorage;
    }
    if (defined(window.localStorage[key])) {
        return window.localStorage[key];
    }
    return null;
}
function removeLocalData(key) {
    if (defined(window.localStorage[key])) {
        return window.localStorage.removeItem(key);
    }
}

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
    var e = {};
    $.each(obj, function(key, value) {
        e[key] = value;
    });
    $.each(elements, function(key, value) {
        e[key] = value;
    });
    return e;
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

function correctContainer() {
    $('.ui-layout-container').css({
        height: $(this).height() - 41,
        marginTop: 41
    });
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
            },
        }
    });
    //myLayout.bindButton('#openWestPane', 'open', 'west');
    //myLayout.bindButton('#openWestPane', 'close', 'east');
    //myLayout.bindButton('#closeWestPane', 'close', 'west');
    myLayout.bindButton('#openEastPane', 'open', 'east');
    //myLayout.bindButton('#openEastPane', 'close', 'west');
    myLayout.bindButton('#closeEastPane', 'close', 'east');

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
                name: app_lang.ok,
                class: 'gray-button-link'
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
            class: defined(val['class']) ? val['class'] : 'link-button-blue',
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

function target_content(selector, content, callback) {
    $(selector).html(content);
    $('.load-container').show();
    if (typeof callback == 'function'){
        callback();
    }
}

function convertDate(str) {

    var s = str.split('T');
    var date = s[0].split('-');
    var time = s[1].split(':');

    return (date[2] + " " + app_lang.months[parseInt(date[1]) - 1] + " " + time[0] + ':' + time[1]);
}

function dateFormat(str) {
    var s = str.split('T');
    return s[0];
}

function outDate(str) {
    
    var s = str.split('T');
    var date = s[0].split('-');
    var time = s[1].split(':');

    return (date[0] + "-" + date[1] + "-"+ date[2] + "-" + time[0] + '-' + time[1]);

}

function nowDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
    var day = date.getDay() < 10 ? '0' + date.getDay() : date.getDay();
    var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return year + '-' + month + '-' + day + '-' + hour + '-' + min;
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
    var options = {
        url: $url,
        data: $query,
        callback: function(data) {
            if (defined($elem.data('target'))) {
                target_content($elem.data('target'), data);
                return false;
            }
            target_content('.middle-content', data);
        }
    };
    if (skip) {
        options.skip = true;
    }
    Http.loc(options);
    return false;
});

$(document).on('click', '.passager-info', function() {
    var $elem = $(this);
    Http.loc({
        skip: true,
        url: '/passenger-dialog',
        callback: function(r) {
            alerter(r, app_lang.passenger_info, [
                {
                    name: app_lang.save,
                    callback: function() {
                        $('#passenger-info-form').find('input').each(function(k, item) {
                            $elem.data($(item).attr('name'), $(item).val());
                        });
                    }
                },
                {
                    name: app_lang.close,
                    class: 'gray-button-link'
                }
            ]);
            $.each($elem.data(), function(k, v) {
                $('#passenger-info-form').find('input[name="' + k + '"]').val(v);
            });
        }
    });
});



$(document).on('click', '.seat-count', function() {
    var params = $(this).data();
    Http.loc({
        skip: true,
        url: '/count-dialog',
        callback: function(r) {
            alerter(r, app_lang.please_select_count, [
                {
                    name: app_lang.find_places,
                    callback: function() {
                        $.each($('#place-finder').find('select'), function(k, item) {
                            params[$(item).attr('name')] = $(item).find('option:selected').val();
                        });
                        Http.get({
                            cacheIn: 'seats',
                            url: '/world.aspx',
                            data: params,
                            callback: function(r) {
                                if (defined(r.error)) {
                                    alerter(r.error, app_lang.error);
                                } else {

                                    Http.loc({
                                        url: '/seats',
                                        data: params,
                                        callback: function(data) {
                                            target_content('.middle-content', data);
                                        }
                                    });
                                }
                            }
                        });
                    }
                },
                {
                    name: app_lang.close,
                    class: 'gray-button-link'
                }
            ]);
        }
    });
});

$(document).on('click', '.ticket-view', function() {
    var $elem = $(this);
    console.log($elem.data('order'));
    Http.loc({
        url: '/ticket',
        data: {
            order: $elem.data('order')
        },
        callback: function(r) {
            target_content('.middle-content', r);
        }
    });
});

$(document).on('click', '.menu-item', function() {
    $('#closeEastPane').trigger('click');
    $('#closeWestPane').trigger('click');
});

var app_lang;
var hidLanguageCode = getLocalData('languageCode') === null ? '01' : getLocalData('languageCode');
var appLanguage = getLocalData('language') === null ? 'ka_GE' : getLocalData('language');
var apiLanguage = getLocalData('apiLanguage') === null ? '4' : getLocalData('apiLanguage');
