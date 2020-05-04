var app = new Vue({
	el: '#app',
	//数据区
	data: {
		json: {
			term_id: '',
			train_name: '',
			size: 10,
			page: 1,
		},
		term_options: [],
		datas: [],
		total: 0,
		form: {
			term_id: '',
			train_name: '',
			start_time: '',
			end_time: '',
			remark: '',
		},
		dialogVisible: false,
		labelPosition: 'right', 
	},
	//初始化区
	mounted: function() {
		this.getTermList()
	},
	// 定义方法区
	methods: {
		addInfo(){
			this.dialogVisible = true
			this.clearForm()
		},
		//搜索
		search(level) {
			if (this.json.term_id == '' || this.json.term_id == null) {
				this.$message({
					message: '请选择学期后查询',
					type: 'warning',
					showClose: true,
				});
			}
			var that = this
			var data = that.json
			//默认点击按钮搜索,设置当前页为第一页,否则就是当前页
			if (level == 0) {
				data.page = 1
				that.total = 0 //刷新分页
			}
			axios.get(WebAPI.teacher + 'trainPlan/getList', {
					params: {
						term_id: this.json.term_id,
						train_name: this.json.train_name,
						page: this.json.page,
						limit: this.json.size
					}
				})
				.then(res => {
					that.total = res.data.count
					that.datas = res.data.data
				}, err => {
					console.log(err)
				})
		},
		//每页条数发送改变
		handleSizeChange(val) {
			this.json.size = val
			this.search(1)
		},
		//当前页发生改变
		handleCurrentChange(val) {
			this.json.page = val
			this.search(1)
		},
		// 获取学期信息
		getTermList() {
			var that = this
			axios.get(WebAPI.manage + 'term/getTermList').then(res => {
				that.term_options = res.data
			}, function(err) {
				console.log(err)
			})
		},
		//保存数据
		saveForm() {
			if (!this.checkForm()) {
				return
			}
			var that = this
			axios.post(WebAPI.teacher + "trainPlan/saveTrainPlan",
					that.form, {
						headers: {
							'Content-Type': 'application/json;charset=UTF-8'
						} //加上头部信息
					})
				.then(res => {
					if (res.data.code == 200) {
						that.dialogVisible = false
						that.$message({
							message: '保存成功',
							type: 'success',
							showClose: true,
						});
						if (that.json.term_id != null && that.json.term_id != '') {
							that.search(0)
						}
					} else {
						that.$message({
							message: res.data.msg,
							type: 'error',
							showClose: true,
						});
					}
				}, err => {
					console.log(err)
				})
		},
		//关闭时清空数据
		clearForm() {
			this.form = {
				term_id: '',
				train_name: '',
				start_time: '',
				end_time: '',
				remark: '',
			}
		},
		//验证表单合法性
		checkForm() {
			var flag = true
			var data = this.form
			if (data.term_id == null || data.term_id == '') {
				this.$message({
					message: '请选择学期',
					type: 'warning',
					showClose: true,
				});
				flag = false
			} else if (data.train_name == null || data.train_name == '') {
				this.$message({
					message: '实训名称为必填项',
					type: 'warning',
					showClose: true,
				});
				flag = false
			} else if (data.start_time == null || data.start_time == '') {
				this.$message({
					message: '请输入实训开始时间',
					type: 'warning',
					showClose: true,
				});
				flag = false
			} else if (data.end_time == null || data.end_time == '') {
				this.$message({
					message: '请输入实训结束时间',
					type: 'warning',
					showClose: true,
				});
				flag = false
			} else if (new Date(data.end_time.replace("-", "/").replace("-", "/")) <
				new Date(data.start_time.replace("-", "/").replace("-", "/"))) {
				this.$message({
					message: '实训结束时间不能小于开始时间',
					type: 'warning',
					showClose: true,
				});
				flag = false
			}
			return flag
		}
	}
});
