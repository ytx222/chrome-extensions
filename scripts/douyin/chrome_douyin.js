console.log('ytx222--注入到抖音的js');

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
			iframeDownload();
			return;
		}
		const infoContainer = video.parentElement.parentElement.querySelector(
			'.xgplayer-video-info-wrap .video-info-detail,#video-info-wrap '
		);
		let name = infoContainer?.querySelector('.account .account-name,.account')?.innerText || '';
		let desc = infoContainer?.querySelector('.title')?.innerText || '';
		name = name.replace(/[\s@]/g, '');
		desc = desc.replace(/[\s@]/g, '');
		// 在视频详细页可能找不到具体内容,就使用id+title
		if (name === '' && location.pathname) {
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

function iframeDownload () {
	let url = location.href;
	// 在第一层时,有时候会丢失参数,这里给他补上吧..
	if (url === 'https://www.douyin.com/user/self?showTab=favorite_collection') {

		const el=document.querySelector('[data-e2e-vid][data-e2e="feed-active-video"]')
		if (el && el.dataset.e2eVid) {
			url += '&video_id=' + el.dataset.e2eVid;
		}

	}

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
	newDIv.className = 'ytx222-iframe';

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

	newDIv.appendChild(iframe);
	document.body.appendChild(newDIv);
	downloadIframe = newDIv;
	showTips('加载中...');
	setTimeout(() => {
		var newWindow = iframe.contentWindow;
		console.log('iframe.contentWindow', iframe.contentWindow);

		const download = async () => {
			// 直接把下载视频写到这里应该也行的
			await ytx222_download_douyin_video(newWindow.document, topDocument);
			document.body.removeChild(newDIv);
			downloadIframe = null;
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

		newWindow.addEventListener('DOMContentLoaded', stopVideo);
	}, 0);
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
		console.log('ytx222--按下了esc');
		console.log(this.location.href);
		if (e.key === 'Escape') {
			const el2 = document.querySelector('#upperFeedContainer [data-e2e="feed-active-video"] video');
			if (el2) return;
			// setTimeout(() => {
			// 	const el = document.querySelector('#slidelist [data-e2e="feed-active-video"] video');
			// 	if (el) {
			// 		el.pause();
			// 		// el.parentElement.parentElement.parentElement.parentElement.paren
			// 	}
			// }, 100);

			if (location.href === 'https://www.douyin.com/user/self?showTab=favorite_collection') {
				// 关闭当前视频
				// 抖音bug,反正是代码报错了
				console.log('ytx222--执行关闭弹窗');
				document.querySelectorAll('.isDark > svg,.ZCHTRJzJ')[0].click();
			}

			// if (el || el2) {
			// 	e.preventDefault();
			// 	e.stopPropagation();
			// 	return;
			// }
		}
	},
	true
);

function* ElementParentIterator(el) {
	let curEl = el;
	while (curEl) {
		yield curEl;
		curEl = curEl?.parentElement;
	}
	return null;
}
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
