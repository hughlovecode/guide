const menuList = [
    {
        title: '个人信息管理',
        key: '/Info',
        children: [
            {
                title: '我的信息',
                key: '/Info/myInfo',
            },
            {
                title: '修改信息',
                key: '/Info/changeMyInfo',
            },
        ]
    },
    {
        title: '课程管理',
        key: '/course',
        children: [
            {
                title: '我的课程',
                key: '/course/myCourse',
            },
            {
                title: '增加课程',
                key: '/course/addMyCourse',
            },
            {
                title: '课程统计',
                key: '/course/statisticAll',
            },
            {
                title: '课程修改',
                key: '/course/modifyManage',
            }
        ]
    },
    {
        title: '学生管理',
        key: '/studentManage'
    }

];
export default menuList;