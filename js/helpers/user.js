

function getSmallCard(data) {

    if (!defined(data.direction)) {
        data.direction = 'center';
    }

    var $s = '<table class="user-card"><tr>';
    var $img = new String();
    var $dsc = new String();

    $img += '<td class="td-width48">';
    $img += '<div class="user-smallcard-img"><div class="' + (data.sex === 'F' ? 'female' : 'male') + '">';
    $img += '<div class="avatar">';

    if (defined(data.avatar) && data.avatar) {

        $img += '<img src="' + data.avatar + '" alt=""/>';
    }

    $img += '</div>';

    if (defined(data.status) && data.status >= 0) {

        var currentStatus = (data.status > 0 ? 'online' : 'offline');
        $img += '<div class="' + currentStatus + ' user-' + data.id + '">';

        if (data.id > 0) {
            $img += '<a class="block-link-normal" data-to="' + data.id + '" href="/user/card"></s>';
        }

        $img += '</div>';
    }

    $img += '</div></div></td>';

    if (defined(data.top)) {
        $dsc += '<div class="title">' + data.top + ' <span>' + (defined(data.date) ? data.date : '') + '</span></div>';
    }

    if (defined(data.descr)) {
        $dsc += '<div class="text">' + data.descr + '</div>';
    }

    if (defined(data.message)) {
        $dsc += '<div>' + data.message + '</div>';
    }

    if (defined(data.url)) {
        $dsc = '<a class="' + data.url.class + '" data-to="' + data.url.dataId + '" href="' + data.url.href + '">' + $dsc + '</a>';
    }
    var $td_class = 'card-descr';

    if (defined(data.message)) {
        $td_class = 'td-message';
    }

    if (data.direction === 'left') {

        $s += $img;
        $s += '<td class="' + $td_class + '"><div class="' + data.direction + '">' + $dsc + '</div></td>';
        $s += '<td class="td-width60"></td>';

    } else if (data.direction === 'right') {

        $s += '<td class="td-width60"></td>';
        $s += '<td class="' + $td_class + '"><div class="' + data.direction + '">' + $dsc + '</div></td>';
        $s += $img;

    } else {
        $s += $img;
        $s += '<td class="' + $td_class + '"><div class="left">' + $dsc + '</div></td>';
        $s += '<td class="td-width6"></td>';
    }

    $s += '</tr></table>';

    return $s;
}
