<template>
  <view class="page">
    <view v-if="term" class="detail">
      <view class="head">
        <view class="head-top">
          <text class="term-name">{{ term.term }}</text>
          <text class="term-cat">{{ term.category }}</text>
        </view>
        <view class="en-row" @tap="copyText(term.en)">
          <text class="term-en">{{ term.en }}</text>
          <text class="copy-pill">复制</text>
        </view>
        <view v-if="term.aliases && term.aliases.length" class="alias-row">
          <text class="alias-label">又叫</text>
          <text
            v-for="alias in term.aliases"
            :key="alias"
            class="alias"
            @tap="copyText(alias)"
          >{{ alias }}</text>
        </view>
        <text v-if="term.aliases && term.aliases.length" class="alias-hint">点按别名可复制</text>
      </view>

      <view class="section section-summary">
        <view class="section-head">
          <text class="section-label">💡 一句话记住</text>
        </view>
        <text class="section-text summary-text">{{ term.summary }}</text>
      </view>

      <view class="section section-plain">
        <text class="section-label">📖 说人话</text>
        <view class="plain-wrap">
          <text class="section-text">{{ term.plain }}</text>
        </view>
      </view>

      <view class="section section-example">
        <view class="section-head">
          <text class="section-label">{{ isIslandExample ? '🎯 小岛故事' : '🎯 举个例子' }}</text>
          <text v-if="isIslandExample" class="story-link" @tap="openStory">看完整故事 →</text>
        </view>
        <view class="example-wrap">
          <text class="example-quote">"</text>
          <text class="section-text example-text">{{ exampleText }}</text>
        </view>
      </view>

      <view v-if="relatedTerms.length" class="related">
        <text class="related-label">🔗 你可能还想看</text>
        <view class="related-list">
          <view
            v-for="item in relatedTerms"
            :key="item.id"
            class="related-card"
            hover-class="related-card-hover"
            @tap="openTerm(item)"
          >
            <text class="related-emoji">{{ categoryEmoji(item.category) }}</text>
            <view class="related-info">
              <text class="related-term">{{ item.term }}</text>
              <text class="related-summary">{{ item.summary }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="disclaimer">以上为通俗整理，不构成任何投资建议。发现错误欢迎反馈。</view>
    </view>

    <view v-else class="empty-page">
      <text class="empty-title">没有找到这个词条</text>
      <text class="empty-desc">可能在后续版本里补上</text>
      <view class="back-btn" @tap="goBack">返回首页</view>
    </view>
  </view>
</template>

<script>
import { terms } from '../../data/terms.js'
import { islandExamples } from '../../data/islandExamples.js'
import { categoryEmoji, getRelatedTerms } from '../../utils/category.js'

export default {
  data() {
    return {
      currentId: '',
    }
  },
  computed: {
    term() {
      return terms.find((item) => item.id === this.currentId) || null
    },
    isIslandExample() {
      return Boolean(this.term && islandExamples[this.term.id])
    },
    exampleText() {
      if (!this.term) {
        return ''
      }
      return islandExamples[this.term.id] || this.term.example
    },
    relatedTerms() {
      if (!this.term) return []
      return getRelatedTerms(terms, this.term.id, this.term.category, 3)
    },
  },
  onLoad(options) {
    this.currentId = options && options.id ? options.id : ''
    if (this.term) {
      uni.setNavigationBarTitle({ title: this.term.term })
    }
  },
  onShareAppMessage() {
    if (!this.term) {
      return {
        title: '看懂经济词',
        path: '/pages/index/index',
      }
    }
    return {
      title: `「${this.term.term}」到底是什么意思？`,
      path: `/pages/detail/detail?id=${this.term.id}`,
    }
  },
  onShareTimeline() {
    if (!this.term) {
      return { title: '看懂经济词' }
    }
    return {
      title: `「${this.term.term}」到底是什么意思？`,
    }
  },
  methods: {
    categoryEmoji,
    copyText(value) {
      if (!value) {
        return
      }
      uni.setClipboardData({
        data: String(value),
        fail: () => uni.showToast({ title: '复制失败', icon: 'none' }),
      })
    },
    openStory() {
      uni.switchTab({ url: '/pages/story/story' })
    },
    openTerm(item) {
      uni.redirectTo({ url: `/pages/detail/detail?id=${item.id}` })
    },
    goBack() {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack()
      } else {
        uni.reLaunch({ url: '/pages/index/index' })
      }
    },
  },
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 32rpx 32rpx calc(56rpx + env(safe-area-inset-bottom));
}

