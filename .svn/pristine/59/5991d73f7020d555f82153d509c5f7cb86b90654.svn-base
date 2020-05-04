var app = new Vue({
    el: '#app',
    //数据区
    data: {
        json: {
            name: '',
            username: '',
            size: 10,
            page: 1
        },
        sex_options: [{
            value: '0',
            label: '男'
        }, {
            value: '1',
            label: '女'
        }],
        teacherData: [],
        total: 0,
        selectOptions: [], //获取多选按钮选中的数据
        dialogVisible: false, //弹框是否显示
        isImport: false,
        labelPosition: 'right', //弹框中文字的显示方式,居右
        form: {
            username: '',
            name: '',
            phone: '',
            email: '',
            sex: ''
        },
        fileList: []
    },
    //初始化区
    mounted: function () {
        this.search(0);
    },
    // 定义方法区
    methods: {
        //搜索按钮
        search(level) {
            var that = this
            var data = that.json
            //默认点击按钮搜索,设置当前页为第一页,否则就是当前页
            if (level == 0) {
                data.page = 1
                that.total = 0 //刷新分页
            }
            axios.get(WebAPI.manage + 'teacher/getListByAdmin?username=' + data.username + '&name=' + data.name +
                '&page=' + data.page + '&size=' + data.size)
                .then(res => {
                that.total = res.data.total
                that.teacherData = res.data.data
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
        //重置按钮
        clear() {
            this.json = {
                class_id: '',
                name: '',
                username: '',
                size: 10,
                page: 1
            }
        },
        //修改按钮,负责查询数据,打开弹框
        updateInfo() {
            var len = this.selectOptions.length
            if (len == 0) {
                this.$message({
                    message: '请选择一行数据',
                    type: 'warning',
                    showClose: true,
                });
                return
            } else if (len > 1) {
                this.$message({
                    message: '只能选择一行数据',
                    type: 'warning',
                    showClose: true,
                });
                return
            }
            var that = this
            axios.get(WebAPI.manage + 'teacher/getOneByAdmin?username=' + this.selectOptions[0].username).then(res => {
                that.form = res.data
            }, err => {
                console.log(err)
            })
            this.dialogVisible = true
        },
        //删除
        deleteInfo() {
            var arr = []
            this.selectOptions.forEach((item, index) => {
                arr.push(item.username);
			})
            //base64加密
            arr = Base64.encode(arr)
            var that = this
            axios.delete(WebAPI.manage + 'teacher/deleteByAdmin/' + arr).then(res => {
                if(res.data.code == 200 ) {
					that.$message({
						message: '删除成功',
						type: 'success',
						showClose: true,
					});
					that.search(1)
                }else{
					that.$message({
						message: res.data.msg,
						type: 'error',
						showClose: true,
					});
				}
			},err => {
                console.log(err)
            })
        },
        //删除前的检查
        checkDel() {
            var len = this.selectOptions.length
            if (len == 0) {
                this.$message({
                    message: '至少选择一行数据',
                    type: 'warning',
                    showClose: true,
                });
                return
            }
            this.$confirm('确认删除 ' + len + ' 条数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteInfo()
			}).catch(() => {})
        },
        changeFile(file) {
            this.fileList.push(file)
        },
        //导入按钮,文件上传
        importInfo() {
            if (this.fileList.length == 0) {
                this.$message({
                    message: "请选择一个excel文件",
                    type: 'warning',
                    showClose: true,
                });
                return;
            }
            var file = this.fileList[0]
            if (!this.beforeHandle(file)) {
                return
            }
            var param = new FormData()
            this.isImport = false
            var that = this
            param.append("file", file.raw)
            axios.post(WebAPI.manage + 'teacher/upload', param).then(res => {
                if(res.data.code == 200 ) {
					that.$message({
						message: '导入成功',
						type: 'success',
						showClose: true,
					});
                }else{
					that.$message({
						message: res.data.msg,
						type: 'error',
						showClose: true,
					});
				}
			},err => {
                console.log(err)
            }
        )
        },
        //获取多选按钮选中的数据
        handleSelectionChange(val) {
            this.selectOptions = val
        },
        //点击行触发，选中或不选中复选框
        handleRowClick(row, column, event) {
            this.$refs.multipleTable.toggleRowSelection(row);
        },
        //保存修改的数据
        saveForm() {
            if (!checkPhone(this.form.phone)) {
                this.$message({
                    message: '请输入正确的手机号',
                    type: 'warning',
                    showClose: true,
                });
                return;
            }
            if (!checkEmail(this.form.email)) {
                this.$message({
                    message: '请输入正确的邮箱',
                    type: 'warning',
                    showClose: true,
                });
                return;
            }
            var that = this
            axios.post(WebAPI.manage + 'teacher/updateByAdmin',
                that.form, {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    } //加上头部信息
                })
            .then(res => {
                if(res.data.code == 200 ) {
					that.dialogVisible = false
					that.$message({
						message: '修改成功',
						type: 'success',
						showClose: true,
					});
					that.search(1)
				}else{
					that.$message({
						message: res.data.msg,
						type: 'error',
						showClose: true,
					});
				}
			},err => {
                console.log(err)
            }
        )
        },
        //关闭时清空文件列表
        clearFileList() {
            if (!this.isImport) {
                this.fileList = []
            }
        },
        //导入之前进行验证
        beforeHandle(file) {
            var flag = true
            var xlsx = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            var xls = "application/vnd.ms-excel";
            var size = file.raw.size / 1024 / 1024 < 10; //定义文件大小不能大于10M
            if (file.raw.type != xls && file.raw.type != xlsx) {
                this.$message({
                    message: "只能选择excel类型文件!请点击×删除此文件后重新上传",
                    type: 'warning',
                    showClose: true,
                });
                flag = false
            } else if (!size) {
                this.$message({
                    message: "文件大小不能超过10M,请点击×删除此文件后重新上传",
                    type: 'warning',
                    showClose: true,
                });
                flag = false
            }
            return flag
        },
        //密码重置的检查
        beforeResetPwd() {
            var len = this.selectOptions.length
            if (len == 0) {
                this.$message({
                    message: '至少选择一行数据',
                    type: 'warning',
                    showClose: true,
                });
                return
            }
            this.$confirm('确认重置所选的 ' + len + ' 位教师的密码吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.resetPwd();
			}).catch(() => {})
        },
        //密码重置
        resetPwd() {
            var arr = []
            this.selectOptions.forEach((item, index) => {
                arr.push(item.username);
			})
            //base64加密
            arr = Base64.encode(arr)
            var that = this
            axios.get(WebAPI.manage + 'teacher/resetPwdByAdmin?arr=' + arr).then(res => {
                if(res.data.code == 200 ) {
					that.$message({
						message: '重置成功',
						type: 'success',
						showClose: true,
					});
					that.search(1)
				}else{
					that.$message({
						message: res.data.msg,
						type: 'error',
						showClose: true,
					});
				}
			},err => {
                console.log(err)
            })
        }

    }

});
