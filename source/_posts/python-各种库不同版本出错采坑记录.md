---
title: python 各种库不同版本出错采坑记录
date: 2021-07-12 12:27:11
tags:
  - python
  - 依赖
---

# python 各种库不同版本出错采坑记录

半年来断断续续遇到不少不同版本的python库导致程序出错的问题，此篇文章作为简单记录。

## xlrd和xlwt

xlrd和xlwd 的新版本取消了对.xlxs后缀的Excel文件的支持，最近支持的版本为xlrd==1.2.0 xlwt==1.3.0

## Gym

Gym 版本创建新环境的j接口更改了，0.18.0和0.10.5 版本有所不同

## pygame

Deepmind 的 pysc2 依赖pygame pygame==1.9.6 对于2.0.1会报错`   pygame.display.flip() pygame.error: Unable to make GL context current`