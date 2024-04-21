export async function sendDouyinCommand(command) {
	// 触发下载
	const [tab] = await chrome.tabs.query({
		// 地址
		url: 'https://*.douyin.com/*',
		// 活动窗口,一个窗口有多个tab时活动的那一个
		active: true,
		// 必须是聚集的窗口
		lastFocusedWindow: true,
	});
	if (tab) {
		const response = await chrome.tabs.sendMessage(tab.id, { command });
		// 响应内容似乎不重要
		console.log(response);
		return response;
	} else {
		chrome.notifications.clear(notificationId);
		// 发送通知,没有找到活动窗口
		chrome.notifications.create(notificationId, {
			type: 'basic',
			title: 'ytx_chrome_util',
			message: '没有活动的douyin窗口',
			iconUrl: './assets/fish.png',
			// 一直在屏幕显示
			requireInteraction: true,
			// 没有提示
			silent: true,
		});
		console.log('没有活动的douyin窗口');
	}
}

chrome.contextMenus.removeAll();

chrome.contextMenus.create({
	title: '下载当前视频',
	documentUrlPatterns: ['https://*.douyin.com/*'],
	id: 'menu-download-douyin',
});

chrome.contextMenus.create({
	title: '打开随机',
	id: 'open_random_page',
	// onclick: function () {
	// 	console.log('11111');
	// 	chrome.tabs.create({ url: 'https://www.ytx222.com/rests/4_random/index.html' });
	// },
});
