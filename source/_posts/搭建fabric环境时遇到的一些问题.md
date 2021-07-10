---
title: 搭建fabric环境时遇到的一些问题
date: 2021-07-10 14:31:42
tags:
  - fabric
---

# 搭建fabric环境时遇到的一些问题

## Docker 镜像下载慢的问题
搭建fabric环境一般要用到docker容器，我们经常会遇到国内开发者都会遇到的一个问题，100多M的一个小镜像要下载一个多小时怎么办？？我采用了DaoCloud团队提供的Docker Hub Mirror，你们可以搜索一下DaoCloud的官网，进入官网让后注册登录，首页选择更多-->加速器，每个人会生成一个独一无二的镜像地址你只要在/etc/docker/daemon.json文件中（我使用的是Ubuntu16.04，其他平台DaoCloud官网也有对应的教程）添加如下的代码就可以了。

```
{
    "registry-mirrors": [
        "加速地址"
    ],
    "insecure-registries": []
}
```
官网还提供了一个脚本你可以直接在shell里执行：

```
curl -sSL https://get.daocloud.io/daotools/set_mirror.sh | sh -s http://xxxxxxxx.x.daocloud.io(替换自己的url)
```
## fetchMetadata: sill mapToRegistry uri https://registry.n
这是我遇到的第二个问题，装fabric的时候要下载grpc 像我用的是nodejs，就要执行npm install grpc --global 但是registry.n一直没法连，用了vpn也没用。解决办法：将npm的官方库换成淘宝镜像库代码如下：

```
npm config set registry https://registry.npm.taobao.org
```
你可以通过如下代码验证

```
bobo@Lenovo:~$ npm config get registry
https://registry.npm.taobao.org/
bobo@Lenovo:~$ 
```
## return process.dlopen(module, path._makeLong(filename));

这是我一开始执行 ./runApp.sh 后出现的错误，原因可能是我刚开始用的nodejs版本不对，新版本换成旧版本后node模块没有更换，解决方法：去 [https://nodejs.org/en/download/releases/](https://nodejs.org/en/download/releases/) 下载6.1x等满足条件的nodejs版本，然后在 ./blockchain/fabric-samples/balance-transfer目录下执行

```
rm -rf node-modules
npm update 
```
这个方法来着于stackoverflow 原链接[https://stackoverflow.com/questions/35568243/return-process-dlopenmodule-path-makelongfilename](https://stackoverflow.com/questions/35568243/return-process-dlopenmodule-path-makelongfilename)

#补充 装grpc需要的依赖
这点来自grpc的官网我没有验证，gprc的安装说明 [https://github.com/grpc/grpc/blob/master/INSTALL.md](https://github.com/grpc/grpc/blob/master/INSTALL.md)
。linux下

```shell
 $: sudo apt-get install build-essential autoconf libtool
 $: sudo apt-get install libgflags-dev libgtest-dev
 $: sudo apt-get install clang libc++-dev
```