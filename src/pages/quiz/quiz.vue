<template>
  <view class="page">
    <view v-if="phase === 'ready'" class="panel intro">
      <text class="kicker">互动挑战</text>
      <text class="title">术语配对</text>
      <text class="desc">60 秒内，把左边的术语和右边的解释配对。配对成功连续加分，配错会扣 3 秒。</text>

      <view class="rules">
        <view class="rule">
          <text class="rule-no">1</text>
          <text class="rule-text">先点一个术语，再点它对应的解释</text>
        </view>
        <view class="rule">
          <text class="rule-no">2</text>
          <text class="rule-text">连续配对成功，得分会越来越高</text>
        </view>
        <view class="rule">
          <text class="rule-no">3</text>
          <text class="rule-text">配错不扣分，但会扣掉 3 秒</text>
        </view>
      </view>

      <text v-if="bestScore > 0" class="best">历史最高分 {{ bestScore }}</text>
      <view class="btn-primary" hover-class="btn-hover" @tap="startGame">开始挑战</view>
    </view>

    <view v-else-if="phase === 'playing'" class="game">
      <view class="status-bar">
        <view class="status-item">
          <text class="status-label">剩余时间</text>
          <text class="status-value" :class="{ danger: timeLeft <= 10 }">{{ timeLeft }}s</text>
        </view>
        <view class="status-item">
          <text class="status-label">得分</text>
          <text class="status-value">{{ score }}</text>
        </view>
        <view class="status-item">
          <text class="status-label">连击</text>
          <text class="status-value">{{ combo }}</text>
        </view>
      </view>

      <view class="progress">
        <view class="progress-fill" :style="{ width: progress + '%' }"></view>
      </view>
      <text class="hint">已配对 {{ matchedCount }} / {{ pairs.length }} 组</text>

      <view class="board">
        <view class="col">
          <view
            v-for="item in leftItems"
            :key="item.id"
            class="card card-term"
            :class="{ selected: selectedLeftId === item.id, matched: item.matched, wrong: wrongLeftId === item.id }"
            @tap="pickLeft(item)"
          >
            <text class="term-text">{{ item.term }}</text>
            <text v-if="item.matched" class="mark">✓</text>
          </view>
        </view>

        <view class="col">
          <view
            v-for="item in rightItems"
            :key="item.id"
            class="card card-def"
            :class="{ selected: selectedRightId === item.id, matched: item.matched, wrong: wrongRightId === item.id }"
            @tap="pickRight(item)"
          >
            <text class="def-text">{{ item.summary }}</text>
            <text v-if="item.matched" class="mark">✓</text>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="panel result">
      <text class="kicker">{{ resultReason === 'complete' ? '挑战完成' : '时间到' }}</text>
      <text class="result-score">{{ score }}</text>
      <text class="result-label">总得分</text>

      <view class="result-grid">
        <view class="result-item">
          <text class="result-num">{{ matchedCount }}/{{ pairs.length }}</text>
          <text class="result-name">配对成功</text>
        </view>
        <view class="result-item">
          <text class="result-num">{{ maxCombo }}</text>
          <text class="result-name">最高连击</text>
        </view>
        <view class="result-item">
          <text class="result-num">{{ accuracy }}%</text>
          <text class="result-name">配对准确率</text>
        </view>
      </view>

      <text v-if="isNewBest" class="new-best">刷新了历史最高分</text>
      <text v-else class="best">历史最高分 {{ bestScore }}</text>

      <view class="btn-primary" hover-class="btn-hover" @tap="startGame">再来一局</view>
      <view class="btn-ghost" hover-class="btn-hover" @tap="goHome">返回首页</view>
    </view>

    <view class="footer">内容为通俗整理，仅供参考，不构成任何投资建议</view>
  </view>
</template>

<script>
import { terms } from '../../data/terms.js'
import { buildQuizRound } from '../../utils/quiz.js'

