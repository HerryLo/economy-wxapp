export function normalize(value) {
  return String(value == null ? '' : value).trim().toLowerCase()
}

function searchableFields(term) {
  return [term.term, term.en, term.summary, term.plain, term.example, ...(term.aliases || [])]
}

export function matchesKeyword(term, keyword) {
  const kw = normalize(keyword)
  if (!kw) {
    return true
  }
  return searchableFields(term).some((field) => normalize(field).includes(kw))
}

export function filterTerms(list, keyword, category) {
  return list.filter((term) => {
    if (category && category !== '全部' && term.category !== category) {
      return false
    }
    return matchesKeyword(term, keyword)
  })
}
