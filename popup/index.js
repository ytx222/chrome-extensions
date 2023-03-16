import { sendDouyinCommand } from '../main.js';

console.log('11111');

let savedName = undefined;

chrome.runtime.onMessage.addListener(({ type, name }) => {
	console.error({ type, name });
	if (type === 'set-name') {
		savedName = name;
	}
});

document.querySelector('.btn1').onclick = function () {
	// console.log(111);
	// console.log(document.querySelector('.btn1'));
	sendDouyinCommand('download-douyin')
};
window.addEventListener('DOMContentLoaded', function () {
	// document.querySelector('.btn1').innerHTML = '111';
});
