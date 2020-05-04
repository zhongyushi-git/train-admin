var app = new Vue({
    el: '#app',
    //数据区
    data: {
        json: {
            trem_id: '',
            id: '',
            class_id: '',
            name: '',
            username: '',
            size: 10,
            page: 1,
        },
        term_options: [],
        class_options: [],
        datas: [],
        total: 0,
        selectOptions: [], //获取多选按钮选中的数据
        dialogVisible: false, //弹框是否显示
        labelPosition: 'right', //弹框中文字的显示方式,居右
        planList: [],
    },
    //初始化区
    mounted: function () {
        this.getTermList()
        this.getClassList()
    },
    // 定义方法区
    methods: {
        // 获取学期信息
        getTermList() {
            var that = this
            axios.get(WebAPI.manage + 'term/getTermList').then(function (res) {
                that.term_options = res.data
            }, function (err) {
                console.log(err)
            })
        },
        // 获取班级信息
        getClassList() {
            var that = this
            axios.get(WebAPI.manage + 'class/getClassList').then(function (res) {
                that.class_options = res.data
            }, function (err) {
                console.log(err)
            })
        },
        //搜索
        search(level) {
            if (!this.beforeSearch()) {
                return
            }
            var that = this
            var data = that.json
            //默认点击按钮搜索,设置当前页为第一页,否则就是当前页
            if (level == 0) {
                data.page = 1
                that.total = 0 //刷新分页
            }
            axios.get(WebAPI.teacher + 'report/getListByTea?term_id=' + data.id + '&classes=' +
                data.class_id + '&name=' + data.name + '&username=' + data.username + '&page=' + data.page + '&limit=' + data.size)
            .then(res => {
                that.total = res.data.count
                that.datas = res.data.data
            }, err =>{
                console.log(err)
            })
        },
        //搜索之前进行验证
        beforeSearch() {
            var data = this.json
            var flag = true
            if (data.term_id == null || data.term_id == '') {
                this.$message({
                    message: '请选择学期后再进行查询',
                    type: 'warning',
                    showClose: true,
                });
                flag = false
            } else if (data.class_id == null || data.class_id == '') {
                this.$message({
                    message: '请选择班级后再进行查询',
                    type: 'warning',
                    showClose: true,
                });
                flag = false
            }
            return flag
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
        //删除
        deleteInfo() {
            var arr = []
            this.selectOptions.forEach((item, index) => {
                arr.push(item.file_id + '&' + item.url);
			})
            console.log(arr);
            //base64加密
            arr = Base64.encode(arr)
            var that = this
            axios.delete(WebAPI.teacher + 'report/deleteFileByAdmin/' + arr).then(res => {
                if(res.data.code == 200){
					that.$message({
						message: '删除成功',
						type: 'success',
						showClose: true,
					});
					that.search(1)
				}else {
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
			}).catch(() => {}
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
        clear() {
            this.json = {
                trem_id: '',
                class_id: '',
                name: '',
                username: '',
                page: 1,
                size: 10
            }
        },
        //文件下载
        download() {
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
            var data = this.selectOptions[0]
            window.location.href = WebAPI.teacher + 'report/download?filename=' + data.new_name +
                '&path=' + data.url + '&old_name=' + data.old_name;
        },
        //获取实训计划信息
        getPlanList() {
            if (this.json.term_id == null || this.json.term_id == '') return
            var that = this
            axios.get(WebAPI.teacher + 'trainPlan/getPlanList?term_id=' + that.json.term_id)
            .then(res => {
                that.planList = res.data
            }, err => {
                console.log(err)
            })
        }
    }

});
