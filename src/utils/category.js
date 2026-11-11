/**
 * 分类 → emoji 映射，用于首页卡片和详情页相关词条
 */
const EMOJI_MAP = {
  宏观经济: '📊',
  货币政策: '🏦',
  金融投资: '📈',
  贸易: '🌐',
  民生: '🏠',
  政府报告: '📋',
}

export function categoryEmoji(cat) {
  return EMOJI_MAP[cat] || '💡'
}

/**
 * 从全部词条中找出与指定词条同分类的推荐项
 * @param {Array} allTerms 全部词条数组
 * @param {string} currentId 当前词条 id
 * @param {string} currentCat 当前词条分类
 * @param {number} limit 最多返回几条
 * @returns {Array}
 */
export function getRelatedTerms(allTerms, currentId, currentCat, limit = 3) {
  if (!currentId || !currentCat || !Array.isArray(allTerms)) return []
  if (!limit || limit <= 0) return []
  const sameCat = allTerms.filter(
    (t) => t.category === currentCat && t.id !== currentId
  )
  const shuffled = [...sameCat].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, limit)
}

/**
 * 获取全部已定义的分类
 */
export function allCategories() {
  return Object.keys(EMOJI_MAP)
}
