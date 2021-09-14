zendesk app
[zendesk app 前端]]

说明:
这里面的包代码，主要是用于zendesk前端的东西
相关命令：
启动zendesk的开发环境
zcli login -i
zcli apps:server .

然后再ticket的链接后面跟上 ?zcli_apps=true 这个参数，再刷新一下界面

验证zendesk app 相关代码是否有bug
zcli apps:validate .

打包一个zendesk app 到zip文件
zcli apps:package .
相关账号信息

前期准备
1.注册zendesk 14天账号
2.npm   --> zcli 
3.改代码 ==> 测试
4.开发者账号 ==》 配置一些信息==> 提审
