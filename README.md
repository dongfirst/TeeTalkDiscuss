### 一：小程序运行视频网址：

[校园表白墙/论坛类微信小程序-teetalkDiscuss_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV116xCeREZM/?vd_source=754bb2005e89d37c558ea4912708a9ca)

## 二：部署教程

1.下载微信开发者工具，在微信公众平台开通账号获取密钥

2.在微信开发者工具中打开原文件，开通云服务

<img title="" src="file:///D:/teetalkDiscuss/Reademeimg/2.png" alt="">

3.将源码中的各个js文件中的云服务id替换为自己的(一般在onload函数中)

<img title="" src="file:///D:/teetalkDiscuss/Reademeimg/3.png" alt="">

4.在云数据库中创建相应的表，其中Authorization放大模型的密钥

<img title="" src="file:///D:/teetalkDiscuss/Reademeimg/4.png" alt="">

5.在阿里云的大模型接口服务中创建自己的密钥，在talkmodel文件的js中将密钥换为自己的

<img title="" src="file:///D:/teetalkDiscuss/Reademeimg/5.png" alt="">
