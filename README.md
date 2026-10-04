![mc-plugin](https://socialify.git.ci/CikeyQi/mc-plugin/image?description=1&font=Raleway&forks=1&issues=1&language=1&name=1&owner=1&pattern=Circuit%20Board&pulls=1&stargazers=1&theme=Auto)

<img decoding="async" align=right src="resources/readme/girl.png" width="35%">

# MC-PLUGIN🍐

- 一个适用于 [Yunzai 系列机器人框架](https://github.com/yhArcadia/Yunzai-Bot-plugins-index) 的 Minecraft Server 消息互通插件

- 移植于 17TheWord 大佬的 [nonebot-plugin-mcqq](https://github.com/17TheWord/nonebot-plugin-mcqq)，在使用 Nonebot 的同学请传送

- **使用中遇到问题请加 QQ 群咨询：[707331865](https://qm.qq.com/q/TXTIS9KhO2)**

> [!TIP]
> 群里开了个 Minecraft 服务器，发现一个很好的消息互通插件，就是 17TheWord 大佬的 [nonebot-plugin-mcqq](https://github.com/17TheWord/nonebot-plugin-mcqq)，但发现 Yunzai 没有，于是把插件移植了过来

## 安装插件

#### 1. 克隆仓库

```
git clone https://github.com/CikeyQi/mc-plugin.git ./plugins/mc-plugin
```

> [!NOTE]
> 如果你的网络环境较差，无法连接到 Github，可以使用 [GitHub Proxy](https://ghproxy.link/) 提供的文件代理加速下载服务

#### 2. 安装依赖

```
pnpm install --filter=mc-plugin
```

## 插件配置

> [!WARNING]
> 非常不建议手动修改配置文件，本插件已兼容 [Guoba-plugin](https://github.com/guoba-yunzai/guoba-plugin) ，请使用锅巴插件对配置项进行修改

- 请查看文档：[Wiki](https://github.com/CikeyQi/mc-plugin/wiki)，请按照 Wiki 中的说明进行配置

## 功能列表

请使用 `#mc帮助` 获取完整帮助

- [x] 玩家加入 / 离开服务器消息
- [x] 玩家聊天信息发送到群内
- [x] 玩家死亡信息
- [x] 群内使用指令
- [x] 群员聊天文本发送到服务器
- [x] 特殊消息支持
- [x] 多服务器连接
- [x] 断线自动重连
- [x] 正向 / 反向 WebSocket 连接
- [x] 服务器消息屏蔽（避免机器人自己发的消息被原样传回服务器）
- [x] 使用 [@kitUIN/ChatImage](https://github.com/kitUIN/ChatImage) 在游戏内显示图片

## 服务器消息屏蔽

群消息转发到 MC 后，鹊桥会以广播形式再发一遍，服务器又会把这条广播当作聊天事件回传，
于是同一条消息会在群里显示两次（自己发的 + 机器人重传的）。

插件在把 MC 消息转发到群之前会做一次屏蔽判定，命中规则的消息直接丢弃：

| 配置项 | 默认 | 说明 |
| :--- | :--- | :--- |
| `mc_qq_block_enable` | `true` | 总开关，关闭后所有屏蔽规则失效 |
| `mc_qq_block_say_way` | `true` | 屏蔽机器人自己转发的消息，判定依据是上方「连接词」（`mc_qq_say_way`） |
| `mc_qq_block_words` | `[达成了进度]` | 自定义屏蔽词，消息中含有任一词就不转发；默认项可自行删除或追加 |

判定优先看事件正文（`message` 字段）：机器人转发到 MC 的正文固定是「连接词 + 内容」，
回传时该字段同样以连接词开头，因此不会误伤真人聊天。若某些服务端不返回 `message` 字段，
再退回「玩家名 + 连接词 + 内容」的文本结构判定。

> [!NOTE]
> 由于 `broadcast` 是服务端广播接口，`PlayerChatEvent` 事件里不携带发送者身份，
> 插件无法按「消息作者是不是机器人」精确判定，只能依据上述内容特征来识别。

## 常见问题

1. 什么环境才能使用本插件？
   - 需要机器人所在服务器和 Minecraft 服务器任意一个可以被另一个访问（在同一内网或至少其中一个有公网）
2. 支持哪些服务端？
   - `Spigot端`，`Velocity端`，`Fabric端`，`Forge端`，`NeoForge` 均支持
3. 群里同一条消息显示两次怎么办？
   - 见上方「服务器消息屏蔽」。该功能默认开启，若已被手动关闭，请把「启用消息屏蔽」与「屏蔽连接词」重新打开

## 支持与贡献

如果你喜欢这个项目，请不妨点个 Star🌟，这是对开发者最大的动力， 当然，你可以对我 [爱发电](https://afdian.net/a/sumoqi) 赞助，呜咪~❤️

有意见或者建议也欢迎提交 [Issues](https://github.com/CikeyQi/mc-plugin/issues) 和 [Pull requests](https://github.com/CikeyQi/mc-plugin/pulls)。

## 相关项目

- [nonebot-plugin-mcqq](https://github.com/17TheWord/nonebot-plugin-mcqq)：基于 NoneBot 的与 Minecraft Server 互通消息的插件

## 许可证

本项目使用 [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) 作为开源许可证。