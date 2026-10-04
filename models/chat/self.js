const textOf = (value) => String(value ?? '').trim()

const toWordList = (value) => {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => textOf(item))
    .filter(Boolean)
    .filter((item, index, list) => list.indexOf(item) === index)
}

/**
 * 这条群消息是不是机器人自己发的。
 *
 * QQ 消息事件的 user_id 是发送者，self_id 是收到该事件的机器人账号，
 * 机器人自己发到群里的消息两者相等。这里不要求事件里一定有 self_id，
 * 缺失时退化为「发送者就是 bot_self_id 中列出的账号」。
 *
 * @param {any} e 消息事件
 * @param {string[]} [allowedBots] 该服务器配置的机器人账号列表
 * @returns {boolean}
 */
const isSelfSender = (e, allowedBots = []) => {
  let userId = textOf(e?.user_id)
  if (!userId) return false

  if (Array.isArray(allowedBots) && allowedBots.length) {
    return allowedBots.includes(userId)
  }

  let selfId = textOf(e?.self_id)
  return Boolean(selfId) && selfId === userId
}

/**
 * 消息里是否含有连接词或自定义关键词。
 *
 * @param {any} e 消息事件
 * @param {Record<string, any>} config 全局配置
 * @returns {boolean}
 */
const matchSelfKeywords = (e, config) => {
  let text = String(e?.msg ?? '')
  if (!text) return false

  let sayWord = textOf(config?.mc_qq_say_way)
  if (sayWord && text.includes(sayWord)) return true

  return toWordList(config?.mc_qq_self_message_keywords).some((word) => text.includes(word))
}

/**
 * 判断这条群消息是否需要「跳过不回传服务器」。
 *
 * 背景：玩家在 MC 里发言 → 鹊桥推给机器人 → 机器人把消息发到 QQ 群。
 * 机器人自己发到群里的这条消息又会作为普通群聊被转发回 MC，
 * 于是服务器里同一条消息显示两次（玩家原话 + 机器人重传）。
 * 因此对「机器人自己发的、且内容含连接词或关键词」的消息不再回传。
 *
 * @param {any} e 消息事件
 * @param {Record<string, any>} serverItem 服务器配置
 * @param {Record<string, any>} config 全局配置
 * @returns {{ skip: boolean, reason: string }}
 */
const checkSelfMessage = (e, serverItem, config) => {
  if (!config?.mc_qq_self_message_enable) return { skip: false, reason: '' }
  if (serverItem?.mc_qq_skip_self_message === false) return { skip: false, reason: '' }

  if (!isSelfSender(e, toWordList(serverItem?.bot_self_id))) {
    return { skip: false, reason: '' }
  }

  if (config?.mc_qq_self_message_require_keyword !== false && !matchSelfKeywords(e, config)) {
    return { skip: false, reason: '' }
  }

  return { skip: true, reason: '机器人自身消息' }
}

export { checkSelfMessage, isSelfSender, matchSelfKeywords }
