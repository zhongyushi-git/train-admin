var app = new Vue({
	el: '#app',
	data: {
		form: {
			username: '',
			password: '',
			role: 'admin'
		}

	},
	mounted: function() {

	},
	methods: {
		login() {
			const username = Base64.encode(this.form.username + "&" + this.form.role)
			const password = Base64.encode(this.form.password)
			var that = this
			axios.post(WebAPI.system + 'login/adminlogin', 
				{
					username:username,
					password:password
				},
				{
					//加上头部信息
					headers: {
						'Content-Type': 'application/json;charset=UTF-8'
					}
				}, 
				)
				.then(res => {
					console.log(res)
					if (res.data.code == 200) {
						sessionStorage.setItem("token",res.data.token);
						sessionStorage.setItem("user",btoa(encodeURIComponent(JSON.stringify(res.data.user))));
						window.location.href = 'index.html'
					} else {
						that.$message({
							message: "用户名或密码错误",
							type: 'error',
							showClose: true,
						});
					}
				}, err => {
					console.log(err)
				})
		}
	}
})
