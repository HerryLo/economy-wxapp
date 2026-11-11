<template>
  <view class="page">
    <view class="hero">
      <text class="hero-mark">ECON · 经济词典</text>
      <text class="hero-title">看懂经济词</text>
      <text class="hero-sub">用人话解释你每天听到的经济术语</text>

      <view class="search-box">
        <view class="search-icon"></view>
        <input
          v-model="keyword"
          class="search-input"
          type="text"
          confirm-type="search"
          placeholder="搜术语，比如 GDP、通胀、LPR"
          placeholder-class="search-placeholder"
        />
        <text v-if="keyword" class="search-clear" @tap="keyword = ''">✕</text>
      </view>

      <text class="hero-count">已收录 {{ termsCount }} 个常用词条 · 持续更新</text>

      <view v-if="!searching" class="hot-wrap">
        <text class="hot-label">🔥 热门搜索</text>
        <view class="hot-list">
          <view
            v-for="tag in hotKeywords"
            :key="tag.label"
            class="hot-tag"
            :class="{ 'hot-tag-top': tag.hot }"
            @tap="keyword = tag.label"
          >
            <text class="hot-emoji">{{ tag.emoji }}</text>
            <text class="hot-text">{{ tag.label }}</text>
            <text v-if="tag.hot" class="hot-badge">🔥</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="!searching" class="filter-bar">
      <scroll-view v-if="showSubjectRow" class="subject-scroll" scroll-x :show-scrollbar="false">
        <view class="subject-row">
          <view
            v-for="item in subjectList"
            :key="item"
            class="chip subject-chip"
            :class="{ active: subject === item }"
            @tap="subject = item"
          >
            <text class="chip-text">{{ item }}</text><text class="chip-count">{{ subjectCount(item) }}</text>
          </view>
        </view>
      </scroll-view>

      <view v-if="showCategoryRow" class="category-grid">
        <view
          v-for="item in categoryList"
          :key="item"
          class="chip"
          :class="{ active: category === item }"
          @tap="category = item"
        >
          <text class="chip-text">{{ item }}</text><text class="chip-count">{{ categoryCount(item) }}</text>
        </view>
      </view>
    </view>

    <view class="list">
      <view class="list-head">
        <text class="list-title">{{ listTitle }}</text>
        <text class="list-count">{{ visibleCount }} 个</text>
      </view>

      <view
        v-for="item in visibleTerms"
        :key="item.id"
        class="term-card"
        hover-class="term-card-hover"
        @tap="openTerm(item)"
      >
        <view class="term-head">
          <view class="term-name-row">
            <text class="term-emoji">{{ categoryEmoji(item.category) }}</text>
            <text class="term-name">{{ item.term }}</text>
          </view>
          <text class="term-cat">{{ termMeta(item) }}</text>
        </view>
        <text class="term-en">{{ item.en }}</text>
        <text class="term-summary">{{ item.summary }}</text>
        <text class="term-link">查看解释 →</text>
      </view>

      <view v-if="visibleCount === 0" class="empty">
        <text class="empty-title">没找到这个词</text>
        <text class="empty-desc">换个说法试试，比如「通胀」「利率」「关税」</text>
      </view>
    </view>

    <view class="footer">内容为通俗整理，仅供参考，不构成任何投资建议</view>
  </view>
</template>

<script>
import { defaultSubject, subjects, terms } from '../../data/terms.js'
import { filterTerms } from '../../utils/search.js'
import { categoryEmoji } from '../../utils/category.js'

