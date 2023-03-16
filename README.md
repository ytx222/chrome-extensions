
```
将 XMLHttpRequest() 替换为全局 fetch()
XMLHttpRequest()不能从服务人员、分机或其他方式调用。将来自后台脚本的调用替换为对global 的XMLHttpRequest()调用。fetch()

const response = await fetch('https://www.example.com/greeting.json'')
console.log(response.statusText);
```
