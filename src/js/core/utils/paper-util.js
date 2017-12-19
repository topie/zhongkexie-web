/**
 * Created by chenguojun on 8/29/16.
 */

(function ($, window, document, undefined) {
    var PaperView = function (element, options) {
        this._options = options;
        this.$element = $(element);
        var id = element.id;
        if (id === undefined || id == '') {
            id = "davdian_paper_view_" + new Date().getTime();
            this.$element.attr("id", id);
        }
        this._elementId = id;
        this.load();
        this.init();
    };
    PaperView.examples = [
        {
            "score": 1,
            "pid": 0,
            "id": 1,
            "title": "1",
            "type": "index",
            "items": [
                {
                    "score": 2,
                    "pid": 1,
                    "id": 2,
                    "title": "12",
                    "type": "index",
                    "items": [
                        {
                            "score": 121,
                            "pid": 2,
                            "id": 6,
                            "title": "121",
                            "type": "index",
                            "items": [
                                {
                                    "score": 1,
                                    "pid": 6,
                                    "id": 7,
                                    "title": "1211",
                                    "type": "index",
                                    "items": [
                                        {
                                            "id": 1,
                                            "itemType": 1,
                                            "items": [
                                                {
                                                    "id": 1,
                                                    "title": "是"
                                                },
                                                {
                                                    "id": 2,
                                                    "title": "否"
                                                }
                                            ],
                                            "score": 1,
                                            "title": "正确吗？",
                                            "type": "item"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "score": 13,
                    "pid": 1,
                    "id": 5,
                    "title": "13",
                    "type": "index",
                    "items": []
                }
            ]
        },
        {
            "score": 12,
            "pid": 0,
            "id": 3,
            "title": "2",
            "type": "index",
            "items": [
                {
                    "score": 122,
                    "pid": 3,
                    "id": 4,
                    "title": "21",
                    "type": "index",
                    "items": []
                }
            ]
        }
    ];
    PaperView.defaults = {
        title: '',
        data: []
    };
    PaperView.prototype = {
        load: function () {
        },
        init: function () {
            var that = this;
            var mainPanel = this.getPanel(this._options.title);
            that.$element.append(mainPanel);
            this.$main = mainPanel;
            if (this._options.data !== undefined && this._options.data.length > 0) {
                $.each(this._options.data, function (i, idx) {
                    if (idx.type == 'index') {
                        var r = that.getRow(idx.title);
                        mainPanel.find('div.panel-body:eq(0)').append(r);
                        that.renderSubRow(that, r, idx.items);
                    }
                });
            }
        },
        renderSubRow: function (that, row, items) {
            if (items != undefined && items.length > 0) {
                $.each(items, function (i, item) {
                    if (item.type == 'index') {
                        var r = that.getRow(item.title);
                        row.find('div.panel-body:eq(0)').append(r);
                        if (item.items != undefined && item.items.length > 0) {
                            that.renderSubRow(that, r, item.items);
                        }
                    } else if (item.type == 'item') {
                        var it = {};
                        it.name = item.id;
                        it.label = item.title;
                        if (item.itemType == 0) {
                            it.type = 'text';
                        } else if (item.itemType == 1) {
                            it.type = 'radioGroup';
                        } else if (item.itemType == 2) {
                            it.type = 'checkboxGroup';
                        }
                        if (item.itemType > 0) {
                            it.items = [];
                            $.each(item.items, function (i, op) {
                                var option = {
                                    'text': op.title,
                                    'value': op.id
                                };
                                it.items.push(option);
                            });
                        }
                        var qi = that.getQi();
                        row.find('div.panel-body:eq(0)').append(qi);
                        qi.find('div[role=qi]').orangeForm({
                            method: "POST",
                            action: "",
                            ajaxSubmit: true,
                            rowEleNum: 1,
                            ajaxSuccess: function () {
                            },
                            showReset: false,
                            showSubmit: false,
                            isValidate: true,
                            buttonsAlign: "center",
                            items: [it]
                        })
                    }
                });
            }
        },
        getPanel: function (title, theme) {
            if (theme === undefined)
                theme = 'default';
            var panelTmpl =
                '<div class="panel panel-' + theme + '" >' +
                '<div style="text-align: center" class="panel-heading">${title_}</div>' +
                '<div class="panel-body"></div>' +
                '</div>';
            return $.tmpl(panelTmpl, {
                "title_": title
            });
        },
        getRow: function (title, theme) {
            if (theme === undefined)
                theme = 'default';
            var rowTmpl = '<div class="row"><div class="col-md-12 col-sm-12">' +
                '<div class="panel panel-' + theme + '" >' +
                '<div style="text-align: center" class="panel-heading">${title_}</div>' +
                '<div class="panel-body"></div>' +
                '</div>' +
                '</div></div>';
            return $.tmpl(rowTmpl, {"title_": title});
        },
        getQi: function () {
            return $('<div class="row"><div role="qi" class="col-md-12 col-sm-12"></div></div>');
        },
        reload: function (options) {
            this.$element.empty();
            this._options = options;
            this.init();
        },
        getJson: function () {
            return this._options;
        },
        getAnswer: function () {
            var answers = [];
            this.$main.find('form').each(
                function () {
                    var answer = {};
                    var ps = $(this).serialize().split('=');
                    if (ps.length == 2) {
                        answer['itemId'] = ps[0];
                        answer['itemValue'] = ps[1];
                        answers.push(answer);
                    }
                }
            );
            return answers;
        }
    };

    /**
     * jquery插件扩展 ===================================================
     */

    var getPaperView = function (options) {
        options = $.extend(true, {}, PaperView.defaults, options);
        var eles = [];
        this.each(function () {
            var self = this;
            var instance = new PaperView(self, options);
            eles.push(instance);
        });
        return eles[0];
    };

    $.fn.extend({
        'orangePaperView': getPaperView
    });
})(jQuery, window, document);
