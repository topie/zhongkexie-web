/**
 * Created by chenguojun on 8/29/16.
 */

(function ($, window, document, undefined) {
    var PaperFill = function (element, options) {
        this._options = options;
        this.$element = $(element);
        var id = element.id;
        if (id === undefined || id == '') {
            id = "topie_paper_fill_" + new Date().getTime();
            this.$element.attr("id", id);
        }
        this._elementId = id;
        this.load();
        this.init();
    };
    PaperFill.defaults = {
        title: '',
        data: []
    };
    PaperFill.prototype = {
        load: function () {
        },
        init: function () {
            var that = this;
            var mainPanel = this.getPanel(this._options.title);
            that.$element.append(mainPanel);
            this.$main = mainPanel;
            var tabs = [];
            if (this._options.data !== undefined && this._options.data.length > 0) {
                var itemIndex = 1;
                $.each(this._options.data, function (i, idx) {
                    if (idx.items.length > 0) {
                        $.each(idx.items, function (ii, item) {
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
                            if (item.value != undefined && item.value != '') {
                                it.value = item.value;
                            }
                            var tab = {};
                            tab['title'] = itemIndex;
                            tab['content'] = {
                                plugin: 'form',
                                options: {
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
                                }
                            };
                            tabs.push(tab);
                            itemIndex++;
                        });
                    }
                });
            }
            tabs[0].active = true;
            var tab = mainPanel.find('div.panel-body:eq(0)').orangeTab({
                showOtherTab: false,
                lazy: false,
                tabs: tabs
            });
            var prevBtn = $('<button type="button" class="btn btn btn-info">上一题</button>');
            var nextBtn = $('<button type="button" class="btn btn btn-success">下一题</button>');
            mainPanel.find('div.panel-footer:eq(0)').append(prevBtn);
            mainPanel.find('div.panel-footer:eq(0)').append(nextBtn);
            prevBtn.on("click", function () {
                tab.prev();
            });
            nextBtn.on("click", function () {
                tab.next();
            });
            this.$tab = tab;
        },
        getPanel: function (title, theme) {
            if (theme === undefined)
                theme = 'default';
            var panelTmpl =
                '<div class="panel panel-' + theme + '" >' +
                '<div style="text-align: center" class="panel-heading">${title_}</div>' +
                '<div class="panel-body"></div>' +
                '<div class="panel-footer"></div>' +
                '</div>';
            return $.tmpl(panelTmpl, {
                "title_": title
            });
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
                    var ps = $(this).serialize().split('&');
                    $.each(ps, function (ii, ppss) {
                        var pss = ppss.split('=');
                        if (pss.length == 2) {
                            var answer = {};
                            answer['itemId'] = pss[0];
                            answer['itemValue'] = pss[1];
                            answers.push(answer);
                        }
                    });

                }
            );
            return answers;
        },
        loadAnswer: function (ans) {
            var that = this;
            $.each(ans, function (i, an) {
                that.loadValue(an.itemId, an.answerValue);
            });
            this.$tab.go(ans.length - 1);
        },
        loadValue: function (name, value) {
            var ele = this.$main.find("[name='" + name + "']");
            if (ele.is('input[type="radio"]')) {
                this.$main.find(
                    "input[type='radio'][name='" + name + "'][value='"
                    + value + "']").attr("checked", true);
            } else if (ele.is('input[type="checkbox"]')) {
                if (value != null) {
                    var values = value.split(",");
                    for (var i in values) {
                        this.$main.find(
                            "input[type='checkbox'][name='" + name
                            + "'][value='" + values[i] + "']")
                            .attr("checked", true);
                    }
                }
            } else if (ele.is('select')) {
                ele.val(value);
            } else {
                ele.val(value);
            }
            if (!$().uniform) {
                return;
            }
            var test = $("input[type=checkbox]:not(.toggle), input[type=radio]:not(.toggle, .star)");
            if (test.size() > 0) {
                test.each(function () {
                    $(this).show();
                    $(this).uniform();
                });
            }
        }
    };

    /**
     * jquery插件扩展 ===================================================
     */

    var getPaperFill = function (options) {
        options = $.extend(true, {}, PaperFill.defaults, options);
        var eles = [];
        this.each(function () {
            var self = this;
            var instance = new PaperFill(self, options);
            eles.push(instance);
        });
        return eles[0];
    };

    $.fn.extend({
        'orangePaperFill': getPaperFill
    });
})(jQuery, window, document);