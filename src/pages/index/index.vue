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
    </view>

    <scroll-view class="chips" scroll-x :show-scrollbar="false">
      <view class="chip-row">
        <view
          v-for="item in categoryList"
          :key="item"
          class="chip"
          :class="{ active: category === item }"
          @tap="category = item"
        >
          {{ item }}
        </view>
      </view>
    </scroll-view>

    <view class="story-banner" hover-class="story-banner-hover" @tap="openStory">
      <view class="story-banner-main">
        <text class="story-banner-title">小岛故事</text>
        <text class="story-banner-desc">跟着一座小岛，看懂经济怎么运转</text>
      </view>
      <text class="story-banner-arrow">→</text>
    </view>

    <view class="list">
      <view class="list-head">
        <text class="list-title">{{ keyword ? '搜索结果' : '常用词条' }}</text>
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
          <text class="term-name">{{ item.term }}</text>
          <text class="term-cat">{{ item.category }}</text>
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
import { categories, terms } from '../../data/terms.js'
import { filterTerms } from '../../utils/search.js'

export default {
  data() {
    return {
      keyword: '',
      category: '全部',
      terms,
      termsCount: terms.length,
      categoryList: ['全部', ...categories],
      visibleTerms: terms,
      visibleCount: terms.length,
    }
  },
  watch: {
    keyword() {
      this.applyFilter()
    },
    category() {
      this.applyFilter()
    },
  },
  methods: {
    applyFilter() {
      this.visibleTerms = filterTerms(this.terms, this.keyword, this.category)
      this.visibleCount = this.visibleTerms.length
    },
    openTerm(item) {
      uni.navigateTo({
        url: `/pages/detail/detail?id=${item.id}`,
      })
    },
    openStory() {
      uni.navigateTo({ url: '/pages/story/story' })
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

.chips {
  margin-top: 24rpx;
  white-space: nowrap;
}

.chip-row {
  display: flex;
  padding: 0 32rpx;
}

.chip {
  flex-shrink: 0;
  margin-right: 16rpx;
  padding: 12rpx 28rpx;
  font-size: 26rpx;
  color: #5b6b75;
  background: #ffffff;
  border: 1rpx solid #e7e2d8;
  border-radius: 999rpx;
}

.chip.active {
  font-weight: 600;
  color: #fffdf7;
  background: #1f4e5f;
  border-color: #1f4e5f;
}

.story-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 24rpx 32rpx 0;
  padding: 28rpx 30rpx;
  background: #f6ebdd;
  border: 1rpx solid #efdcc5;
  border-radius: 28rpx;
}

.story-banner-hover {
  opacity: 0.86;
}

.story-banner-main {
  flex: 1;
}

.story-banner-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #9a5c27;
}

.story-banner-desc {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #7d5e3c;
}

.story-banner-arrow {
  margin-left: 20rpx;
  font-size: 32rpx;
  color: #9a5c27;
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
