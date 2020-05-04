var app = new Vue({
    el: '#app',
    //数据区
    data: {
        json: {
            times: [],
            type: '',
            size: 10,
            page: 1,
        },
        type_options: [{
            "label": "全部",
            "value": ""
        }, {
            "label": "系统通知",
            "value": "1"
        }, {
            "label": "预警通知",
            "value": "2"
        }, {
            "label": "管理员通知",
            "value": "3"
        }],
        arr: ['', '系统通知', '预警通知', '管理员通知'],
        datas: [],
        total: 0,
        selectOptions: [], //获取多选按钮选中的数据
    },
    //初始化区
    mounted: function () {
        this.initTime(15)
        this.search(1)
    },
    // 定义方法区
    methods: {
        //初始化日期文本框
        initTime(d) {
            this.json.times.push(dateFormat('YYYY-mm-dd HH:MM:SS', new Date(preDate(1, d))))
            this.json.times.push(dateFormat('YYYY-mm-dd HH:MM:SS', new Date()))
        },
        //搜索
        search(level) {
            var that = this
            var data = that.json
            //默认点击按钮搜索,设置当前页为第一页,否则就是当前页
            if (level == 0) {
                data.page = 1
                that.total = 0 //刷新分页
            }
            axios.get(WebAPI.manage + 'emailLog/getListByAdmin?times=' + data.times + '&type='
                + data.type + '&page=' + data.page + '&limit=' + data.size)
            .then(res => {
                that.total = res.data.count
                that.datas = res.data.data
            },err => {
                console.log(err)
            }
        )
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
                arr.push(item.id);
        })
            //base64加密
            arr = Base64.encode(arr)
            var that = this
            axios.delete(WebAPI.manage + 'emailLog/deleteByAdmin/' + arr).then(res => {
                if(res.data.code == 200){
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
        //获取多选按钮选中的数据
        handleSelectionChange(val) {
            this.selectOptions = val
        },
        //点击行触发，选中或不选中复选框
        handleRowClick(row, column, event) {
            this.$refs.multipleTable.toggleRowSelection(row);
        },
        formatType(row, column, cellValue, index) {
            return this.arr[row.type]
        },
    }
});
