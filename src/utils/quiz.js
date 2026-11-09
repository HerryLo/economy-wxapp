/**
 * 配对挑战的组局逻辑：随机抽词、打乱左右两列
 */

export function shuffle(list, rng = Math.random) {
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr
}

export function buildQuizRound(termList, count = 4, rng = Math.random) {
  const safeCount = Math.max(0, Math.min(count, termList.length))
  const picked = shuffle(termList, rng).slice(0, safeCount)
  const pairs = picked.map((item) => ({
    id: item.id,
    term: item.term,
    summary: item.summary,
  }))

  return {
    pairs,
    leftItems: pairs.map((item) => ({
      id: item.id,
      term: item.term,
      matched: false,
    })),
    rightItems: shuffle(pairs, rng).map((item) => ({
      id: item.id,
      summary: item.summary,
      matched: false,
    })),
  }
}
