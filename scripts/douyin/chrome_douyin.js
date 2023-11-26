console.log('ytx222--注入到抖音的js');
const _topDocument = document;

window.ytx222_download_douyin_video = ytx222_download_douyin_video;

const getVideo = (document = _topDocument) => {
	const currentSwiper = document.querySelector(
		`.swiper-slide.swiper-slide-active,[data-e2e="feed-active-video"],.feed-active-video`
	);
	/**如果找到 currentSwiper则从currentSwiper里面取,如果没有,则取全局 */
	const video = (currentSwiper ? currentSwiper : document).querySelector('.xg-video-container video');
	return video;
};
async function ytx222_download_douyin_video(document = _topDocument, topDocument = _topDocument) {
	window.tipsEl = window.tipsEl || null;
	clearTips();
	/**
	data-e2e="feed-active-video"
	document.querySelector('[data-e2e="feed-active-video"]');
	document.querySelectorAll('[data-e2e]');
	 */
	const video = getVideo(document);

	if (video) {
		// 如果是blob
		if (video.src.startsWith('blob:')) {
			video.pause();
			const newDIv = document.createElement('div');
			// 屏幕顶部显示
			newDIv.style.cssText = `
				position: fixed;
				top: 0px;
				left: 0px;
				width: 100vw;
				height: 100vh;
				background: rgba(0, 0, 0, 0.5);
				z-index: -1;

				display: flex;
				justify-content: center;
				align-items: center;

			`;
			newDIv.onclick = () => {
				document.body.removeChild(newDIv);
			};
			const iframe = document.createElement('iframe');
			iframe.width = '100%';
			iframe.height = '100%';
			iframe.style.transform = 'scale(0.85)';
			iframe.style.transformOrigin = 'center center';
			iframe.src = location.href;
			iframe.onclick = e => {
				e.stopPropagation();
			};
			// iframe.onload = async () => {

			// 	// newWindow.addEventListener('load', async function () {
			// 	// 	console.log('ytx222--newWindow load');
			// 	// 	alert('11');
			// 	// 	// newWindow.postMessage('ytx222_download_douyin_video', '*');

			// 	// });
			// 	// await newWindow.ytx222_download_douyin_video(topDocument);
			// 	// document.removeChild(newDIv);
			// 	console.log('ytx222--newWindow load');
			// 	newWindow.postMessage('ytx222_download_douyin_video', '*');
			// };
			newDIv.appendChild(iframe);
			document.body.appendChild(newDIv);
			showTips('加载中...')
			setTimeout(() => {
				var newWindow = iframe.contentWindow;
				console.log('iframe.contentWindow', iframe.contentWindow);
				// 暂停播放视频逻辑
				newWindow.addEventListener('DOMContentLoaded', async function () {
					const noAutoplay = () =>
						setTimeout(async () => {
							const video = getVideo(newWindow.document);
							if (video) {
								video.autoplay = false;
								video.onplay = () => {
									video.pause();
								};
								// 直接把下载视频写到这里应该也行的
								await ytx222_download_douyin_video(newWindow.document, topDocument);
								document.body.removeChild(newDIv);
							} else noAutoplay();
						}, 4);
					noAutoplay();
				});
				// newWindow.addEventListener('load', async function () {
				// 	console.log('ytx222--newWindow load');

				// });
			}, 0);
			// localStorage.setItem('ytx222_download_douyin_video_openWindow', location.href);
			// var newWindow = window.open(location.href, '_blank', 'width=1000,height=800');
			// newWindow.addEventListener('load', function () {
			// 	console.log('ytx222--newWindow load');
			// 	newWindow.postMessage('ytx222_download_douyin_video', '*');
			// });

			return;
		}
		const infoContainer = video.parentElement.parentElement.querySelector(
			'.xgplayer-video-info-wrap .video-info-detail'
		);
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
			if (!video.children?.[i]) continue;
			const url = video.children?.[i]?.src;
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

// chrome.runtime.onStartup

// 接收消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log('ytx222--接收消息');
	// 是下载
	if (request.command === 'download-douyin') {
		ytx222_download_douyin_video();
	}
});

// window.addEventListener('message', async function (e) {
// 	console.log('ytx222--接收到message');
// 	console.log(e);
// 	console.log(e.data);
// 	if (e.data === 'ytx222_download_douyin_video') {
// 		await ytx222_download_douyin_video();
// 		window.close();
// 	}
// });
