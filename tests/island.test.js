import { describe, expect, it } from 'vitest'
import { terms } from '../src/data/terms.js'
import { islandExamples } from '../src/data/islandExamples.js'
import { chapters } from '../src/data/islandChapters.js'

const termIds = new Set(terms.map((item) => item.id))

describe('islandExamples', () => {
  it('覆盖至少 40 个词条', () => {
    expect(Object.keys(islandExamples).length).toBeGreaterThanOrEqual(40)
  })

  it('每个示例都对应真实存在的词条 id', () => {
    Object.keys(islandExamples).forEach((id) => {
      expect(termIds.has(id)).toBe(true)
    })
  })

  it('每条示例都是非空字符串', () => {
    Object.values(islandExamples).forEach((text) => {
      expect(typeof text).toBe('string')
      expect(text.trim().length).toBeGreaterThan(20)
    })
  })
})

describe('islandChapters', () => {
  it('每个章节都有故事和关联词条', () => {
    expect(chapters.length).toBeGreaterThan(5)
    chapters.forEach((chapter) => {
      expect(chapter.story.length).toBeGreaterThan(0)
      expect(chapter.termIds.length).toBeGreaterThan(0)
    })
  })

  it('章节引用的词条都真实存在', () => {
    chapters.forEach((chapter) => {
      chapter.termIds.forEach((id) => {
        expect(termIds.has(id)).toBe(true)
      })
    })
  })
})
