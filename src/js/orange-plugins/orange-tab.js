/**
 * Created by chenguojun on 8/29/16.
 */

(function ($, window, document, undefined) {
    var Tab = function (element, options) {
        this._options = options;
        this.$element = $(element);
        var id = element.id;
        if (id === undefined) {
            id = "davdian_tab_" + new Date().getTime();
            this.$element.attr("id", id);
        }
        this._elementId = id;
        this.init();
    };
    Tab.examples = {
        tabs: [
            {
                title: 'tab1',
                active: true,
                content: {
                    plugin: 'grid',
                    option: {}
                }
            },
            {
                title: 'tab2',
                active: true,
                content: {
                    html: ''
                }
            }
        ]
    };
    Tab.defaults = {
        tabs: []
    };
    Tab.prototype = {
        init: function () {
            var that = this;
            if (this._options.tabs !== undefined && this._options.tabs.length > 0) {
                var ul = $('<ul class="nav nav-tabs"></ul>');
                that.$element.append(ul);
                var tabContent = $('<div class="tab-content"></div>');
                that.$element.append(tabContent);
                $.each(that._options.tabs, function (i, tab) {
                    var tId = that._elementId + "_tab" + i;
                    var li = $('<li ' + (tab.active === true ? 'class="active"' : '') + '>' +
                        '<a href="#' + tId + '" data-toggle="tab" ' +
                        'aria-expanded="' + (tab.active === true ? 'true' : 'false') + '">' +
                        tab.title + '</a>' +
                        '</li>');
                    ul.append(li);
                    var pane = $('<div id="' + tId + '" class="tab-pane fade' + (tab.active === true ? ' active in ' : '') + '"></div>');
                    tabContent.append(pane);
                    if (tab.active === true) {
                        that.renderContent(pane, tab.content);
                        li.find("a").addClass("init")
                    } else {
                        li.find("a").on("click.init", function (e) {
                            var $t = $(this);
                            if (!$(this).hasClass("init")) {
                                that.renderContent(pane, tab.content);
                                $t.off("click.init");
                                $t.addClass("init");
                            }
                        })
                    }

                });
            }

        },
        renderContent: function (spanElement, content) {
            var rObject = $(spanElement);
            if (content.plugin !== undefined) {
                switch (content.plugin) {
                    case 'grid':
                        rObject = $(spanElement).orangeGrid(content.options);
                        break;
                    case 'form':
                        rObject = $(spanElement).orangeForm(content.options);
                        break;
                    case 'tab':
                        rObject = $(spanElement).orangeTab(content.options);
                        break;
                    default:
                        $(spanElement).append(content.html);
                }
            } else {
                $(spanElement).append(content.html);
            }
            console.log(content.afterRender);
            if (content.afterRender != undefined) {
                content.afterRender(rObject);
            }
        }
    };

    /**
     * jquery插件扩展 ===================================================
     */

    var getTab = function (options) {
        options = $.extend(true, {}, Tab.defaults, options);
        var eles = [];
        this.each(function () {
            var self = this;
            var instance = new Tab(self, options);
            eles.push(instance);
        });
        return eles[0];
    };

    $.fn.extend({
        'orangeTab': getTab
    });
})(jQuery, window, document);