export default {
  data() {
    return {
      keyword: '',
      subject: '全部',
      category: '全部',
      terms,
      subjects,
      termsCount: terms.length,
      subjectList: ['全部', ...subjects.map((item) => item.name)],
      multiSubject: subjects.length > 1,
      hotKeywords: [
        { label: 'GDP',    emoji: '📈', hot: true },
        { label: 'CPI',    emoji: '🛒', hot: true },
        { label: 'PPI',    emoji: '🏭', hot: true },
        { label: '通胀',   emoji: '🔥', hot: false },
        { label: '利率',   emoji: '💰', hot: false },
        { label: 'LPR',    emoji: '🏦', hot: false },
        { label: '美联储', emoji: '🇺🇸', hot: false },
        { label: '加息',   emoji: '📊', hot: false },
        { label: '汇率',   emoji: '💱', hot: false },
        { label: 'A股',    emoji: '📉', hot: false },
        { label: '房价',   emoji: '🏠', hot: false },
      ],
    }
  },
  computed: {
    searching() {
      return this.keyword.trim().length > 0
    },
    showSubjectRow() {
      return this.multiSubject
    },
    currentSubject() {
      return this.subjects.find((item) => item.name === this.subject) || null
    },
    categoryList() {
      if (!this.multiSubject) return ['全部', ...this.subjects[0].categories]
      return this.currentSubject ? ['全部', ...this.currentSubject.categories] : []
    },
    showCategoryRow() {
      return this.categoryList.length > 0
    },
    subjectBase() {
      if (this.subject === '全部') return this.terms
      return this.terms.filter((item) => (item.subject || defaultSubject) === this.subject)
    },
    effectiveCategory() {
      if (this.multiSubject && this.subject === '全部') return '全部'
      return this.category
    },
    visibleTerms() {
      if (this.searching) return filterTerms(this.terms, this.keyword, '全部')
      return filterTerms(this.subjectBase, '', this.effectiveCategory)
    },
    visibleCount() {
      return this.visibleTerms.length
    },
    listTitle() {
      if (this.searching) return '搜索结果'
      if (this.multiSubject && this.subject !== '全部') return this.subject
      if (this.category !== '全部') return this.category
      return '常用词条'
    },
  },
  watch: {
    category() {
      this.scrollToTop()
    },
    subject() {
      this.category = '全部'
      this.scrollToTop()
    },
  },
  onShareAppMessage() {
    return {
      title: '看懂经济词 · 用人话解释经济术语',
      path: '/pages/index/index',
    }
  },
  onShareTimeline() {
    return {
      title: '看懂经济词 · 用人话解释经济术语',
    }
  },
  methods: {
    categoryEmoji,
    subjectCount(name) {
      if (name === '全部') return this.terms.length
      return this.terms.filter((item) => (item.subject || defaultSubject) === name).length
    },
    categoryCount(name) {
      if (name === '全部') return this.subjectBase.length
      return this.subjectBase.filter((item) => item.category === name).length
    },
    termMeta(item) {
      return this.multiSubject ? `${item.subject || defaultSubject} · ${item.category}` : item.category
    },
    scrollToTop() {
      uni.pageScrollTo({ scrollTop: 0, duration: 0 })
    },
    openTerm(item) {
      uni.navigateTo({
        url: `/pages/detail/detail?id=${item.id}`,
      })
    },
  },
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding-bottom: calc(48rpx + env(safe-area-inset-bottom));
}

.hero {
  padding: 48rpx 32rpx 44rpx;
  background: linear-gradient(150deg, #1f4e5f 0%, #2f6b73 100%);
  border-bottom-left-radius: 48rpx;
  border-bottom-right-radius: 48rpx;
}

.hero-mark {
  display: block;
  font-size: 20rpx;
  letter-spacing: 6rpx;
  color: rgba(255, 255, 255, 0.55);
}

.hero-title {
  display: block;
  margin-top: 14rpx;
  font-size: 56rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
  color: #fffdf7;
}

.hero-sub {
  display: block;
  margin-top: 12rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.78);
}

.search-box {
  display: flex;
  align-items: center;
  height: 88rpx;
  margin-top: 32rpx;
  padding: 0 26rpx;
  background: #fffdf7;
  border-radius: 999rpx;
  box-shadow: 0 12rpx 28rpx rgba(15, 40, 50, 0.25);
}

.search-icon {
  position: relative;
  flex-shrink: 0;
  width: 26rpx;
  height: 26rpx;
  margin-right: 18rpx;
  border: 3rpx solid #8a979d;
  border-radius: 50%;
}

.search-icon::after {
  position: absolute;
  right: -12rpx;
  bottom: -8rpx;
  width: 14rpx;
  height: 3rpx;
  content: '';
  background: #8a979d;
  border-radius: 2rpx;
  transform: rotate(45deg);
}

