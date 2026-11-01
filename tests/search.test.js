import { describe, expect, it } from 'vitest'
import { categories, terms } from '../src/data/terms.js'
import { filterTerms, matchesKeyword, normalize } from '../src/utils/search.js'

describe('normalize', () => {
  it('去空格并转小写', () => {
    expect(normalize('  GDP ')).toBe('gdp')
  })

  it('空值返回空字符串', () => {
    expect(normalize()).toBe('')
    expect(normalize(null)).toBe('')
  })
})

describe('matchesKeyword', () => {
  const inflation = terms.find((item) => item.id === 'inflation')

  it('空关键字匹配所有词条', () => {
    expect(matchesKeyword(inflation, '')).toBe(true)
    expect(matchesKeyword(inflation, '   ')).toBe(true)
  })

  it('可以按中文常用名匹配', () => {
    expect(matchesKeyword(inflation, '通胀')).toBe(true)
  })

  it('可以按别名匹配', () => {
    expect(matchesKeyword(inflation, '通货膨胀')).toBe(true)
  })

  it('可以按英文匹配且不区分大小写', () => {
    expect(matchesKeyword(inflation, 'INFLATION')).toBe(true)
  })

  it('可以按一句话定义匹配', () => {
    expect(matchesKeyword(inflation, '购买力')).toBe(true)
  })

  it('不相关关键字不匹配', () => {
    expect(matchesKeyword(inflation, '牛市')).toBe(false)
  })
})

describe('filterTerms', () => {
  it('空关键字返回全部词条', () => {
    expect(filterTerms(terms, '', '全部')).toHaveLength(terms.length)
  })

  it('可以按分类筛选', () => {
    const result = filterTerms(terms, '', '贸易')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((item) => item.category === '贸易')).toBe(true)
  })

  it('关键字和分类可以组合筛选', () => {
    const result = filterTerms(terms, '汇率', '金融投资')
    expect(result.some((item) => item.id === 'exchange-rate')).toBe(true)
    expect(result.every((item) => item.category === '金融投资')).toBe(true)
  })

  it('没有结果时返回空数组', () => {
    expect(filterTerms(terms, '不存在的词', '全部')).toHaveLength(0)
  })

  it('分类配置与词条分类一致', () => {
    const used = new Set(terms.map((item) => item.category))
    used.forEach((category) => expect(categories).toContain(category))
  })

  it('政府报告分类包含报告高频词', () => {
    const result = filterTerms(terms, '', '政府报告')
    expect(result.length).toBeGreaterThan(20)
    expect(result.some((item) => item.id === 'fiscal-deficit-ratio')).toBe(true)
  })

  it('CPI 可以用官方全称搜到', () => {
    const result = filterTerms(terms, '居民消费价格指数', '全部')
    expect(result.some((item) => item.id === 'cpi')).toBe(true)
  })

  it('词条 id 唯一且必填字段完整', () => {
    const ids = terms.map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
    terms.forEach((item) => {
      expect(item.term).toBeTruthy()
      expect(item.en).toBeTruthy()
      expect(item.category).toBeTruthy()
      expect(item.summary).toBeTruthy()
      expect(item.plain).toBeTruthy()
      expect(item.example).toBeTruthy()
    })
  })
})
