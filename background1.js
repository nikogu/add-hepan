
//Page Action
chrome.pageAction.onClicked.addListener(function() {
	//触发事件，分享触发
	chrome.tabs.getSelected(null, function(tab) {
 		chrome.tabs.sendMessage(tab.id, {flag: "1"}, function(response) {
    		console.log(response.farewell);
  		});
	});	
});

var result = {};
var isNew = false;

//接收
chrome.extension.onMessage.addListener( receive );

//接受回调
function receive(request, sender, sendResponse) {
	//响应类型标示
	var flag = request.flag;
	var type = 25;
	var url = 'http://bbs.stuhome.net/post.php?fid=';

	//河畔请求数据
	if ( flag == '0' ) {
		if ( result && isNew ) {
			isNew = false;
			chrome.tabs.sendMessage(sender.tab.id, {flag: "0", result: result}, function(response) {
				console.log('send to hepan tab:' + sender.tab.id);
  			});
		}

	//获取数据
	} else if ( flag == '1' ) {
		isNew = true;
		result = request.result;
		type = request.type;

		url += type;

		chrome.tabs.create( {url: url}, function(tab) {
			console.log(tab);
		});

	//确认的网站
	} else if ( flag == '2') {

		//显示按钮
		chrome.pageAction.show(sender.tab.id);

	} else {

	}
}