.search-input {
  flex: 1;
  height: 100%;
  font-size: 30rpx;
  color: #23303a;
}

.search-placeholder {
  color: #9aa7ad;
}

.search-clear {
  padding: 10rpx 0 10rpx 20rpx;
  font-size: 26rpx;
  color: #9aa7ad;
}

.hero-count {
  display: block;
  margin-top: 24rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.62);
}

.hot-wrap {
  margin-top: 22rpx;
}

.hot-label {
  display: block;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 2rpx;
}

.hot-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 12rpx;
}

.hot-tag {
  display: inline-flex;
  align-items: center;
  margin: 0 14rpx 12rpx 0;
  padding: 10rpx 22rpx;
  font-size: 24rpx;
  color: #fffdf7;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 999rpx;
}

.hot-tag-top {
  background: rgba(255, 200, 80, 0.28);
  border: 1rpx solid rgba(255, 220, 120, 0.5);
}

.hot-emoji {
  font-size: 28rpx;
  margin-right: 8rpx;
  line-height: 1;
}

.hot-text {
  font-size: 24rpx;
}

.hot-badge {
  font-size: 22rpx;
  margin-left: 8rpx;
}

.filter-bar {
  position: sticky;
  top: 0;
  z-index: 20;
  margin-top: 24rpx;
  padding: 20rpx 32rpx 4rpx;
  background: #f6f4ef;
  border-bottom: 1rpx solid rgba(231, 226, 216, 0.7);
}

.subject-scroll {
  margin-bottom: 8rpx;
  white-space: nowrap;
}

.subject-row {
  display: flex;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  padding-top: 8rpx;
}

.chip {
  flex-shrink: 0;
  margin: 0 12rpx 12rpx 0;
  padding: 10rpx 18rpx;
  font-size: 24rpx;
  color: #5b6b75;
  background: #ffffff;
  border: 1rpx solid #e7e2d8;
  border-radius: 999rpx;
}

.subject-chip {
  margin-bottom: 12rpx;
}

.chip.active {
  font-weight: 600;
  color: #fffdf7;
  background: #1f4e5f;
  border-color: #1f4e5f;
}

.chip-count {
  margin-left: 6rpx;
  font-size: 18rpx;
  color: #9aa7ad;
}

.chip.active .chip-count {
  color: rgba(255, 255, 255, 0.72);
}

.list {
  padding: 28rpx 32rpx 0;
}

.list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.list-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #23303a;
}

.list-count {
  font-size: 24rpx;
  color: #5b6b75;
}

.term-card {
  margin-top: 20rpx;
  padding: 28rpx;
  background: #fffdfa;
  border: 1rpx solid #e7e2d8;
  border-radius: 28rpx;
  box-shadow: 0 6rpx 18rpx rgba(35, 48, 58, 0.04);
}

.term-card-hover {
  opacity: 0.86;
}

.term-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.term-name-row {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.term-emoji {
  flex-shrink: 0;
  width: 48rpx;
  height: 48rpx;
  margin-right: 12rpx;
  font-size: 28rpx;
  line-height: 48rpx;
  text-align: center;
  background: #f6ebdd;
  border-radius: 12rpx;
}

.term-name {
  font-size: 34rpx;
  font-weight: 700;
  color: #23303a;
}

.term-cat {
  padding: 4rpx 16rpx;
  font-size: 22rpx;
  color: #1f4e5f;
  background: #e7f0f1;
  border-radius: 999rpx;
}

.term-en {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  letter-spacing: 0.5rpx;
  color: #c07a3e;
}

.term-summary {
  display: block;
  margin-top: 14rpx;
  font-size: 27rpx;
  line-height: 1.65;
  color: #5b6b75;
}

.term-link {
  display: block;
  margin-top: 16rpx;
  font-size: 24rpx;
  text-align: right;
  color: #1f4e5f;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}

.empty-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #23303a;
}

.empty-desc {
  margin-top: 16rpx;
  font-size: 26rpx;
  color: #5b6b75;
}

.footer {
  padding: 48rpx 32rpx 24rpx;
  font-size: 22rpx;
  line-height: 1.6;
  text-align: center;
  color: #9aa7ad;
}
</style>
