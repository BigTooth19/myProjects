<<<<<<< HEAD
## 开发规范

1. 文件及目录命名参考已经创建好的
2. CSS命名除了公共的，建议加个人前缀，以防和他人的有冲突

> 开发时需要创建分支，在分支上开发自己的模块，每次开发的时候看下是不是在自己的分支上开发的，**切记不要在master分支上开发**

### 开发流程

创建并切换到分支

```
> git checkout -b [分支名,最好是自己的姓名拼音全称，如：zhangsan]
```

push到远程仓库

```
> git push orgin [分支名]
```

提交代码到自己的分支上

```
> git add .
> git commit -m [提交信息]
> git push origin [分支名]
```

切换到master分支拉取其他人的提交，如果先解决冲突，再合并自己的分支的提交

```
> git checkout master
> git pull
> git merge [分支名]
```

合并完后看下master分支上的运行效果

```
> git commit -m [合并提交信息]
> git push
```

最后再把master分支拉取的代码到自己的分支上，查看运行效果

```
> git  checkout [分支名]
> git merge master
```


### 附加介绍

查看分支

```
> git branch
```

删除分支

```
> git branch -d [分支名]
> git push origin --delete [分支名]
```

撤销本地修改

```
> git checkout -- [文件或目录]
```

暂存区->原本地 (add操作还原)

```
> git reset HEAD [文件或目录]
```

修改commit提交信息

```
> git commit --amend -m [新提交信息]
```

撤销本地commit提交

```
> git reset HEAD~ // 上一次提交
```
=======
## 使用技术vue+express+mongoose
需要安装mongdb
使用框架d2amin
>>>>>>> d98f285e38e63d96ce3c6ee64c1f5c762bbd25d6