.head {
  padding: 36rpx 32rpx;
  background: linear-gradient(150deg, #1f4e5f 0%, #2f6b73 100%);
  border-radius: 32rpx;
  box-shadow: 0 14rpx 32rpx rgba(31, 78, 95, 0.2);
}

.head-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.term-name {
  font-size: 52rpx;
  font-weight: 700;
  color: #fffdf7;
}

.term-cat {
  padding: 6rpx 18rpx;
  font-size: 22rpx;
  color: #fffdf7;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 999rpx;
}

.en-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12rpx;
}

.term-en {
  flex: 1;
  font-size: 26rpx;
  letter-spacing: 1rpx;
  color: #e9c9a6;
}

.copy-pill {
  flex-shrink: 0;
  margin-left: 20rpx;
  padding: 4rpx 16rpx;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.75);
  border: 1rpx solid rgba(255, 255, 255, 0.35);
  border-radius: 999rpx;
}

.alias-hint {
  display: block;
  margin-top: 14rpx;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.45);
}

.alias-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 24rpx;
}

.alias-label {
  margin-right: 14rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.55);
}

.alias {
  margin-right: 14rpx;
  padding: 6rpx 16rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.12);
  border-radius: 999rpx;
}

.section {
  margin-top: 28rpx;
  padding: 32rpx;
  border-radius: 28rpx;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.section-label {
  display: block;
  margin-bottom: 16rpx;
  font-size: 26rpx;
  font-weight: 600;
  letter-spacing: 2rpx;
  color: #c07a3e;
}

.section-head .section-label {
  margin-bottom: 0;
}

/* === 一句话记住：深色强调卡 === */
.section-summary {
  padding: 36rpx 32rpx;
  background: linear-gradient(135deg, #1f4e5f 0%, #336d7a 100%);
  border: none;
  box-shadow: 0 10rpx 26rpx rgba(31, 78, 95, 0.18);
}

.section-summary .section-label {
  color: #ffd68a;
  font-size: 24rpx;
}

.summary-text {
  font-size: 32rpx;
  font-weight: 600;
  line-height: 1.75;
  color: #fffdf7;
}

/* === 说人话：左边竖条引导 === */
.section-plain {
  background: #fffdfa;
  border: 1rpx solid #e7e2d8;
}

.plain-wrap {
  padding-left: 20rpx;
  border-left: 5rpx solid #1f4e5f;
}

.section-plain .section-text {
  font-size: 30rpx;
  line-height: 1.9;
  color: #23303a;
}

/* === 举个例子：暖色引号装饰 === */
.section-example {
  background: #f6ebdd;
  border: 1rpx solid #efdcc5;
}

.section-example .section-label {
  color: #9a5c27;
}

.example-wrap {
  position: relative;
  padding: 16rpx 28rpx 16rpx 48rpx;
  background: #fff7ec;
  border-radius: 20rpx;
}

.example-quote {
  position: absolute;
  left: 14rpx;
  top: -24rpx;
  font-size: 72rpx;
  font-weight: 700;
  line-height: 1;
  color: #c07a3e;
  opacity: 0.6;
}

.example-text {
  font-size: 28rpx;
  line-height: 1.85;
  color: #5b4026;
}

.story-link {
  font-size: 22rpx;
  color: #9a5c27;
}

/* === 相关词条 === */
.related {
  margin-top: 32rpx;
}

.related-label {
  display: block;
  margin-bottom: 16rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: #23303a;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.related-card {
  display: flex;
  align-items: flex-start;
  padding: 24rpx;
  background: #fffdfa;
  border: 1rpx solid #e7e2d8;
  border-radius: 24rpx;
}

.related-card-hover {
  opacity: 0.86;
}

.related-emoji {
  flex-shrink: 0;
  width: 64rpx;
  height: 64rpx;
  margin-right: 18rpx;
  font-size: 36rpx;
  line-height: 64rpx;
  text-align: center;
  background: #f6ebdd;
  border-radius: 16rpx;
}

.related-info {
  flex: 1;
  min-width: 0;
}

.related-term {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #23303a;
}

.related-summary {
  display: block;
  margin-top: 6rpx;
  font-size: 24rpx;
  line-height: 1.5;
  color: #5b6b75;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.disclaimer {
  margin-top: 32rpx;
  padding: 0 8rpx;
  font-size: 22rpx;
  line-height: 1.7;
  text-align: center;
  color: #9aa7ad;
}

.empty-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 200rpx 0;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #23303a;
}

.empty-desc {
  margin-top: 12rpx;
  font-size: 26rpx;
  color: #5b6b75;
}

.back-btn {
  margin-top: 40rpx;
  padding: 18rpx 56rpx;
  font-size: 28rpx;
  color: #fffdf7;
  background: #1f4e5f;
  border-radius: 999rpx;
}
</style>
