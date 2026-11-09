import { describe, expect, it } from 'vitest'
import { terms } from '../src/data/terms.js'
import { buildQuizRound, shuffle } from '../src/utils/quiz.js'

describe('shuffle', () => {
  it('保留全部元素且不修改原数组', () => {
    const source = [1, 2, 3, 4]
    const result = shuffle(source, () => 0.5)

    expect(result).toHaveLength(4)
    expect([...result].sort()).toEqual([1, 2, 3, 4])
    expect(source).toEqual([1, 2, 3, 4])
  })
})

describe('buildQuizRound', () => {
  it('生成 4 组配对', () => {
    const round = buildQuizRound(terms, 4)

    expect(round.pairs).toHaveLength(4)
    expect(round.leftItems).toHaveLength(4)
    expect(round.rightItems).toHaveLength(4)
  })

  it('左右两列 id 与配对一致且不重复', () => {
    const round = buildQuizRound(terms, 4)
    const pairIds = round.pairs.map((item) => item.id).sort()

    expect(pairIds).toEqual(round.leftItems.map((item) => item.id).sort())
    expect(pairIds).toEqual(round.rightItems.map((item) => item.id).sort())
    expect(new Set(pairIds).size).toBe(4)
  })

  it('左侧是术语，右侧是解释', () => {
    const round = buildQuizRound(terms, 4)

    expect(round.leftItems.every((item) => item.term && !item.summary)).toBe(true)
    expect(round.rightItems.every((item) => item.summary && !item.term)).toBe(true)
  })

  it('词条数量不足时不会超量', () => {
    const round = buildQuizRound(terms.slice(0, 2), 4)

    expect(round.pairs).toHaveLength(2)
    expect(round.leftItems).toHaveLength(2)
    expect(round.rightItems).toHaveLength(2)
  })

  it('每组初始都未配对', () => {
    const round = buildQuizRound(terms, 4)

    expect(round.leftItems.every((item) => item.matched === false)).toBe(true)
    expect(round.rightItems.every((item) => item.matched === false)).toBe(true)
  })
})
