/**
 * Created by chenguojun on 9/28/16.
 */
;
(function ($, window, document, undefined) {
    App.menu = {
        "initVerticalMenu": initVerticalMenu,
        "initSideMenu": initSideMenu,
        "toggleMenu": toggleMenu,
        "showUserInfo": showUserInfo,
        "showTaskInfo": showTaskInfo
    };
    App.menusMapping = {};

    function toggleMenu() {
        var toggle = $.cookie('bi-menu-toggle');
        if (toggle == undefined) {
            toggle = "v";
        }
        console.info(toggle);
        if (toggle == "v") {
            $.cookie('bi-menu-toggle', "s", {expires: 7, path: '/'});
        } else {
            $.cookie('bi-menu-toggle', "v", {expires: 7, path: '/'});
        }

    }

    App.menu.userOption = {
        id: "current_user_form",//表单id
        name: "current_user_form",//表单名
        method: "POST",//表单method
        action: App.href + "/api/index/updateUser",
        ajaxSubmit: true,//是否使用ajax提交表单
        submitText: "提交",//保存按钮的文本
        showReset: true,//是否显示重置按钮
        resetText: "重置",//重置按钮文本
        isValidate: true,//开启验证
        buttonsAlign: "center",
        items: [
            {
                type: 'hidden',
                name: 'id',
                id: 'id'
            }, {
                type: 'text',//类型
                name: 'displayName',//name
                id: 'displayName',//id
                label: '昵称',//左边label
                cls: 'input-large',
                rule: {
                    required: true
                },
                message: {
                    required: "请输入昵称"
                }
            }, {
                type: 'password',//类型
                name: 'password',//name
                id: 'password',//id
                label: '旧密码',//左边label
                cls: 'input-medium',
                rule: {
                    required: true
                },
                message: {
                    required: "请输入旧密码"
                }
            }, {
                type: 'password',//类型
                name: 'newPassword',//name
                id: 'newPassword',//id
                label: '新密码',//左边label
                cls: 'input-medium',
                rule: {
                    minlength: 6,
                    maxlength: 64
                },
                message: {
                    minlength: "至少{0}位",
                    maxlength: "做多{0}位"
                }
            }, {
                type: 'text',//类型
                name: 'contactPhone',//name
                id: 'contactPhone',//id
                label: '手机'
            }, {
                type: 'text',//类型
                name: 'email',//name
                id: 'email',//id
                label: '邮箱',
                rule: {
                    email: true
                },
                message: {
                    email: "请输入正确的邮箱"
                }
            }
        ]
    };

    App.menu.taskGridOption = {
        url: App.href + "/api/core/exportTask/myList",
        pageNum: 1,//当前页码
        pageSize: 15,//每页显示条数
        idField: "id",//id域指定
        headField: "taskName",
        contentTypeItems: "table,card,list",
        showCheck: true,//是否显示checkbox
        checkboxWidth: "3%",
        showIndexNum: true,
        indexNumWidth: "5%",
        pageSelect: [2, 15, 30, 50],
        sort: "exportTime_desc",
        columns: [
            {
                title: "任务名称",
                align: "left",
                field: "taskName"
            }, {
                title: "导出时间",
                align: "left",
                field: "exportTime"
            }, {
                title: "完成时间",
                align: "left",
                field: "completeTime"
            }, {
                title: "耗时",
                align: "left",
                field: "costTime"
            }, {
                title: "状态",
                align: "left",
                field: "status",
                width: "10%",
                format: function (i, data) {
                    if (data.status == 2) {
                        return '<span class="label label-success">完成</span>'
                    } else if (data.status == 1) {
                        return '<span class="label label-warning">进行中</span>'
                    } else {
                        return '<span class="label label-danger">失败</span>'
                    }
                }
            },
            {
                title: "下载",
                field: "status",
                align: "left",
                format: function (index, data) {
                    if (data.status == 2) {
                        return '<a class="btn btn-danger btn-sm" href="' + data.attachmentUri + '">右键另存为</a>';
                    } else {
                        return '';
                    }
                }
            }
        ],
        tools: [
            {
                type: 'button',
                text: '刷新',
                cls: "btn btn-warning",
                handle: function (g) {
                    g.reload();
                }
            }
        ]
    };

    function getSubMenu(menus, menuId) {
        var subMenus = [];
        $.each(menus, function (i, m) {
            if (m.parentId == menuId) {
                subMenus.push(m);
            }
        });
        return subMenus;
    }

    function getMenu(menus, menuId) {
        var subMenus = [];
        $.each(menus, function (i, m) {
            if (m.id == menuId) {
                subMenus.push(m);
            }
        });
        return subMenus;
    }

    function getTopMenu(menus) {
        var topMenus = [];
        $.each(menus, function (i, m) {
            if (m.parentId == 0) {
                topMenus.push(m);
            } else {
                var subMenus = getMenu(menus, m.parentId);
                if (subMenus.length == 0) {
                    topMenus.push(m);
                }
            }
        });
        return topMenus;
    }

    function secondMenu(ele, menus, subMenus) {
        if (subMenus.length > 0) {
            ele += "<ul class='nav nav-second-level collapse'>";
            $.each(subMenus, function (i, m) {
                ele += ('<li data-level="sub">'
                    + '<a data-url="' + m.action
                    + '" data-title="' + m.functionName
                    + '" href="javascript:void(0);"><i class="' + (m.icon == null ? "glyphicon glyphicon-list" : m.icon) + '"></i> '
                    + m.functionName
                    + '</a>');
                var sMenus = getSubMenu(menus, m.id);
                ele = thirdMenu(ele, sMenus);
                ele += '</li>';
            });
            ele += "</ul>";
        }
        return ele;
    }

    function secondVerticalMenu(ele, menus, subMenus) {
        if (subMenus.length > 0) {
            ele += "<ul style='z-index: 10000;' class='dropdown-menu animated flipInX'>";
            $.each(subMenus, function (i, m) {
                ele += ('<li data-level="sub">'
                    + '<a data-url="' + m.action
                    + '" data-title="' + m.functionName
                    + '" href="/index.html?u=' + m.action + '"><i class="' + (m.icon == null ? "glyphicon glyphicon-list" : m.icon) + '"></i> '
                    + m.functionName
                    + '</a>');
                ele += '</li>';
            });
            ele += "</ul>";
        }
        return ele;
    }

    function thirdMenu(ele, subMenus) {
        if (subMenus.length > 0) {
            ele += "<ul class='nav nav-third-level collapse'>";
            $.each(subMenus, function (i, m) {
                ele += ('<li data-level="sub">'
                    + '<a data-url="' + m.action
                    + '" data-title="' + m.functionName
                    + '" href="javascript:void(0);"><i class="' + (m.icon == null ? "glyphicon glyphicon-list" : m.icon) + '"></i> '
                    + m.functionName
                    + '</a>');
                ele += '</li>';
            });
            ele += "</ul>";
        }
        return ele;
    }

    function showUserInfo() {
        var modal = $.orangeModal({
            id: "userForm",
            title: "用户信息",
            destroy: true,
            buttons: [
                {
                    type: 'button',
                    cls: 'btn-default',
                    text: '关闭',
                    handle: function (m) {
                        m.hide();
                    }
                }
            ]
        }).show();
        App.menu.userOption.ajaxSuccess = function () {
            modal.hide();
        };
        var form = modal.$body.orangeForm(App.menu.userOption);
        form.loadRemote(App.href + "/api/index/loadCurrentUser");
    }

    function showTaskInfo() {
        var modal = $.orangeModal({
            id: "exportList",
            title: "导出任务列表",
            destroy: true,
            buttons: [
                {
                    type: 'button',
                    cls: 'btn-default',
                    text: '关闭',
                    handle: function (m) {
                        m.hide();
                    }
                }
            ]
        }).show().$body.orangeGrid(App.menu.taskGridOption);
    }

    function initSideMenu() {
        var ul = "#side-menu";
        $("ul[role=vertical]").remove();
        $(".page-wrapper").removeClass("side-page");
        $.ajax(
            {
                type: 'GET',
                url: App.href + "/api/index/current",
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (request) {
                    request.setRequestHeader("X-Auth-Token", App.token);
                },
                success: function (result) {
                    if (result.code === 200) {
                        var menus = result.data.functionList;
                        var userInfo = result.data.user;
                        App.currentUser = userInfo;
                        $("ul.nav").find("#gUserName").html(userInfo.displayName);
                        $.each(menus, function (i, m) {
                            App.menusMapping[m.action] = m.functionName;
                        });
                        var topMenus = getTopMenu(menus);
                        $.each(topMenus, function (i, m) {
                            if (m.parentId == 0) {
                                var ele =
                                    '<li data-level="top">'
                                    + '<a data-url="' + m.action
                                    + '" data-title="' + m.functionName
                                    + '" href="javascript:void(0);"><i class="' + (m.icon == null ? "glyphicon glyphicon-list" : m.icon) + '"></i> '
                                    + m.functionName
                                    + '</a>';
                                var subMenus = getSubMenu(menus, m.id);
                                if (subMenus.length > 0) {
                                    ele = secondMenu(ele, menus, subMenus);
                                }
                                ele += '</li>';
                                var li = $(ele);
                                li.find("li[data-level=sub]").parents("li[data-level=top]").addClass("submenu").find("a:eq(0)").append('<span class="caret pull-right"></span>');
                                $(ul).append(li);
                            }
                        });
                        $(ul).metisMenu();
                        $(ul).find("li[class!=submenu] > a")
                            .each(function () {
                                    var url = $(this).attr("data-url");
                                    $(this).on("click", function () {
                                        window.location.href = App.href + '/index.html?u=' + url;
                                    });
                                }
                            );
                        refreshHref(ul);
                    } else if (result.code === 401) {
                        bootbox.alert("token失效,请登录!");
                        window.location.href = '../login.html';
                    }
                },
                error: function (err) {
                }
            }
        );
    }

    function initVerticalMenu() {
        var ul = "#vertical-menu";
        $("ul[role=side]").remove();
        $.ajax(
            {
                type: 'GET',
                url: App.href + "/api/index/current",
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    if (result.code === 200) {
                        var menus = result.data.functionList;
                        var userInfo = result.data.user;
                        App.currentUser = userInfo;
                        $("ul.nav").find("#gUserName").html(userInfo.displayName);
                        var topMenus = getTopMenu(menus);
                        $.each(menus, function (i, m) {
                            App.menusMapping[m.action] = m.functionName;
                        });
                        $.each(topMenus, function (i, m) {
                            if (m.parentId == 0) {
                                var subMenus = getSubMenu(menus, m.id);
                                var dropDown = "";
                                var toggle = "";
                                var cart = "";
                                if (subMenus.length > 0) {
                                    dropDown = 'class="dropdown"';
                                    toggle = 'class="dropdown-toggle" data-toggle="dropdown"';
                                    cart = '<span class="caret"></span>';
                                }
                                var ele =
                                    '<li ' + dropDown + ' data-level="top">'
                                    + '<a data-url="' + m.action
                                    + toggle + '" data-title="' + m.functionName
                                    + '" href="/index.html?u=' + m.action + '">'
                                    + m.functionName
                                    + cart
                                    + '</a>';
                                if (subMenus.length > 0) {
                                    ele = secondVerticalMenu(ele, menus, subMenus);
                                }
                                ele += '</li>';
                                var li = $(ele);
                                $(ul).append(li);
                            }
                        });
                        refreshHref(ul);
                    } else if (result.code === 401) {
                        bootbox.alert("token失效,请登录!");
                        window.location.href = '../login.html';
                    }
                },
                error: function (err) {
                }
            }
        );
    }

    var refreshHref = function (ul) {
        var location = window.location.href;
        var url = location.substring(location.lastIndexOf("?u=") + 3);
        if (location.lastIndexOf("?u=") > 0 && url != undefined && $.trim(url) != "") {
            var title = App.menusMapping[url];
            var f = App.requestMapping[url];
            var a;
            if (App.toggle == undefined || App.toggle == "v") {
                a = $(ul).find("li[class!=dropdown] > a[data-url='" + url + "']");
                a.parent().siblings("li").removeClass("active");
                a.parent().parent().parent().siblings("li").removeClass("active");
                a.parent().addClass("active");
                a.parent().parent().parent().addClass("active");
            } else {
                a = $(ul).find("li[class!=submenu] > a[data-url='" + url + "']");
                a.addClass("active");
                a.parent().parent().removeClass("collapse").addClass("in");
            }
            if (f != undefined) {

                App[f].page(title);
            } else {
                loadCommonMenu(url, title);
            }
        } else {
            window.location.href = App.href + "/index.html?u=/api/index";
        }

    };

    var loadCommonMenu = function (url, title) {
        $.ajax(
            {
                type: 'GET',
                url: App.href + url,
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    if (result.code === 200) {
                        App.content.empty();
                        var data = result.data;
                        App.title(title);
                        App.content.append(data.content);
                    } else {
                        alert(result.message);
                    }
                },
                error: function (e) {
                    alert("页面不存在");
                    window.location.href = App.href + "/index.html?u=/api/index";
                }
            }
        );
    };


    $(document).ready(function () {
        $("#side-vertical").click(function () {
            App.menu.toggleMenu();
            setTimeout(function () {
                window.location.reload();
            }, 500);
        });
        $("#user-info").click(function () {
            App.menu.showUserInfo();
        });
        $("#task-info").click(function () {
            App.menu.showTaskInfo();
        });
        var toggle = App.toggle = ($.cookie('bi-menu-toggle') == undefined ? "v" : $.cookie('bi-menu-toggle'));
        if (toggle == undefined) {
            toggle = "v";
        }
        if (toggle == "v") {
            App.menu.initVerticalMenu();
        } else {
            App.menu.initSideMenu();
        }
    });
})(jQuery, window, document);
