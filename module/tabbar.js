/* tabbar.js */

const state = {
  tabbar: [{
  		"pagePath": "/pages/todo/todo",
  		"iconPath": "/static/icon/listn.png",
  		"selectedIconPath": "/static/icon/list.png",
  		"text": "清单"
  	},
  	{
  		"pagePath": "/pages/tomato/tomato",
  		"iconPath": "/static/icon/todon.png",
  		"selectedIconPath": "/static/icon/todo.png",
  		"text": "番茄",
  		midButton: true,
  		
  	},
  	{
  		"pagePath": "/pages/user-center/user-center",
  		"iconPath": "/static/icon/myn.png",
  		"selectedIconPath": "/static/icon/my.png",
  		"text": "个人"
  	}
  ]
}
const mutations = {

}

//导出
export default {
  state,
  mutations,
}
