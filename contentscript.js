//判断是否是河畔
function isHP() {
	return /bbs\.stuhome\.net\/post\.php|bbs\.qshpan\.com\/post\.php/.test(window.location.href);
}

//网易内容抓取
function getNetease() {

	var title = $('#h1title').text() + '  --[by 河畔一键转发]',
		contentNode = $('#endText>p'),
		meta = $('.ep-content-main').find('.ep-info').find('.left').text();

	var content = '';

	contentNode.each(function(index, item){
		content += $(item).text() + '<br>';
	});

	content = content + '<br>' + meta;

	content += '<br><br>by 河畔一键分享';

	return {
		title: title,
		content: content
	}

}

//虎嗅内容抓取
function getHuxiu() {

	var neirong = $('.neirong'),
		title = neirong.find('h1').text() + '  --[by 河畔一键转发]',
		imgs = neirong.find('img'),
		contentNode = $('#neirong_box tr td div>div'),
		meta = neirong.find('.neirong-other').text();

	var content = '';

	contentNode.each(function(index, item) {
		content += '&nbsp;&nbsp;' + $(item).text() + '<br>';
	});

	imgs.each(function(index, item) {
		content += item.outerHTML + '<br>';
	})

	content = content + '<br>' + meta;

	content += '<br><br>by 河畔一键分享';

	return {
		title: title,
		content: content
	}

}

//linux.cu的内容抓取
function getLinuxCN() {
	var post = $('#postlist'),
		title = $('#thread_subject').text() + '  --[by 河畔一键转发]',
		contentNode = post.find('.plc .pct .t_f>p'),
		imgs = post.find('.t_f p img'),
		meta = post.find('.messageinfo').text();

	var content = '';

	contentNode.each(function(index, item) {
		content += '&nbsp;&nbsp;' + $(item).text() + '<br>';
	});

	imgs.each(function(index, item) {
		content += item.outerHTML + '<br>';
	})

	content = content + '<br>' + meta;

	content += '<br><br>by 河畔一键分享';

	return {
		title: title,
		content: content
	}
}

//添加平台管理工具
var Manager = {
	queue: [],
	add: function(match, getContent) {
		this.queue.push({match: match, getContent: getContent});
	},
	get: function() {

		for( var i=0; i<this.queue.length; i++ ) {
			if ( (new RegExp(this.queue[i].match)).test(location.href) ) {
				return this.queue[i].getContent();
			}
		}

	},
	isShow: function() {
		for( var i=0; i<this.queue.length; i++ ) {
			if ( (new RegExp(this.queue[i].match)).test(location.href) ) {
				return true;
			}
		}
		return false;
	}
}

//添加平台
Manager.add('linux\.cn', getLinuxCN);
Manager.add('huxiu\.com', getHuxiu);
Manager.add('163\.com', getNetease);

//接受触发回调
function handler(request, sender, sendResponse) {

	var flag = request.flag;

	//河畔
	if ( flag == "0" ) {

		var data = request.result;
		if ( data.title ) {

			//自动填写表单
			var form = $(document).find('form[name="FORM"]'),
				titleInput = form.find('input[name="atc_title"]'),
				contentInput = form.find('#textarea'),
				typeInput = form.find('select[name="p_type"]'),
				iframe = $('#iframe');

			titleInput.val(data.title);
			contentInput.val(data.content);
			iframe.contents().find('body').html(data.content);
			typeInput.val(6);

		} else {
			alert('当前不支持本页面的分享...');
		}

	} else if ( flag == "1" ) {

		var html = '<ul id="hepan-type-wrap">';
		html += '分享到:';
		html += '<li class="hepan-type-item" data-type="25">水区</li>';
		html += '<li class="hepan-type-item" data-type="136">社会百态</li>';
		html += '<li class="hepan-type-item" data-type="44">时政要闻</li>';
		html += '<li class="hepan-type-item" data-type="99">Unix/Linux</li>';
		html += '</ul>';

		if( !$('#hepan-type-wrap')[0] ) {
			$(document.body).append(html);
			$('#hepan-type-wrap').show();
		} else {
			$('#hepan-type-wrap').show();
		}
		$('.hepan-type-item').on('click', sendData);
	}

}

//发送请求，判断类型，触发打开河畔
function sendData(e) {

	console.log('click');

	//版区，以id标示
	var type = $(e.target).attr('data-type') || 25;

	var result = {};

	//抓取内容
	result = Manager.get();

	//发送请求
	chrome.extension.sendMessage({flag: '1', result: result, type: type}, function(response) {
	});

	hidePopup();
	$('.hepan-type-item').off('click', sendData);

}

//河畔打开模式，发送请求
function getData() {
	chrome.extension.sendMessage({flag: "0"}, function(response) {
		console.log('sure hepan');
	});
}

//隐藏弹出框
function hidePopup() {
	$('#hepan-type-wrap').hide();
}

//触发器，接受分享触发
chrome.extension.onMessage.addListener( handler );

//如果是河畔，获取数据
if ( isHP() ) {
	getData();	
}

//如果是来源网站，显示page btn
if ( Manager.isShow() ) {
	chrome.extension.sendMessage({flag: "2"}, function(response) {
		console.log('is ok');
	});
}








