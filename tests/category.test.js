import { describe, expect, it } from 'vitest'
import { terms } from '../src/data/terms.js'
import { categoryEmoji, getRelatedTerms, allCategories } from '../src/utils/category.js'

describe('categoryEmoji', () => {
  it('已知分类返回对应 emoji', () => {
    expect(categoryEmoji('宏观经济')).toBe('📊')
    expect(categoryEmoji('货币政策')).toBe('🏦')
    expect(categoryEmoji('金融投资')).toBe('📈')
    expect(categoryEmoji('贸易')).toBe('🌐')
    expect(categoryEmoji('民生')).toBe('🏠')
    expect(categoryEmoji('政府报告')).toBe('📋')
  })

  it('未知分类返回默认 💡', () => {
    expect(categoryEmoji('外星人')).toBe('💡')
    expect(categoryEmoji('')).toBe('💡')
    expect(categoryEmoji(null)).toBe('💡')
    expect(categoryEmoji(undefined)).toBe('💡')
  })

  it('所有词条的分类都有对应 emoji（或走默认）', () => {
    terms.forEach((t) => {
      expect(categoryEmoji(t.category)).toBeTruthy()
    })
  })
})

describe('allCategories', () => {
  it('返回已定义的 6 个分类', () => {
    const cats = allCategories()
    expect(cats).toHaveLength(6)
    expect(cats).toContain('宏观经济')
    expect(cats).toContain('货币政策')
    expect(cats).toContain('金融投资')
    expect(cats).toContain('贸易')
    expect(cats).toContain('民生')
    expect(cats).toContain('政府报告')
  })
})

describe('getRelatedTerms', () => {
  const gdp = terms.find((t) => t.id === 'gdp')
  const cpi = terms.find((t) => t.id === 'cpi')

  it('返回同分类且排除自己的词条', () => {
    const related = getRelatedTerms(terms, gdp.id, gdp.category, 3)
    expect(related.every((t) => t.category === gdp.category)).toBe(true)
    expect(related.every((t) => t.id !== gdp.id)).toBe(true)
    expect(related.some((t) => t.id === gdp.id)).toBe(false)
  })

  it('默认最多返回 3 条', () => {
    const related = getRelatedTerms(terms, gdp.id, gdp.category, 3)
    expect(related.length).toBeLessThanOrEqual(3)
  })

  it('可以自定义 limit', () => {
    const related = getRelatedTerms(terms, gdp.id, gdp.category, 2)
    expect(related.length).toBeLessThanOrEqual(2)
  })

  it('limit 为 0 或负数时返回空数组', () => {
    expect(getRelatedTerms(terms, gdp.id, gdp.category, 0)).toEqual([])
    expect(getRelatedTerms(terms, gdp.id, gdp.category, -1)).toEqual([])
  })

  it('currentId 为空时返回空数组', () => {
    expect(getRelatedTerms(terms, '', '宏观经济', 3)).toEqual([])
    expect(getRelatedTerms(terms, null, '宏观经济', 3)).toEqual([])
  })

  it('currentCat 为空时返回空数组', () => {
    expect(getRelatedTerms(terms, gdp.id, '', 3)).toEqual([])
    expect(getRelatedTerms(terms, gdp.id, null, 3)).toEqual([])
  })

  it('allTerms 不是数组时返回空数组', () => {
    expect(getRelatedTerms(null, gdp.id, gdp.category, 3)).toEqual([])
    expect(getRelatedTerms(undefined, gdp.id, gdp.category, 3)).toEqual([])
  })

  it('全部词条为同一条时返回空（排除自己后没了）', () => {
    const onlyOne = [{ id: 'only', category: '宏观经济' }]
    expect(getRelatedTerms(onlyOne, 'only', '宏观经济', 3)).toEqual([])
  })

  it('同分类词条数量少于 limit 时返回全部', () => {
    const smallList = [
      { id: 'a', category: '宏观经济' },
      { id: 'b', category: '宏观经济' },
      { id: 'c', category: '货币政策' },
    ]
    const related = getRelatedTerms(smallList, 'a', '宏观经济', 10)
    expect(related).toHaveLength(1) // 只有 b
    expect(related[0].id).toBe('b')
  })

  it('不修改原数组顺序', () => {
    const copy = [...terms]
    getRelatedTerms(terms, gdp.id, gdp.category, 3)
    // 原数组不应被改变
    expect(terms.length).toBe(copy.length)
  })

  it('CPI 相关词条确实属于宏观经济', () => {
    const related = getRelatedTerms(terms, cpi.id, cpi.category, 3)
    expect(related.length).toBeGreaterThan(0)
    expect(related.every((t) => t.category === '宏观经济')).toBe(true)
  })
})
