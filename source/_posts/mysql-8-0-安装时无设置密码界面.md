---
title: mysql 8.0 安装时无设置密码界面
date: 2021-07-10 13:37:54
tags:
  -  mysql 8.0
  -   ubuntu 20.04
---

# mysql 8.0 安装时无设置密码界面及如何更新root 密码 Ubuntu 20.04
###  问题描述
Ubuntu 安装mysql 并没有跳出输入密码的界面，安装完成后无法进入root。报错ERROR1698(28000)： Access denied
### 原因分析
造成这个问题的主要原因是目标主机上安装过mysql 而卸载时apt purge 等命令只删掉了mysql的配置文件，而mysql的用户名等是存储在数据库中的，对应文件夹```/var/lib/mysql```，而再次安装时，mysql安装程序对原有的数据库没有更改权限，因此会创建临时用户名默认保存在文件夹```/etc/mysql/debian.cnf```。
如（图片来源网络，自己配的时候忘了截图）：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210608145135614.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMxMzgzMzg1,size_16,color_FFFFFF,t_70)
###  解决方案1
最直接的办法就是删除保存在文件夹```/var/lib/mysql```下的内容重新安装。


- 卸载旧的mysql：
	
	```
	sudo sysytemctl stop mysql
	sudo apt purge mysql-*
	```
- 删除数据库文件
	```
	cd /var/lib
	sudo rm -rf mysql
	```
-  安装
	此时安装就会恢复正常
	```
	sudo dpkg -i mysql-apt-config_0.8.17-1_all.deb # 版本号可能不同
	sudo apt update
	sudo apt install mysql-server
	```
### 解决方案2
如果不是不得已推荐解决方案1，解决方案2的思路可行但是博主并未在自己机器上验证
解决方案2的思路是采用临时的账户密码登录，然后更改root密码，临时账户的密码存储在`/etc/mysql/debian.cnf`文件中：

	```
	mysql  -u debian-sys-maint -p
	# enter 后输入文件中显示的密码
	mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass';
	mysql> FLUSH PRIVILEGES
	mysql> exit;
	sudo systemctl restart mysql
	```

之后用新密码登陆， 可以参考官方文档：[mysql 官方更改root密码教程](https://dev.mysql.com/doc/refman/8.0/en/resetting-permissions.html)。如果解决方案2提示没有权限，可以使用官方的方法直接更改root密码，强烈建议直接用解决方案一。需要注意的是mysql8.0 出于安全考虑废弃了password()函数，旧的更改root密码的方法很多都不再适用。