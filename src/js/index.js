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
            //initEvents();
        }
    };
    var initEvents = function () {
        $("#main").orangeLayout({
            title: '示例',
            rows: [
                {
                    cols: [
                        {
                            col: 6,
                            title: '示例1',
                            type: 'panel',
                            content: {
                                plugin: 'tab',
                                options: {
                                    tabs: [
                                        {
                                            title: 'tab1',
                                            active: true,
                                            content: {
                                                html: 'tab1'
                                            }
                                        },
                                        {
                                            title: 'tab2',
                                            active: false,
                                            content: {
                                                html: 'tab2'
                                            }
                                        },
                                        {
                                            title: 'tab3',
                                            active: false,
                                            content: {
                                                html: 'tab3'
                                            }
                                        },
                                        {
                                            title: 'tab4',
                                            active: false,
                                            content: {
                                                html: 'tab4'
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            col: 6,
                            title: '示例2',
                            content: {
                                html: 'aaa'
                            }
                        }
                    ]
                }
            ]
        });
    };

})(jQuery, window, document);
