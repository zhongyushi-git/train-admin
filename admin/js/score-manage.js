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
        form: {
            term_id: '',
            username: '',
            reply_score: '',
            train_score: '',
            all_score: '',
            all_status: ''
        },
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
            axios.get(WebAPI.student + 'score/getListByAdmin?term_id=' + data.id +
                '&class_id=' + data.class_id + '&name=' + data.name + '&username=' +
                data.username + '&page=' + data.page + '&size=' + data.size)
                .then(res => {
                that.total = res.data.total
                that.datas = res.data.data
            }, err => {
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
            axios.get(WebAPI.student + 'score/getOneByAdmin/' + this.selectOptions[0].username + '/' + this.selectOptions[0].term_id)
                .then(res => {
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
                console.log(item);
            arr.push(item.username + ':' + item.term_id);
			})
            //base64加密
            arr = Base64.encode(arr)
            var that = this
            axios.delete(WebAPI.student + 'score/deleteByAdmin/' + arr).then(res => {
                if(res.data.code == 200) {
					that.$message({
						message: '删除成功',
						type: 'success',
						showClose: true,
					});
					that.search(1)
				} else{
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
            //数字的验证
            var check = checkDigit(this.form.reply_score)
            if (check.length > 0) {
                this.$message({
                    message: check,
                    type: 'warning',
                    showClose: true,
                });
                return
            }
            check = checkDigit(this.form.train_score)
            if (check.length > 0) {
                this.$message({
                    message: check,
                    type: 'warning',
                    showClose: true,
                });
                return
            }
            var that = this
            axios.post(WebAPI.student + 'score/updateByAdmin',
                that.form, {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    } //加上头部信息
                })
            .then(res => {
                if(res.data.code == 200) {
					that.dialogVisible = false
					that.$message({
						message: '修改成功',
						type: 'success',
						showClose: true,
					});
					that.search(1)
				} else{
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
        //重置
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
        //格式化成绩
        formatReplyScore(row, column, cellValue, index) {
            if (row.reply_score == null || row.reply_score == 0) {
                row.reply_score = '-'
            }
            return row.reply_score

        },
        formatTrainScore(row, column, cellValue, index) {
            if (row.train_score == null || row.train_score == 0) {
                row.train_score = '-'
            }
            return row.train_score
        },
        formatAllScore(row, column, cellValue, index) {
            if (row.all_score == null || row.all_score == 0) {
                row.all_score = '-'
            }
            return row.all_score
        },
        formatAllStatus(row, column, cellValue, index) {
            return row.all_status === 1 ? '已提交' : '未提交'
        },
        //提交总成绩的检查
        beforeSubmit() {
            var len = this.selectOptions.length
            if (len == 0) {
                this.$message({
                    message: '至少选择一行数据',
                    type: 'warning',
                    showClose: true,
                });
                return
            }
            //判断是否可以进行提交总成绩(答辩或实训成绩是否为空)
            //判断是否已经提交了总成绩
            var array = [],
                array2 = [],
                array3 = [];
            this.selectOptions.forEach(item => {
                if(item.reply_score == null || item.reply_score == '' || item.reply_score == '-'
					|| item.train_score == null || item.train_score =='' || item.train_score == '-'){
						array.push(item.username);
				}else if (item.all_status != 1) {
					array3.push(item.username);
				}
				if (item.all_status == 1) {
					array2.push(item.username);
				}
			})
            if (array.length > 0) {
                this.$message({
                    message: "学号为" + array + "的学生答辩或实训报告成绩为空,无法提交总成绩",
                    type: 'warning',
                    showClose: true,
                });
                return
            }
            if (array2.length > 0) {
                this.$message({
                    message: "学号为" + array2 + "的学生已提交总成绩,不能重复提交",
                    type: 'warning',
                    showClose: true,
                });
                return
            }
            this.$confirm('确认提交 ' + len + ' 位学生的总成绩?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.submitAllScore(array3)
            }).catch(() => {})
        },
        //提交总成绩
        submitAllScore(arr) {
            var that = this
            axios.get(WebAPI.student + 'score/submitAllScore?term_id=' + that.json.id + '&arr=' + arr)
            .then(res => {
                if(res.data.code == 200) {
					that.$message({
						message: '提交成功',
						type: 'success',
						showClose: true,
					});
					that.search(1)
					array = []
					array2 = []
					array3 = []
				} else{
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
