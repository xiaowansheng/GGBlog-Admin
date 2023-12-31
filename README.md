# 关于GGBlog-Admin

## 介绍

此项目是 `GGBlog`博客项目的管理后台项目，项目具体介绍信息可前往[GGBlog仓库](https://github.com/xiaowansheng/GGBlog )查看。



## 相关项目仓库

**后端服务器仓库：**

[GGBlog-Server](https://github.com/xiaowansheng/GGBlog )

**后台管理仓库：**

[GGBlog-Admin](https://github.com/xiaowansheng/GGBlog-Admin)

**前台系统仓库：**

[GGBlog-Main](https://github.com/xiaowansheng/GGBlog-Main)

## 主要依赖信息

| 依赖            | 版本   |
| --------------- | ------ |
| Vue             | 3.3.4  |
| Pinia           | 2.1.4  |
| Vue-Router      | 4.2.2  |
| Axios           | 1.4.0  |
| Element-plus    | 2.3.12 |
| Cherry-Markdown | 0.8.25 |
| Echarts         | 4.6.0  |



# 功能设计

### 主要功能设计如下（除此以外还有其他功能正在开发）

- **主页**

    - **欢迎页**

    展示每日一句好词好句

    快捷跳转前台页面和Github页面

    - **数据统计**

    统计当前时刻的文章、分类、标签和说说的数量。

    可视化展示最近30天的文章和说说发布数量的柱状图和折线图。

    可视化展示所有的分类的文章数量柱状图和饼图数据。

    动画展示所有标签信息。

- **文章管理**

    - **文章发布与编辑**

    markdown编辑器编辑文章信息，引入了各种数学公式和图表绘制依赖，由于使用的是开源的 CherryMarkdown ，还支持 draw.io 进行图形编辑。发布文章时，支持动态添加分类和标签信息。

    支持草稿保存，支持文章置顶和隐私设置。

    - **文章列表**

    分页展示文章列表信息，可对文章基本信息进行编辑修改。

    - **文章分类**

    展示文章分类信息，统计分类的文章数目，可进行隐私设置。

    - **文章标签**

    展示标签信息，统计标签的文章数量。

- **说说日志**

    - **发布说说**

    可以进行说说的编辑与发布，自定义了个性表情包，点击即可插入，可以添加说说图片信息，可以设置置顶和隐私设置。

    - **说说列表**

    参考了QQ空间的说说样式，展示了说说的内容和图片信息。

    此外还添加了发布者的ip归属地展示，以及设备信息和浏览器信息展示。

- **个人相册**

    - **相册列表**

    可以添加和编辑相册信息，可视化展示相册列表，可进行隐私设置。

    - **相册照片**

    相册照片，展示图片列表信息，可进行隐私设置。

- **消息管理**

    - **评论消息**

    展示文章和评论等内容的评论信息，以及其他详细信息，可以对评论内容进行审核、隐藏等操作。

    - **留言消息**

    展示系统留言信息，以及其他信息内容，可以进行审核、隐藏等操作。

- **用户管理**

    - **用户列表**

    查看系统内注册的用户详细的信息，可以对用户进行授权和禁用的操作。

    - **登录日志**

    展示最近用户登录系统的最新日志记录。

- **权限管理**

    - **角色管理**

    用户权限来自于角色，可以添加、编辑和禁用角色信息。

    可以对于角色授予菜单和资源的访问权限，未授权的菜单不予展示，未授权的资源接口不允许用户访问。

    - **菜单管理**

    添加和编辑后台管理页面的菜单，更方便的展示和处理菜单信息。

    后台的菜单列表来自于角色的菜单权限。

    - **资源管理**

    添加和编辑资源的信息，可以添加资源模块，在模块中添加资源列表。

    资源列表是系统中的一些资源信息接口，即各种api信息。

- **系统设置**

    - **前台主页背景**

    可以添加和编辑前台主页各种页面的背景图片配置，动态改变前台背景样式。

    - **作者信息**

        - **基本信息**

      编辑网站作者的基本信息，如昵称和头像等，用于前台主页展示，也用于说说列表的作者展示，也用于个人友链时的信息展示。

        - **社交信息**

      编辑和添加作者的社交联系方式，用于在前台主页展示作者联系方式，更方便其他用户了解作者的个人信息和状态。

    - **网站信息**

    可以设置网站基本信息，用于网站前台主页展示，如网站运行时间，网站标题，链接，以及设置备案信息等。

    - **友链管理**

    展示友情链接列表，可以添加其他用户的友链信息，用户也可以在前台添加友链。

    用于前台页面展示作者的各种友情链接，关联各个朋友的网站。

    - **系统配置**

        - **组件模块设置**

      自定义开启和关闭前台系统的组件展示，如评论模块，登录模块，注册模块，通知，聊天室等。

        - **第三方登录配置**

      启用和关闭的第三方登录配置，全部关闭即只能用邮箱登录。

        - **通知配置**

      用于系统的相关信息的通知，如用户注册同志，登录通知，评论通知，留言通知。

      也用于给用户通知注册信息，验证码信息，回复信息等。

        - **隐私和安全配置**

      自定义开启和关闭前台系统的ip来源，设备和浏览器等信息的展示。

        - **默认头像配置**

      用户设置系统默认的一些图片信息，如默认用户头像、游客头像等。

        - **打赏信息配置**

      可以添加自定义的微信和支付宝收款码，用户前台文章信息末尾展示，让访客可以对于文章进行打赏和赞助等，也可以关闭。

    - **关于作者**

    编辑和发布关于作者信息，用户前台页面 **关于作者** 展示。

    编辑的样式和信息是 markdown 格式。

- **日志管理**

    - **操作日志**

    记录了系统的一些基本的操作日志信息，如添加、修改和删除的记录日志，其中包含了操作类型，操作描述以及设备等相关信息。

    不记录查询操作。

    - **异常日志**

    记录系统错误日志，在执行操作时，出现异常即会添加相关记录信息，如异常名称，异常的详细信息，设备等信息。

- **个人中心**

    - **个人信息**

    展示和修改当前登录用户基本信息。

    - **修改密码**

    可以修改当前用户的个人密码。

### 部分效果图

![login](/example/images/login.png)

![home](/example/images/huanyingye.png)

![analysis](/example/images/analysis.png)

![markdown-editor](/example/images/markdown-edit.png)

![drawio](/example/images/drawio.png)

![](/example/images/article-list.png)

![talk-editor](/example/images/talk.png)

![talk-emoji](/example/images/talk-emoji.png)

![talk-list](/example/images/talk-list.png)

![comment](/example/images/comment.png)

![album](/example/images/album.png)

![pictures](/example/images/pictures.png)

![user](/example/images/user-list.png)

![login-log](/example/images/login-log.png)

![role](/example/images/role.png)

![user-menu](/example/images/role-menu.png)

![role-resource](/example/images/role-resource.png)

![main-page-cover](/example/images/main-page-cover.png)

![website-info](/example/images/website-info.png)

![confog](/example/images/config.png)

![operation-log](/example/images/operation-log.png)

![error-log](/example/images/error-log.png)

![person-center](/example/images/person-center.png)
