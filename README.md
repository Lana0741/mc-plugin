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
- [x] 使用群昵称（群名片）转发到服务器，便于整合包按名字显示头像
- [x] 机器人自身消息屏蔽（避免消息被回传导致服务器里重复显示）
- [x] 使用 [@kitUIN/ChatImage](https://github.com/kitUIN/ChatImage) 在游戏内显示图片

## 使用群昵称转发

部分整合包会根据聊天消息里的名字去匹配游戏 ID，从而显示玩家头像。此时应该使用
群昵称（群名片）而不是 QQ 昵称：

| 配置项 | 默认 | 说明 |
| :--- | :--- | :--- |
| `mc_qq_use_group_card` | `true` | 转发到服务器时用群昵称代替 QQ 昵称 |

例如群昵称为 `Babatos2007`（与游戏内 ID 相同），则游戏内显示 `Babatos2007 说： test`，
整合包即可匹配到游戏 ID 并显示头像。

群昵称为空时自动退回 QQ 昵称，再退回 QQ 号；关闭该开关则恢复为使用 QQ 昵称。

## 机器人自身消息屏蔽

玩家在 MC 里发言，会被鹊桥推给机器人，机器人再把这条消息发到 QQ 群。
但机器人自己发到群里的这条消息，又会被本插件当成普通群聊转发回 MC，
于是服务器里同一条消息显示两次（玩家原话 + 机器人重传）。

插件在把群消息发回 MC 之前会做一次判定，同时满足下面两点就直接跳过：

1. **这条群消息是机器人自己发的**（`e.self_id === e.user_id`）
2. **消息内容含有「连接词」（`mc_qq_say_way`）或自定义关键词**

| 配置项 | 默认 | 说明 |
| :--- | :--- | :--- |
| `mc_qq_self_message_enable` | `true` | 总开关 |
| `mc_qq_self_message_require_keyword` | `true` | 是否要求消息含连接词/关键词；关闭后机器人发的任何消息都不回传 |
| `mc_qq_self_message_keywords` | `[达成了进度]` | 自定义关键词，除连接词外命中也跳过 |
| `mc_qq_skip_self_message`（每个服务器） | `true` | 单个服务器是否启用该屏蔽 |

> [!NOTE]
> 真人发的消息（`e.self_id` 与 `e.user_id` 不同）永远不会被这条规则影响，
> 即使内容里恰好带有「连接词」也照常传回服务器。

### 排障

如果服务器里仍然出现两条消息，请打开「调试模式」，观察日志：

- 出现 `机器人自身消息，不传回服务器: ...` → 屏蔽已生效。
- 出现 `群聊将传回服务器 (user_id=... self_id=... card=...)` → 说明这条消息没被识别为机器人自己发的，
  请把日志里的 `user_id` 与 `self_id` 贴出来反馈。

## 常见问题

1. 什么环境才能使用本插件？
   - 需要机器人所在服务器和 Minecraft 服务器任意一个可以被另一个访问（在同一内网或至少其中一个有公网）
2. 支持哪些服务端？
   - `Spigot端`，`Velocity端`，`Fabric端`，`Forge端`，`NeoForge` 均支持

## 支持与贡献

如果你喜欢这个项目，请不妨点个 Star🌟，这是对开发者最大的动力， 当然，你可以对我 [爱发电](https://afdian.net/a/sumoqi) 赞助，呜咪~❤️

有意见或者建议也欢迎提交 [Issues](https://github.com/CikeyQi/mc-plugin/issues) 和 [Pull requests](https://github.com/CikeyQi/mc-plugin/pulls)。

## 相关项目

- [nonebot-plugin-mcqq](https://github.com/17TheWord/nonebot-plugin-mcqq)：基于 NoneBot 的与 Minecraft Server 互通消息的插件

## 许可证

本项目使用 [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) 作为开源许可证。