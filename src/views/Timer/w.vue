<script setup>
import { computed, onMounted, watch, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCourseStore } from '@/stores/courseStore'
import { useTimerStore } from '@/stores/timerStore'
import { registerInstructionRoutesApi } from '@/api/course'

const router = useRouter()

const courseStore = useCourseStore()
const timerStore = useTimerStore()

const { courses, currentCourse, currentTitle } = storeToRefs(courseStore)
const { seconds, running, formatted, minutes } = storeToRefs(timerStore)

const DAILY_GOAL = 60

const todayDone = computed(() => currentCourse.value?.todayMinutes || 0)

const dialPercent = computed(() => {
  const total = todayDone.value + minutes.value
  return Math.min(100, Math.round((total / DAILY_GOAL) * 100))
})

const goalText = computed(() => {
  const total = todayDone.value + minutes.value
  return `${Math.min(total, DAILY_GOAL)} / ${DAILY_GOAL} min`
})

// 课程下拉选项
const courseOptions = computed(() =>
  courses.value.filter((c) => {
    if (c.progress.length && +c.progress[1].replace('%', '') < 100) {
      return { label: c.title.length ? c.title[0] : '未命名', value: c.title.length && c.title[0] }
    }
  })
)

onMounted(() => courseStore.loadCourses())
watch(currentCourse, () => timerStore.reset())

async function handleStart() {
  await registerInstructionRoutesApi('course_control_resume')
  timerStore.start()
}
async function handlePause() {
  await registerInstructionRoutesApi('course_control_pause')
  timerStore.pause()
}

async function handleFinish() {
  if (!currentCourse.value) return
  await registerInstructionRoutesApi('course_control_stop')
  timerStore.reset()
  router.back()
}

function handleReset() { timerStore.reset() }


const closeChromeShow = ref(false)

onBeforeRouteLeave(async (to, from) => {
  try {
    await registerInstructionRoutesApi('tab_close_current')
    return true       // 保存成功，跳转到目标页
  } catch (e) {
    return false       // 保存失败，留在当前页
  } finally {
    return true
  }
})

const handleChorme = () => window.open('http://127.0.0.1:8765/screen', '_blank')
</script>

<template>
  <div class="timer-page">

    <div>{{ currentTitle }}</div>

    <!-- 课程选择 — VarSelect -->
    <!-- <section class="picker">
      <var-select v-model="currentTitle" placeholder="请选择课程" clearable :options="courseOptions" variant="outlined"
        class="picker__select">
      </var-select>
    </section> -->

    <!-- 计时表盘 — VarProgress 圆形 -->
    <section class="dial-wrap">
      <var-progress mode="circle" :value="dialPercent" :size="220" :line-width="12" color="#0b57d0"
        track-color="#ebe9f0" class="dial" />

      <div class="dial-inner">
        <span class="dial-inner__time">{{ formatted }}</span>
        <span class="dial-inner__goal">今日目标 {{ goalText }}</span>
        <var-chip :color="running ? 'var(--color-primary-container)' : 'var(--color-surface-container)'"
          :text-color="running ? 'var(--color-on-primary-container)' : 'var(--color-on-surface-variant)'" size="small">
          {{ running ? '专注中…' : (seconds > 0 ? '已暂停' : '准备开始') }}
        </var-chip>
      </div>
    </section>

    <!-- 控制按钮 — VarButton -->
    <section class="controls">
      <var-button round :disabled="seconds === 0" class="ctrl ctrl--ghost" @click="handleReset">
        <var-icon name="refresh" :size="22" />
      </var-button>

      <var-button type="primary" round class="ctrl ctrl--main" :class="{ 'is-running': running }"
        @click="running ? handlePause() : handleStart()">
        <var-icon :name="running ? 'pause' : 'play'" :size="30" />
      </var-button>

      <var-button round class="ctrl ctrl--ghost" @click="closeChromeShow = true">
        <var-icon name="check" :size="22" />
      </var-button>
    </section>
    <button type="primary" @click="handleChorme">查看浏览器窗口</button>
    <!-- 课程信息 — VarCell -->
    <var-paper v-if="currentCourse" class="info">
      <var-cell title="当前章节" :description="currentCourse.chapter" />
      <var-cell title="累计学习" :description="`${currentCourse.studiedMinutes} 分钟`" />
      <var-cell title="课程进度"
        :description="`${Math.round((currentCourse.studiedMinutes / currentCourse.totalMinutes) * 100)}%`" />
    </var-paper>


    <var-dialog title="结束刷课" message="确定结束刷课程序吗，结束后浏览器自动关闭" v-model:show="closeChromeShow" @confirm="handleFinish"
      @cancel="closeChromeShow = false" @closed="Snackbar.info('closed')" />
  </div>
</template>

<style lang="scss" scoped>
.timer-page {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

.picker__select {
  --select-decorator-padding: 0 16px;
}

.dial-wrap {
  position: relative;
  width: 260px;
  height: 260px;
  margin: $space-2 auto 0;
  display: grid;
  place-items: center;
}

.dial {
  :deep(.var-progress__track) {
    stroke-linecap: round;
  }
}

.dial-inner {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  pointer-events: none;

  &__time {
    font-size: 46px;
    font-weight: 700;
    letter-spacing: -1px;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  &__goal {
    font-size: 12.5px;
    font-weight: 600;
    color: $on-surface-variant;
    font-variant-numeric: tabular-nums;
  }
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-5;
}

.ctrl {
  &--ghost {
    --button-height: 64px;
    --button-width: 64px;
    background: $surface;
    color: $on-surface-variant;
    box-shadow: $shadow-1;
  }

  &--main {
    --button-height: 84px;
    --button-width: 84px;
    box-shadow: 0 8px 22px rgba($primary, .32);

    &.is-running {
      background: linear-gradient(135deg, #146c2e, #2e9e4c) !important;
      box-shadow: 0 8px 22px rgba(20, 108, 46, .3);
    }
  }
}

.info {
  border-radius: $radius-lg;
  overflow: hidden;
}
</style>