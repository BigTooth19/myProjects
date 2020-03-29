/* 自定义菜单 */
module.exports = {
	"button":[
		{	
		  "type":"click",
		  "name":"戳我啊~",
		  "key":"click"
		},
		{
		   "name":"菜单",
		   "sub_button":[
			   {	
			       "type":"view",
			       "name":"搜索",
			       "url":"http://www.baidu.com/"
			    },
			    // {
			    //      "type":"miniprogram",
			    //      "name":"值机",
			    //      "url":"http://mp.weixin.qq.com",
			    //      "appid":"wxf6d4a2f3e23bad2d",
			    //      "pagepath":"pages/views/index/index"
			    // },
			    {
                    "type": "scancode_waitmsg", 
                    "name": "扫码带提示", 
                    "key": "rselfmenu_0_0", 
                }, 
                {
                    "type": "scancode_push", 
                    "name": "扫码推事件", 
                    "key": "rselfmenu_0_1", 
                }
		    ]
		},
		{
            "name": "发图", 
            "sub_button": [
                {
                    "type": "pic_sysphoto", 
                    "name": "系统拍照发图", 
                    "key": "rselfmenu_1_0", 
                 }, 
                {
                    "type": "pic_photo_or_album", 
                    "name": "拍照或者相册发图", 
                    "key": "rselfmenu_1_1", 
                }, 
                {
                    "type": "pic_weixin", 
                    "name": "微信相册发图", 
                    "key": "rselfmenu_1_2", 
                },
                {
		            "name": "发送位置", 
		            "type": "location_select", 
		            "key": "rselfmenu_2_0"
		        }
            ]
        }
	]
}