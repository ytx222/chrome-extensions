console.log('注入到抖音的js');
console.log(window);
console.log(window.document);

async function ytx222_download_douyin_video() {
	window.tipsEl = window.tipsEl || null;
	clearTips();
	const currentSwiper = document.querySelector('.swiper-slide.swiper-slide-active');
	/**如果找到 currentSwiper则从currentSwiper里面取,如果没有,则取全局 */ const video = (
		currentSwiper ? currentSwiper : document
	).querySelector('.xg-video-container video');
	if (video) {
		const infoContainer = video.parentElement.parentElement.querySelector('.xgplayer-video-info-wrap .video-info-detail');
		let name = infoContainer?.querySelector('.account')?.innerText || '';
		let desc = infoContainer?.querySelector('.title')?.innerText || '';
		name = name.replace(/[\s@]/g, '');
		desc = desc.replace(/[\s@]/g, '');
		/** 在视频详细页可能找不到具体内容,就使用id+title */ if (name === '' && location.pathname) {
			name = location.pathname.replace('/video/', '');
			desc = document.title;
		}
		const fileName = name + '-' + desc + '.mp4';
		/** 考虑吧tips移动到这一层 */ showTips('视频下载中...');
		for (var i = 0; i < video.children.length; i++) {
			const url = video.children[i].src;
			let is = await downItem(url, fileName);
			if (is) {
				hideTips('下载完成');
				return;
			}
		}
		hideTips('下载失败');
	} else {
		showTips('没有找到视频元素 ' + selectStr);
		setTimeout(hideTips, 1000);
	}
	function downItem(url, fileName) {
		return new Promise(r => {
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						const a = document.createElement('a');
						a.download = fileName;
						a.href = URL.createObjectURL(xhr.response);
						a.click();
						r(1);
					} else {
						r(0);
					}
				}
			};
			xhr.responseType = 'blob';
			xhr.open('GET', url);
			xhr.send();
		});
	}
	function showTips(msg) {
		tipsEl ??= document.createElement('div');
		tipsEl.innerText = msg;
		tipsEl.style.cssText =
			'position: fixed;' +
			'top: 0px;' +
			'left: 0px;' +
			'width: 100%;' +
			'height: 75px;' +
			'background: #029B62;' +
			'z-index: 9999;' +
			'color: #FFF;' +
			'display: flex;' +
			'justify-content: center;' +
			'align-items: center;' +
			'font-size: 30px;' +
			'transition: opacity 2s;' +
			'opacity: 1;';
		document.body.appendChild(tipsEl);
	}
	function hideTips(msg) {
		tipsEl.style.opacity = 0;
		msg && (tipsEl.innerText = msg);
		setTimeout(clearTips, 2000);
	}
	function clearTips() {
		try {
			document.body.removeChild(tipsEl);
			window.tipsEl = null;
		} catch {}
	}
}

// window.ytx222_download_douyin_video = ytx222_download_douyin_video;

// chrome.runtime.onStartup

// 接收消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log('接收消息');
	// 是下载
	if (request.command === 'download-douyin') {
		ytx222_download_douyin_video();
	}
});