export default {
  data() {
    return {
      phase: 'ready',
      resultReason: '',
      bestScore: 0,
      isNewBest: false,

      pairs: [],
      leftItems: [],
      rightItems: [],
      selectedLeftId: null,
      selectedRightId: null,
      wrongLeftId: null,
      wrongRightId: null,
      locked: false,
      paused: false,

      timeLeft: 60,
      score: 0,
      combo: 0,
      maxCombo: 0,
      matchedCount: 0,
      attempts: 0,
      correctAttempts: 0,

      timerId: null,
      feedbackTimer: null,
    }
  },
  computed: {
    progress() {
      if (!this.pairs.length) return 0
      return Math.round((this.matchedCount / this.pairs.length) * 100)
    },
    accuracy() {
      if (!this.attempts) return 0
      return Math.round((this.correctAttempts / this.attempts) * 100)
    },
  },
  onLoad() {
    const saved = Number(uni.getStorageSync('quiz_best_score'))
    if (saved > 0) this.bestScore = saved
  },
  onShow() {
    if (this.paused && this.phase === 'playing') {
      this.paused = false
      this.startTimer()
    }
  },
  onHide() {
    if (this.phase !== 'playing') return
    this.paused = true
    this.clearTimers()
    this.wrongLeftId = null
    this.wrongRightId = null
    this.selectedLeftId = null
    this.selectedRightId = null
    this.locked = false
  },
  onUnload() {
    this.clearTimers()
  },
  onShareAppMessage() {
    return {
      title: '术语配对挑战 · 60 秒测测你',
      path: '/pages/quiz/quiz',
    }
  },
  onShareTimeline() {
    return {
      title: '术语配对挑战 · 60 秒测测你',
    }
  },
  methods: {
    clearTimers() {
      if (this.timerId) {
        clearInterval(this.timerId)
        this.timerId = null
      }
      if (this.feedbackTimer) {
        clearTimeout(this.feedbackTimer)
        this.feedbackTimer = null
      }
    },
    startGame() {
      this.clearTimers()
      const round = buildQuizRound(terms, 4)

      this.pairs = round.pairs
      this.leftItems = round.leftItems
      this.rightItems = round.rightItems
      this.selectedLeftId = null
      this.selectedRightId = null
      this.wrongLeftId = null
      this.wrongRightId = null
      this.locked = false

      this.phase = 'playing'
      this.resultReason = ''
      this.isNewBest = false
      this.timeLeft = 60
      this.score = 0
      this.combo = 0
      this.maxCombo = 0
      this.matchedCount = 0
      this.attempts = 0
      this.correctAttempts = 0
      this.paused = false
      this.startTimer()
    },
    startTimer() {
      this.clearTimers()
      this.timerId = setInterval(() => {
        if (this.phase !== 'playing' || this.paused) return
        this.timeLeft -= 1
        if (this.timeLeft <= 0) this.finish('timeout')
      }, 1000)
    },
    pickLeft(item) {
      if (this.phase !== 'playing' || this.locked || item.matched) return
      this.selectedLeftId = this.selectedLeftId === item.id ? null : item.id
      if (this.selectedLeftId && this.selectedRightId) this.checkMatch()
    },
    pickRight(item) {
      if (this.phase !== 'playing' || this.locked || item.matched) return
      this.selectedRightId = this.selectedRightId === item.id ? null : item.id
      if (this.selectedLeftId && this.selectedRightId) this.checkMatch()
    },
    checkMatch() {
      const leftId = this.selectedLeftId
      const rightId = this.selectedRightId
      if (!leftId || !rightId) return

      this.attempts += 1

      if (leftId === rightId) {
        const left = this.leftItems.find((item) => item.id === leftId)
        const right = this.rightItems.find((item) => item.id === rightId)
        if (left) left.matched = true
        if (right) right.matched = true

        this.combo += 1
        this.maxCombo = Math.max(this.maxCombo, this.combo)
        this.score += 10 + (this.combo - 1) * 5
        this.correctAttempts += 1
        this.matchedCount += 1
        this.selectedLeftId = null
        this.selectedRightId = null

        uni.vibrateShort({ type: 'medium' })

        if (this.matchedCount === this.pairs.length) this.finish('complete')
        return
      }

      this.combo = 0
      this.wrongLeftId = leftId
      this.wrongRightId = rightId
      this.locked = true
      this.timeLeft = Math.max(0, this.timeLeft - 3)

      uni.vibrateShort({ type: 'heavy' })

      this.feedbackTimer = setTimeout(() => {
        this.wrongLeftId = null
        this.wrongRightId = null
        this.selectedLeftId = null
        this.selectedRightId = null
        this.locked = false
      }, 500)

      if (this.timeLeft === 0) this.finish('timeout')
    },
    finish(reason) {
      if (this.phase !== 'playing') return
      this.clearTimers()
      this.paused = false
      this.phase = 'result'
      this.resultReason = reason

      if (reason === 'complete' && this.timeLeft > 0) {
        this.score += this.timeLeft
      }

      this.isNewBest = this.score > this.bestScore
      if (this.isNewBest) {
        this.bestScore = this.score
        uni.setStorageSync('quiz_best_score', this.bestScore)
      }
    },
    goHome() {
      uni.switchTab({ url: '/pages/index/index' })
    },
  },
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 32rpx 32rpx calc(48rpx + env(safe-area-inset-bottom));
}

.panel {
  margin-top: 16rpx;
  padding: 48rpx 36rpx;
  background: var(--surface);
  border: 1rpx solid var(--line);
  border-radius: 36rpx;
  text-align: center;
}

