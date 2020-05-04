var WebAPI = {
    'student': '../../../training/student/',
    'teacher': '../../../training/teacher/',
    'engineer': '../../../training/engineer/',
    'instructor': '../../../training/instructor/',
    'manage': '../../../training/manage/',
	'system': '../../../training/system/',
}
var loginUrl = 'login.html'
var token = sessionStorage.getItem("token");
var pathname = location.pathname
if (token == null) {
	if (window != top){
		top.location.href = location.href;
	}
	if (!pathname.endsWith("login.html")) {
		var href = loginUrl;
		if (!pathname.endsWith("index.html")) {
			href = '../../'+loginUrl
		}
		window.location.href = href
	}
}

//退出登录
function exit(){
	$.get(WebAPI.system+"login/logout",function(data){
		if(data.code==200){
			localStorage.clear();
			sessionStorage.clear();
			window.location.href=loginUrl;
		}else{
			alert("退出失败")
		}
	})
}
axios.defaults.headers.common["token"] = sessionStorage.getItem("token")