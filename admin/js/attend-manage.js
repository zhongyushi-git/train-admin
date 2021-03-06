var app = new Vue({
    el: '#app',
    //数据区
    data: {
        json: {
            trem_id: '',
            id: '',
            times: [],
            class_id: '',
            name: '',
            username: '',
            size: 10,
            page: 1,
            size2: 5,
            page2: 1
        },
        term_options: [],
        class_options: [],
        datas: [],
        total: 0,
        total2: 0,
        selectOptions: [], //获取多选按钮选中的数据
        dialogVisible: false, //弹框是否显示
        labelPosition: 'right', //弹框中文字的显示方式,居右
        dialogVisibleAnalysis: false,
        analysisData: [],
        form: {
            attend_id: '',
            username: '',
            attend_time: '',
            attend_teacher: '',
            attend_addr: '',
            attend_remark: ''
        },
        planList: [],
    },
    //初始化区
    mounted: function () {
        this.initTime(15)
        this.getTermList()
        this.getClassList()
    },
    // 定义方法区
    methods: {
        //初始化日期文本框
        initTime(d) {
            this.json.times.push(dateFormat('YYYY-mm-dd HH:MM:SS', new Date(preDate(1, d))))
            this.json.times.push(dateFormat('YYYY-mm-dd HH:MM:SS', new Date()))
        },
        // 获取学期信息
        getTermList() {
            var that = this
            axios.get(WebAPI.manage + 'term/getTermList').then(res => {
                that.term_options = res.data
            }, function (err) {
                console.log(err)
            })
        },
        // 获取班级信息
        getClassList() {
            var that = this
            axios.get(WebAPI.manage + 'class/getClassList').then(res => {
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
            axios.get(WebAPI.engineer + 'attend/getListToTimeByAdmin?term_id=' + data.id + '&times=' +
                data.times + '&class_id=' + data.class_id + '&name=' + data.name + '&username=' +
                data.username + '&page=' + data.page + '&size=' + data.size)
                .then(res => {
                    that.total = res.data.total
                    that.datas = res.data.data
                }, err => {
                    console.log(err)
                }
                )
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
            } else if (data.times == null || data.times.length == 0) {
                this.$message({
                    message: '请选择考勤时间后再进行查询',
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
            } else if (data.id == null || data.id == '') {
                this.$message({
                    message: '请选择实训名称后再进行查询',
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
            axios.get(WebAPI.engineer + 'attend/getOneByAdmin/' + this.selectOptions[0].attend_id).then(res => {
                that.form = res.data
            }, err => {
                console.log(err)
            }
            )
            this.dialogVisible = true
        },
        //删除
        deleteInfo() {
            var arr = []
            this.selectOptions.forEach((item, index) => {
                arr.push(item.attend_id);
            })
            //base64加密
            arr = Base64.encode(arr)
            var that = this
            axios.delete(WebAPI.engineer + 'attend/deleteToIdByAdmin/' + arr).then(res => {
                if (res.data.code == 200
                ) {
                    that.$message({
                        message: '删除成功',
                        type: 'success',
                        showClose: true,
                    });
                    that.search(1)
                }
                else {
                    that.$message({
                        message: res.data.msg,
                        type: 'error',
                        showClose: true,
                    });
                }
            },
                err => {
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
            }).
                catch(() => { }
                )
                ;
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
            //提交之前进行验证
            if (this.form.attend_time == null || this.form.attend_time == '') {
                this.$message({
                    message: "考勤时间不能为空",
                    type: 'warning',
                    showClose: true,
                });
                return
            } else if (this.form.attend_teacher == null || this.form.attend_teacher == '') {
                this.$message({
                    message: "考勤者不能为空",
                    type: 'warning',
                    showClose: true,
                });
                return
            }
            var that = this
            axios.post(WebAPI.engineer + 'attend/updateByAdmin',
                that.form, {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                } //加上头部信息
            })
                .then(res => {
                    if (res.data.code == 200) {
                        that.dialogVisible = false
                        that.$message({
                            message: '修改成功',
                            type: 'success',
                            showClose: true,
                        });
                        that.search(1)
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
        tableAnalysis() {
            if (!this.beforeSearch()) {
                return
            }
            var that = this
            var data = that.json
            axios.get(WebAPI.engineer + 'attend/tableAnalysisByAdmin?term_id=' + data.id + '&times=' +
                data.times + '&class_id=' + data.class_id + '&name=' + data.name + '&username=' +
                data.username + '&page=' + data.page2 + '&limit=' + data.size2)
                .then(res => {
                    that.analysisData = res.data.data
                    that.total2 = res.data.count
                }, err => {
                    console.log(err)
                })
            this.dialogVisibleAnalysis = true
        },
        //每页条数发送改变
        handleSizeChange2(val) {
            this.json.size2 = val
            this.tableAnalysis()
        },
        //当前页发生改变
        handleCurrentChange2(val) {
            this.json.page2 = val
            this.tableAnalysis()
        },
        clear() {
            this.json = {
                trem_id: '',
                times: [],
                class_id: '',
                name: '',
                username: '',
                page: 1,
                size: 10
            }
            this.initTime(15)
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
