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
            var content = $('<div class="panel-body" >' +
                '<div class="row">' +
                '<div class="col-md-6" >' +
                '<div class="panel panel-info" >' +
                '<div class="panel-heading"><i class="fa fa-bell fa-fw"></i>通知公告</div>' +
                '<div class="panel-body" id="content1"></div>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-6" >' +
                '<div class="panel panel-warning" >' +
                '<div class="panel-heading"><i class="fa fa-calendar fa-fw"></i>今日日程</div>' +
                '<div class="panel-body" id="content2"></div>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-6" >' +
                '<div class="panel panel-danger" >' +
                '<div class="panel-heading"><i class="fa fa-suitcase fa-fw"></i>实用工具</div>' +
                '<div class="panel-body" id="content3"></div>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-6" >' +
                '<div class="panel panel-success" >' +
                '<div class="panel-heading"><i class="fa fa-pencil fa-fw"></i>板块4</div>' +
                '<div class="panel-body" id="content4"></div>' +
                '</div>' +
                '</div>' +
               /*'<div class="col-md-6" >' +
                '<div class="panel panel-primary" >' +
                '<div class="panel-heading">板块5</div>' +
                '<div class="panel-body" id="content5"></div>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-6" >' +
                '<div class="panel panel-red" >' +
                '<div class="panel-heading">板块6</div>' +
                '<div class="panel-body" id="content6"></div>' +
                '</div>' +
                '</div>' +*/
                '</div>' +
                '</div>');
            App.content.append(content);
            initEvents();
        }
    };
    var initEvents = function () {
		initMessage();
    };

function initMessage(){
	$.ajax({
		url:App.href + "/api/core/message/list",
		type:"GET",
		data:"pageNum=1&pageSize=5",
		resultType:"json",
		success:function(result){
			if(result.code!=200){
				console.log("信息加载失败");
			}
			var $content1 = $("#content1");
			if(result.data.total>0){
				var $ul = $('<div class="panel-group" id="accordion"></div>');
				for(var i=0;i<result.data.total;i++){
					var item = result.data.data[i];
					var open=' aria-expanded="false" class="collapsed" ';
					var contentopne='class=" panel-collapse collapse" aria-expanded="false" style="height: 0px;" ';
					if(i==0){
						open=' aria-expanded="true" ';
						contentopne='class=" panel-collapse collapse in" aria-expanded="true" ';
					}
					var li='<div class="panel panel-default">'+
	'                                    <div class="panel-heading">'+
	'                                        <h4 class="panel-title">'+
	'                                            <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne'+
						item.mId+'" '+open+'><i class="fa fa-envelope fa-fw"></i>'+
						item.title+' &nbsp;'+item.createTime.substring(0,11)+'</a>'+
	'                                        </h4>'+
	'                                    </div>'+
	'                                    <div id="collapseOne'+item.mId+'" '+contentopne+'>'+
	'                                        <div class="panel-body">'+
														item.content+
	'                                        </div>'+
	'                                    </div>'+
	'                                </div>';

					$ul.append(li);
				}
				$content1.append($ul);
			}
		}
	});
}
})(jQuery, window, document);
