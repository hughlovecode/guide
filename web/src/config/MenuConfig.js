const menuList = [
    {
        title: '导游信息管理',
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
        title: '行程管理',
        key: '/guide',
        children: [
            {
                title: '我的行程',
                key: '/guide/myGuide',
            },
            {
                title: '增加行程',
                key: '/guide/addMyGuide',
            },
            {
                title: '行程统计',
                key: '/guide/statisticAll',
            },
            {
                title: '行程修改',
                key: '/guide/modifyManage',
            }
        ]
    }

];
export default menuList;