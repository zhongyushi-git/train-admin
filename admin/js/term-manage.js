var app = new Vue({
    el: '#app',
    //数据区
    data: {
        json: {
            page: 1,
            size: 10
        },
        datas: [],
        total: 0,
        selectOptions: [], //获取多选按钮选中的数据
        isAdd: false,
        dialogVisible: false,
		labelPosition: 'right', //弹框中文字的显示方式,居右
        form: {
            term_id: '',
            term: '',
            term_start: '',
            term_end: '',
            term_remark: '',
        }
    },
    //初始化区
    mounted: function () {
        this.search()
    },
    // 定义方法区
    methods: {
        //搜索
        search() {
            var that = this
            var data = that.json
            axios.get(WebAPI.manage + 'term/getListByAdmin?page=' + data.page + '&size=' + data.size)
                .then(res => {
                that.total = res.data.total
                that.datas = res.data.data
            }, err => {
                console.log(err)
            })
        },
        //每页条数发送改变
        handleSizeChange(val) {
            this.json.size = val
            this.search()
        },
        //当前页发生改变
        handleCurrentChange(val) {
            this.json.page = val
            this.search()
        },
        deleteInfo() {
            var arr = []
            this.selectOptions.forEach((item, index) => {
                arr.push(item.term_id);
			})
            //base64加密
            arr = Base64.encode(arr)
            var that = this
            axios.delete(WebAPI.manage + 'term/deleteByAdmin/' + arr).then(res => {
                if(res.data.code == 200) {
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
			}, err => {
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
                this.deleteInfo();
			}).catch(() => {})
        },
        //获取多选按钮选中的数据
        handleSelectionChange(val) {
            this.selectOptions = val
        },
        //点击行触发，选中或不选中复选框
        handleRowClick(row, column, event) {
            this.$refs.multipleTable.toggleRowSelection(row)
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
            axios.get(WebAPI.manage + 'term/getOneByAdmin?term_id=' + this.selectOptions[0].term_id).then(function (res) {
                that.form = res.data
            }, function (err) {
                console.log(err)
            })
            this.isAdd = true
            this.dialogVisible = true
        },
        addInfo() {
            this.isAdd = false
            this.dialogVisible = true
            this.clearForm()
        },
        //保存数据
        saveForm() {
            if (!this.checkForm()) {
                return
            }
            var that = this
            axios.post(WebAPI.manage + 'term/saveByAdmin',
                that.form, {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    } //加上头部信息
                })
            .then(res => {
                if(res.data.code == 200) {
					that.dialogVisible = false
					that.$message({
						message: '保存成功',
						type: 'success',
						showClose: true,
					});
					that.search()
				 }else{
					that.$message({
						message: res.data.msg,
						type: 'error',
						showClose: true,
					});
				}
			},err =>{
                console.log(err)
            })
        },
        //关闭时清空数据
        clearForm() {
            this.form = {
                term_id: '',
                term: '',
                term_start: '',
                term_end: '',
                term_remark: '',
            }
        },
        //验证表单合法性
        checkForm() {
            var flag = true
            var data = this.form
            if (data.term_id == null || data.term_id == '') {
                this.$message({
                    message: '请输入学期id',
                    type: 'warning',
                    showClose: true,
                });
                flag = false
            } else if (!checkInteger(data.term_id) || data.term_id.length != 10) {
                this.$message({
                    message: '请输入合法的数字',
                    type: 'warning',
                    showClose: true,
                });
                flag = false
            } else if (data.term == null || data.term == '') {
                this.$message({
                    message: '请输入学期名称',
                    type: 'warning',
                    showClose: true,
                });
                flag = false
            } else if (data.term_start == null || data.term_start == '') {
                this.$message({
                    message: '请输入学期开始时间',
                    type: 'warning',
                    showClose: true,
                });
                flag = false
            } else if (data.term_end == null || data.term_end == '') {
                this.$message({
                    message: '请输入学期结束时间',
                    type: 'warning',
                    showClose: true,
                });
                flag = false
            } else if (new Date(data.term_end.replace("-", "/").replace("-", "/")) <
                new Date(data.term_start.replace("-", "/").replace("-", "/"))) {
                this.$message({
                    message: '学期结束时间不能小于开始时间',
                    type: 'warning',
                    showClose: true,
                });
                flag = false
            }
            return flag
        }

    },
})
