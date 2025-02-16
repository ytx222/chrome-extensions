console.log('ytx222--注入到抖音的js');
window.tipsEl = window.tipsEl || null;

window.ytx222_download_douyin_video = ytx222_download_douyin_video;

const _topDocument = document;
const getVideo = (document = _topDocument) => {
	const currentSwiper = document.querySelector(
		`.swiper-slide.swiper-slide-active,[data-e2e="feed-active-video"],.feed-active-video`
	);
	/**如果找到 currentSwiper则从currentSwiper里面取,如果没有,则取全局 */
	const video = (currentSwiper ? currentSwiper : document).querySelector('.xg-video-container video');
	return video;
};

let downloadIframe = null;

async function ytx222_download_douyin_video(document = _topDocument, topDocument = _topDocument) {
	console.log('ytx222_download_douyin_video');
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
			// video.pause();
			// iframeDownload();
			alert('blob请使用分享页面下载');
			return;
		}
		const infoContainer = video.parentElement.parentElement.querySelector(
			'.xgplayer-video-info-wrap .video-info-detail,#video-info-wrap '
		);
		/** 这里也可以切换成e2e形式的,不过目前好用就先这样
		 * .account .account-name,.account
		 */
		let name = infoContainer?.querySelector('.account')?.innerText || '';
		let desc = infoContainer?.querySelector('.title')?.innerText || '';
		name = name.replace(/[\s@]/g, '');
		desc = desc.replace(/[\s@]/g, '');
		// 在视频详细页可能找不到具体内容,就使用id+title
		if (name === '') {
			/**
			 * .playerControlHeight [data-e2e="related-video"] [data-e2e="user-info"]
			 * 内侧使用第二个元素,或者读取图片的alt都可以
			 *
			 * 实测发现一个页面可能有多个
			 * [data-e2e="user-info"] ,应该是现成的组件,
			 * 所以只需要
			 * [data-e2e=user-info] [data-click-from=title]
			 *
			 */
			name = document.querySelector('[data-e2e=user-info] [data-click-from=title]')?.innerText;
			/**
			 * data-e2e="detail-video-info"
			 * h1 ?
			 */
			const pathname = location.pathname?.replace('/video/', '') || '';
			/** @type {string} */
			let publishTime =
				document.querySelector('[data-e2e=detail-video-info] [data-e2e=detail-video-publish-time]')
					?.innerText || '';
			publishTime.replace('发布时间：', '');

			desc = `${document.title}-${pathname}-${publishTime}`;
			if (!name) {
				name ||= pathname;
				desc = document.title;
			}
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
	tipsEl.onclick ??= () => {
		if (downloadIframe) downloadIframe.style.zIndex = 9999;
	};
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
function hideTips(msg, time) {
	tipsEl && (tipsEl.style.opacity = 0);
	msg && (tipsEl.innerText = msg);
	setTimeout(clearTips, time || 2000);
}
function clearTips() {
	try {
		document.body.removeChild(tipsEl);
		window.tipsEl = null;
	} catch {}
}

function iframeDownload() {
	let url = location.href;
	// 在第一层时,有时候会丢失参数,这里给他补上吧..
	if (url.startsWith('https://www.douyin.com/user/self') && !url.includes('modal_id')) {
		const el = document.querySelector('[data-e2e-vid][data-e2e="feed-active-video"]');
		if (el && el.dataset.e2eVid) {
			url += (url.includes('?') ? '&' : '?') + 'video_id=' + el.dataset.e2eVid;
		}
	}

	const newDIv = document.createElement('div');
	// 如果已经有了,就先删除
	if (downloadIframe) document.body.removeChild(downloadIframe);
	downloadIframe = newDIv;

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
	newDIv.className = 'ytx222-iframe';

	newDIv.onclick = closeIframe;

	const iframe = document.createElement('iframe');
	iframe.width = '100%';
	iframe.height = '100%';
	iframe.style.transform = 'scale(0.85)';
	iframe.style.transformOrigin = 'center center';
	iframe.src = location.href;
	iframe.onclick = e => e.stopPropagation();

	newDIv.appendChild(iframe);
	document.body.appendChild(newDIv);

	showTips('加载中...');
	setTimeout(() => {
		var newWindow = iframe.contentWindow;
		console.log('iframe.contentWindow', iframe.contentWindow);

		const download = async () => {
			// 直接把下载视频写到这里应该也行的
			await ytx222_download_douyin_video(newWindow.document, _topDocument);
			// document.body.removeChild(newDIv);
			// downloadIframe = null;
			closeIframe();
		};
		const stopVideo = () =>
			setTimeout(async () => {
				const video = getVideo(newWindow.document);
				if (!video) return stopVideo();
				// 暂停播放视频逻辑
				video.autoplay = false;
				video.onplay = () => video?.pause?.();
				download();
			}, 4);

		newWindow?.addEventListener('DOMContentLoaded', stopVideo);
	}, 0);
	function closeIframe() {
		document.body.removeChild(newDIv);
		hideTips();
		downloadIframe = null;
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
/**
 * esc
 *
 * 在第一层,parent #slidelist
 * 在第二层 parent #upperFeedContainer
 */
window.addEventListener(
	'keydown',
	function (e) {
		console.log('ytx222--按下了' + e.key);
		if (e.key === 'Escape' || e.key === 'q') {
			console.log(this.location.href);
			closeCurFeedContainer(e.key === 'q');
		}
	},
	true
);

function closeCurFeedContainer(force = false) {
	let el2 = document.querySelector('#upperFeedContainer [data-e2e="feed-active-video"] video');
	console.log('closeCurFeedContainer', el2, force);
	if (el2 && force === false) return;

	if (location.href === 'https://www.douyin.com/user/self?showTab=favorite_collection' || force) {
		// 关闭当前视频
		// 抖音bug,反正是代码报错了
		return close();
	}
	// 这个可能是应付
	setTimeout(() => {
		el2 = document.querySelector('#upperFeedContainer [data-e2e="feed-active-video"] video');
		if (el2) {
			el2.pause();
			close();
		}
	}, 100);

	// 推荐页 使用的是 < 而不是 × 不兼容,都是动态类名,没啥特征,算了
	// 没想到我还是找到了特征,6
	// :has还挺好用,这样说也能选择同级内的元素了
	function close() {
		console.log('ytx222--执行关闭弹窗');
		let el = document.querySelectorAll('.isDark > svg')?.[0];
		if (!el) el = document.querySelector('svg:has([filter^="url(#return_svg"])');
		if (el) el.dispatchEvent(new PointerEvent('click', { type: 0, bubbles: true }));
		else {
			showTips('关闭弹窗失败');
			setTimeout(() => {
				hideTips(null, 1000);
			}, 500);
		}
	}
}

function* ElementParentIterator(el) {
	let curEl = el;
	while (curEl) {
		yield curEl;
		curEl = curEl?.parentElement;
	}
	return null;
}

window.onerror = e => {
	const msg = e.message;
	// Uncaught TypeError: Cannot read properties of null (reading 'getCurTab')
	if (msg.includes('getCurTab')) {
		closeCurFeedContainer();
	}
};

/**
 * for (const item of ElementParentIterator(e.target)) {
			console.log(item);
			if (item === el.themeContainer) return;
			// if (item.classList.contains("remove-icon"))
			//     return void deleteItem(item.parentElement);
			if (item.classList.contains('add-theme')) return addTheme();
			if (item.classList.contains('theme-item')) return void clickItem(item);
		}
 */

// window.addEventListener('message', async function (e) {
// 	console.log('ytx222--接收到message');
// 	console.log(e);
// 	console.log(e.data);
// 	if (e.data === 'ytx222_download_douyin_video') {
// 		await ytx222_download_douyin_video();
// 		window.close();
// 	}
// });