.kicker {
  display: block;
  font-size: 20rpx;
  letter-spacing: 6rpx;
  color: var(--accent);
}

.title {
  display: block;
  margin-top: 16rpx;
  font-size: 52rpx;
  font-weight: 700;
  color: var(--brand);
}

.desc {
  display: block;
  margin-top: 20rpx;
  font-size: 26rpx;
  line-height: 1.7;
  color: var(--ink-soft);
  text-align: left;
}

.rules {
  margin-top: 34rpx;
  padding-top: 30rpx;
  border-top: 1rpx solid var(--line);
}

.rule {
  display: flex;
  align-items: flex-start;
  margin-top: 18rpx;
}

.rule:first-child {
  margin-top: 0;
}

.rule-no {
  flex: none;
  width: 36rpx;
  height: 36rpx;
  margin-right: 16rpx;
  border-radius: 50%;
  background: var(--brand-soft);
  color: var(--brand);
  font-size: 22rpx;
  font-weight: 600;
  line-height: 36rpx;
  text-align: center;
}

.rule-text {
  flex: 1;
  font-size: 25rpx;
  line-height: 1.6;
  color: var(--ink-soft);
  text-align: left;
}

.best {
  display: block;
  margin-top: 32rpx;
  font-size: 24rpx;
  color: var(--accent);
}

.btn-primary {
  margin-top: 40rpx;
  padding: 26rpx 0;
  background: var(--brand);
  border-radius: 999rpx;
  color: #fffdf7;
  font-size: 30rpx;
  font-weight: 600;
  text-align: center;
}

.btn-ghost {
  margin-top: 20rpx;
  padding: 24rpx 0;
  border: 1rpx solid var(--line);
  border-radius: 999rpx;
  color: var(--brand);
  font-size: 28rpx;
  text-align: center;
}

.btn-hover {
  opacity: 0.82;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  padding: 8rpx 8rpx 0;
}

.status-item {
  flex: 1;
  text-align: center;
}

.status-label {
  display: block;
  font-size: 22rpx;
  color: var(--ink-soft);
}

.status-value {
  display: block;
  margin-top: 8rpx;
  font-size: 38rpx;
  font-weight: 700;
  color: var(--brand);
}

.danger {
  color: #c0533e;
}

.progress {
  height: 8rpx;
  margin-top: 26rpx;
  background: var(--line);
  border-radius: 999rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--brand);
  border-radius: 999rpx;
  transition: width 0.25s ease;
}

.hint {
  display: block;
  margin-top: 18rpx;
  font-size: 23rpx;
  color: var(--ink-soft);
  text-align: center;
}

.board {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  margin-top: 24rpx;
}

.col {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 18rpx;
}

.card {
  position: relative;
  min-height: 100rpx;
  padding: 22rpx 18rpx;
  background: var(--surface);
  border: 2rpx solid var(--line);
  border-radius: 24rpx;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.card-term {
  display: flex;
  align-items: center;
  justify-content: center;
}

.term-text {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--ink);
  text-align: center;
}

.def-text {
  font-size: 24rpx;
  line-height: 1.55;
  color: var(--ink-soft);
}

.selected {
  border-color: var(--brand);
  background: var(--brand-soft);
}

.matched {
  border-color: #cfe0cf;
  background: #eef5ee;
  opacity: 0.62;
  animation: pop 0.35s ease;
}

@keyframes pop {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.08);
  }
  100% {
    transform: scale(1);
  }
}

.matched .term-text,
.matched .def-text {
  color: #3f6b4f;
}

.wrong {
  border-color: #c0533e;
  background: #fbeae6;
  animation: shake 0.4s ease;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-8rpx);
  }
  75% {
    transform: translateX(8rpx);
  }
}

.mark {
  position: absolute;
  top: 10rpx;
  right: 14rpx;
  font-size: 24rpx;
  color: #3f6b4f;
}

.result-score {
  display: block;
  margin-top: 24rpx;
  font-size: 100rpx;
  font-weight: 700;
  line-height: 1.1;
  color: var(--brand);
}

.result-label {
  display: block;
  font-size: 24rpx;
  color: var(--ink-soft);
}

.result-grid {
  display: flex;
  justify-content: space-around;
  margin-top: 44rpx;
  padding-top: 32rpx;
  border-top: 1rpx solid var(--line);
}

.result-item {
  flex: 1;
}

.result-num {
  display: block;
  font-size: 34rpx;
  font-weight: 600;
  color: var(--ink);
}

.result-name {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: var(--ink-soft);
}

.new-best {
  display: block;
  margin-top: 32rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: var(--accent);
}

.footer {
  margin-top: 48rpx;
  font-size: 20rpx;
  color: #9aa7ad;
  text-align: center;
}
</style>
