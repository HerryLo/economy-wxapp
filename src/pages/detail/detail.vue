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

      <view class="section">
        <text class="section-label">一句话记住</text>
        <text class="section-text strong">{{ term.summary }}</text>
      </view>

      <view class="section">
        <text class="section-label">说人话</text>
        <text class="section-text">{{ term.plain }}</text>
      </view>

      <view class="section example">
        <view class="section-head">
          <text class="section-label">{{ isIslandExample ? '小岛故事' : '举个例子' }}</text>
          <text v-if="isIslandExample" class="story-link" @tap="openStory">看完整故事 →</text>
        </view>
        <text class="section-text">{{ exampleText }}</text>
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
  margin-top: 24rpx;
  padding: 32rpx;
  background: #fffdfa;
  border: 1rpx solid #e7e2d8;
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
  font-size: 24rpx;
  font-weight: 600;
  letter-spacing: 2rpx;
  color: #c07a3e;
}

.section-head .section-label {
  margin-bottom: 0;
}

.story-link {
  font-size: 22rpx;
  color: #9a5c27;
}

.section-text {
  display: block;
  font-size: 30rpx;
  line-height: 1.8;
  color: #23303a;
}

.section-text.strong {
  font-weight: 600;
}

.section.example {
  background: #f6ebdd;
  border-color: #efdcc5;
}

.section.example .section-label {
  color: #9a5c27;
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
