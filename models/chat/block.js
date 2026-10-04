const textOf = (value) => String(value ?? '').trim()

const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

/**
 * 取出消息开头的标签前缀（例如 `[Server1] [MC群] `），返回剩余正文。
 *
 * @param {string} text
 * @returns {string}
 */
const stripLeadingTags = (text) => {
  let match = String(text ?? '').match(/^(?:\s*\[[^\]]*\]\s*)+/)
  return text.slice(match ? match[0].length : 0)
}

/**
 * 连接词是否出现在「玩家名 连接词 内容」这一位置上（文本结构兜底判定）。
 *
 * 机器人转发到 MC 的内容形态固定为「玩家名 连接词 内容」：玩家名不含空白，
 * 连接词后面跟着一个空格再接正文。因此逐个连接词出现位置去匹配这个形态，
 * 只有确实构成该形态的才判定为回传消息。
 *
 * @param {string} text 已格式化的消息文本
 * @param {string} sayWord 连接词
 * @returns {boolean}
 */
const hitSayWay = (text, sayWord) => {
  if (!sayWord) return false

  let target = String(text ?? '')
  let splitIndex = target.indexOf(sayWord)

  while (splitIndex !== -1) {
    let nameToken = stripLeadingTags(target.slice(0, splitIndex)).trim()
    let afterWord = target.slice(splitIndex + sayWord.length)

    if (nameToken && !/\s/.test(nameToken) && /^\s/.test(afterWord)) {
      return true
    }

    splitIndex = target.indexOf(sayWord, splitIndex + 1)
  }

  return false
}

/**
 * 事件里是否带有聊天正文（多数服务端都会给）。
 *
 * @param {Record<string, any>} eventData
 * @returns {boolean}
 */
const hasMessageField = (eventData) => {
  return isRecord(eventData) && Object.prototype.hasOwnProperty.call(eventData, 'message')
}

/**
 * 判断这条聊天事件是否应被「连接词」屏蔽。
 *
 * 事件正文优先：机器人转发到 MC 的正文固定为「连接词 内容」，回传时
 * eventData.message 同样以连接词开头，这一判定最准确，不会误杀真人聊天。
 * 若事件没有正文（例如服务端只给了 raw_message），再退回文本结构判定。
 *
 * @param {string} messageText 已格式化的消息文本
 * @param {string} sayWord 连接词
 * @param {Record<string, any>} [eventData] 原始事件数据
 * @returns {boolean}
 */
const hitBlockSayWay = (messageText, sayWord, eventData = null) => {
  if (!sayWord) return false

  if (hasMessageField(eventData)) {
    return textOf(eventData.message).startsWith(sayWord)
  }

  return hitSayWay(messageText, sayWord)
}

const toWordList = (value) => {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => textOf(item))
    .filter(Boolean)
    .filter((item, index, list) => list.indexOf(item) === index)
}

/**
 * 判断一条入站消息是否应被屏蔽（不转发到群）。
 *
 * 屏蔽原因：群消息转发到 MC 后，鹊桥会以广播形式再发一遍，
 * 服务器事件又把这条广播作为 message 事件回传，导致同一条消息在群内出现两次。
 *
 * @param {string} messageText 已格式化的消息文本
 * @param {Record<string, any>} config 全局配置
 * @param {Record<string, any>} [eventData] 原始事件数据，用于更精确的判定
 * @returns {{ blocked: boolean, word: string }}
 */
const checkBlocked = (messageText, config, eventData = null) => {
  let text = String(messageText ?? '')
  if (!text) return { blocked: false, word: '' }

  if (!config?.mc_qq_block_enable) return { blocked: false, word: '' }

  let sayWord = config.mc_qq_block_say_way ? textOf(config.mc_qq_say_way) : ''
  if (hitBlockSayWay(text, sayWord, eventData)) {
    return { blocked: true, word: sayWord }
  }

  for (let word of toWordList(config.mc_qq_block_words)) {
    if (text.includes(word)) {
      return { blocked: true, word }
    }
  }

  return { blocked: false, word: '' }
}

export { checkBlocked, hitSayWay, hitBlockSayWay, stripLeadingTags }
