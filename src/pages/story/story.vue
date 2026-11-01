<template>
  <view class="page">
    <view class="hero">
      <text class="hero-mark">ISLAND STORY</text>
      <text class="hero-title">小岛故事</text>
      <text class="hero-sub">跟着一座小岛，看懂经济怎么运转</text>
    </view>

    <view class="intro">
      <text class="intro-title">先说清楚</text>
      <text class="intro-text">
        这个专题的灵感来自《小岛经济学》用岛屿寓言讲经济的思路。下面的小岛、村民和情节，都是为这个小程序原创编写的，不是原书内容的转述。每个故事后面可以点词条，继续看解释。
      </text>
    </view>

    <view v-for="(chapter, index) in chapters" :key="chapter.title" class="chapter">
      <view class="chapter-head">
        <text class="chapter-no">{{ index + 1 }}</text>
        <view class="chapter-titles">
          <text class="chapter-title">{{ chapter.title }}</text>
          <text class="chapter-sub">{{ chapter.subtitle }}</text>
        </view>
      </view>

      <text v-for="(paragraph, pIndex) in chapter.story" :key="pIndex" class="chapter-text">{{ paragraph }}</text>

      <view class="term-chips">
        <text
          v-for="id in chapter.termIds"
          :key="id"
          class="term-chip"
          @tap="openTerm(id)"
        >{{ termName(id) }}</text>
      </view>
    </view>

    <view class="source">
      <text class="source-title">理念来源与说明</text>
      <text class="source-text">
        理念来源：《小岛经济学》（彼得·希夫、安德鲁·希夫著，英文原版 How an Economy Grows and Why It Crashes）。本页所有人物、村庄、情节与文字均为原创改写，仅借鉴“用岛屿讲经济”的思路，不包含原书文字与情节。故事仅用于帮助理解概念，不构成任何投资建议。
      </text>
    </view>
  </view>
</template>

<script>
import { terms } from '../../data/terms.js'
import { chapters } from '../../data/islandChapters.js'

const termMap = terms.reduce((map, term) => {
  map[term.id] = term
  return map
}, {})

export default {
  data() {
    return {
      chapters,
    }
  },
  onShareAppMessage() {
    return {
      title: '小岛故事：跟着一座岛看懂经济',
      path: '/pages/story/story',
    }
  },
  onShareTimeline() {
    return { title: '小岛故事：跟着一座岛看懂经济' }
  },
  methods: {
    termName(id) {
      return termMap[id] ? termMap[id].term : id
    },
    openTerm(id) {
      uni.navigateTo({
        url: `/pages/detail/detail?id=${id}`,
      })
    },
  },
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding-bottom: calc(56rpx + env(safe-area-inset-bottom));
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

.intro {
  margin: 28rpx 32rpx 0;
  padding: 30rpx;
  background: #fffdfa;
  border: 1rpx solid #e7e2d8;
  border-radius: 28rpx;
}

.intro-title {
  display: block;
  margin-bottom: 12rpx;
  font-size: 26rpx;
  font-weight: 600;
  letter-spacing: 2rpx;
  color: #c07a3e;
}

.intro-text {
  display: block;
  font-size: 26rpx;
  line-height: 1.75;
  color: #5b6b75;
}

.chapter {
  margin: 24rpx 32rpx 0;
  padding: 32rpx;
  background: #fffdfa;
  border: 1rpx solid #e7e2d8;
  border-radius: 28rpx;
  box-shadow: 0 6rpx 18rpx rgba(35, 48, 58, 0.04);
}

.chapter-head {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.chapter-no {
  flex-shrink: 0;
  width: 52rpx;
  height: 52rpx;
  margin-right: 18rpx;
  font-size: 26rpx;
  font-weight: 700;
  line-height: 52rpx;
  text-align: center;
  color: #fffdf7;
  background: #1f4e5f;
  border-radius: 50%;
}

.chapter-titles {
  flex: 1;
}

.chapter-title {
  display: block;
  font-size: 34rpx;
  font-weight: 700;
  color: #23303a;
}

.chapter-sub {
  display: block;
  margin-top: 6rpx;
  font-size: 23rpx;
  color: #c07a3e;
}

.chapter-text {
  display: block;
  margin-top: 16rpx;
  font-size: 28rpx;
  line-height: 1.85;
  color: #2b3a44;
}

.term-chips {
  display: flex;
  flex-wrap: wrap;
  margin-top: 24rpx;
  margin-right: -14rpx;
}

.term-chip {
  margin-right: 14rpx;
  margin-bottom: 14rpx;
  padding: 8rpx 20rpx;
  font-size: 23rpx;
  color: #1f4e5f;
  background: #e7f0f1;
  border-radius: 999rpx;
}

.source {
  margin: 28rpx 32rpx 0;
  padding: 30rpx;
  background: #f6ebdd;
  border: 1rpx solid #efdcc5;
  border-radius: 28rpx;
}

.source-title {
  display: block;
  margin-bottom: 12rpx;
  font-size: 24rpx;
  font-weight: 600;
  letter-spacing: 2rpx;
  color: #9a5c27;
}

.source-text {
  display: block;
  font-size: 23rpx;
  line-height: 1.75;
  color: #6d5337;
}
</style>
