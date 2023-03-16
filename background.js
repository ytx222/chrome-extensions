console.log('背景服务运行');
import { sendDouyinCommand } from './main.js';
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
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	console.log('onClicked', info, tab);
	if (info.menuItemId === 'open_random_page') {
		chrome.tabs.create({ url: 'https://www.ytx222.com/rests/4_random/index.html' });
	} else if (info.menuItemId === 'menu-download-douyin') {
		await chrome.tabs.sendMessage(tab.id, { command: 'download-douyin' });
	}
});

const notificationId = 'ytx_chrome_util_notActiveDouyin';

chrome.commands.onCommand.addListener(async command => {
	console.log(`命令触发: ${command}`);
	// alert(1);
	if (command === 'download-douyin') {
		sendDouyinCommand(command);
	}
});
checkCommandShortcuts();

// Only use this function during the initial install phase. After
// installation the user may have intentionally unassigned commands.
function checkCommandShortcuts() {
	console.log('checkCommandShortcuts');
	chrome.commands.getAll(commands => {
		console.log(commands);
		let missingShortcuts = [];

		for (let { name, shortcut } of commands) {
			if (shortcut === '') {
				missingShortcuts.push(name);
			}
		}

		if (missingShortcuts.length > 0) {
			// Update the extension UI to inform the user that one or more
			// commands are currently unassigned.
		}
	});
}
