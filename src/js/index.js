/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var token = $.cookie('zhongkexie_token');
    if (token == undefined) {
        window.location.href = '../login.html';
    }
    App.token = token;

    var requestMapping = {
        "/api/index": "index"
    };
    App.requestMapping = $.extend({}, App.requestMapping, requestMapping);

    App.index = {
        page: function (title) {
            App.content.empty();
            App.title(title);
            var content = $('<div id="main"><img style="padding: 10px 10px 10px 10px; width: 100%" height="680" src="cdn/img/welcome.jpg"></div>');
            App.content.append(content);
            initEvents();
        }
    };
    var initEvents = function () {

    };

})(jQuery, window, document);
