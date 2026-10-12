<script setup lang="ts">
import { computed, onMounted, watch, ref, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import {
  NSelect, NProgress, NList, NListItem, NThing, NIcon, useMessage, useDialog
} from 'naive-ui'
import {
  PlayOutline, PauseOutline, RefreshOutline, CheckmarkOutline
} from '@vicons/ionicons5'
import { useCourseStore } from '@/stores/courseStore'
import { useTimerStore } from '@/stores/timerStore'
import { registerInstructionRoutesApi } from '@/api/course'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { baseUrl } from '@/utils/request'

const route = useRoute()

const message = useMessage()
const dialog = useDialog()

const courseStore = useCourseStore()
const timerStore = useTimerStore()

const { courses, currentCourse, currentTitle } = storeToRefs(courseStore)
const { seconds, running, formatted, minutes } = storeToRefs(timerStore)

const DAILY_GOAL = 60

// const courseOptions = computed(() =>
//   courses.value.map((c) => ({ label: c.name, value: c.id }))
// )

const todayDone = computed(() => currentCourse.value?.todayMinutes || 0)

const dialPercent = computed(() => {
  const total = todayDone.value + minutes.value
  return Math.min(100, Math.round((total / DAILY_GOAL) * 100))
})

const goalText = computed(() => {
  const total = todayDone.value + minutes.value
  return `${Math.min(total, DAILY_GOAL)} / ${DAILY_GOAL} min`
})

onMounted(() => courseStore.loadCourses())
watch(currentCourse, () => timerStore.reset())

const handleStart = async () => {
  if (running.value) {
    const isPause = await timerStore.pause()
    if (isPause) {
      running.value = false
      message.success('暂停成功')
    } else {
      message.error('暂停失败，请查看下方日志或重试')
    }
    return
  }
  const isStart = await timerStore.start()
  if (isStart) {
    running.value = true
    message.success('开始成功')
  } else {
    message.error('开始失败，请查看下方日志或重试')
  }
}

async function handleFinish() {
  dialog.warning({
    title: '确认结束',
    content: '确认结束本次刷课？',
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick: async () => {
      if (!currentCourse.value) return
      const m = minutes.value
      try {
        await registerInstructionRoutesApi('course_control_pause')
        if (m > 0) {
          message.success(`本次刷课时长 ${m} 分钟`, {
            duration: 3000
          })
        }
        timerStore.reset()
      } catch (err) {
        message.error('结束失败，请查看下方日志或重试')
      }
    }
  })
}


const current = ref(1)
const currentStatus = ref<'process' | 'finish' | 'error' | 'wait'>('process')

const changeCourse = async () => {

  message.warning('正在准备刷课，不要刷新或者切换页面，请稍后...', {
    duration: 3000
  })
  try {
    await registerInstructionRoutesApi('get_courses')
    current.value++
  } catch (err) {
    currentStatus.value = 'error'
    return
  }

  try {
    await registerInstructionRoutesApi('tab_close_current')
    current.value++
  } catch (err) {
    currentStatus.value = 'error'
    return
  }

  try {
    if (!courseStore.currentTitle) {
      throw new Error('无法获取课程名称')
    }
    await registerInstructionRoutesApi('course_select', { name: courseStore.currentTitle })
    current.value++
  } catch (err) {
    currentStatus.value = 'error'
    return
  }

  currentTitle.value = currentCourse?.value.title?.length ? currentCourse.value.title[0] as string : ''
  current.value = 4
  currentStatus.value = 'finish'
}

onMounted(() => {
  if (route.query.courseTitle === currentTitle.value) {
    current.value = 4
    currentStatus.value = 'finish'
  }
})



const es = ref<any>(null)
const logs = ref<any[]>([]);
const lastSeq = ref(0)
const statusText = ref('连接中...');
const level = ref('INFO');      // 过滤级别
const autoScroll = ref(true)
const box = ref<any>(null)
const connect = () => {
  if (es.value) es.value.close();                        // 先关旧的
  es.value = new EventSource(`${baseUrl}/api/logs/stream`);
  es.value.onopen = () => statusText.value = '已连接';
  es.value.onmessage = (e: any) => {
    const item = JSON.parse(e.data);
    if (item.event === '__ready__') return;
    if (item.seq <= lastSeq) return;
    lastSeq.value = item.seq;
    logs.value.push(item);
    nextTick(() => {
      if (box.value) box.value.scrollTop = box.value.scrollHeight;
    });
    if (logs.value.length > 2000) logs.value.shift();
  };
  es.value.onerror = () => { es.value.close(); setTimeout(connect, 3000); };
}
onMounted(connect);
onBeforeRouteLeave(() => { if (es.value) es.value.close(); });   // 组件销毁时关掉
</script>

<template>
  <div class="timer-page">
    <!-- <n-select v-model:value="currentCourseId" :options="courseOptions" size="large" placeholder="选择课程" /> -->

    <n-steps :current="current" :status="currentStatus">
      <n-step title="获取课程" description="正在获取全部课程信息，筛选出当前课程" />
      <n-step title="进入/切换 课程" description="正在切换课程，若首次启动直接进入课程，无需切换" />
      <n-step title="进入课程章节" description="已点击课程进入章节目录" />
      <n-step title="等待开始" description="已进入未刷章节，点击开始按钮将开始刷课" />
    </n-steps>

    <n-button type="primary" @click="changeCourse" v-if="current !== 4">
      点击更新课程准备刷课
    </n-button>

    <!-- 控制按钮 -->
    <div class="cco">
      <div class="minutes">{{ formatted }}</div>
      <section class="controls">
        <button class="ctrl ctrl--main" :class="{ 'is-running': running }" @click="handleStart">
          <n-icon :component="running ? PauseOutline : PlayOutline" :size="30" />
        </button>

        <button class="ctrl ctrl--ghost" @click="handleFinish">
          <n-icon :component="CheckmarkOutline" :size="22" />
        </button>
      </section>
    </div>

    <!-- 课程信息 -->
    <div class="bot">
      <div class="bot-c">
        <div class="logs" ref="box">
          <div class="log" v-for="p in logs" :key="p.ts">{{ p.message }}</div>
        </div>
      </div>
      <n-list v-if="currentCourse" class="info" hoverable>
        <n-list-item>
          <n-thing title="当前章节" :description="currentCourse.chapter" />
        </n-list-item>
        <n-list-item>
          <n-thing title="累计学习" :description="`${currentCourse.studiedMinutes} 分钟`" />
        </n-list-item>
        <n-list-item>
          <n-thing title="课程进度"
            :description="`${Math.round((currentCourse.studiedMinutes / currentCourse.totalMinutes) * 100)}%`" />
        </n-list-item>
      </n-list>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cco {
  width: 100%;
  display: flex;
  align-items: center;

  .minutes {
    font-size: 46px;
    margin-right: 10%;
  }
}

.bot {
  width: 100%;
  display: flex;
  gap: $space-2;

  .bot-c {
    width: 60%;
    border-radius: $radius-lg;
    box-shadow: $shadow-1;
    padding: $space-3;
    background: $surface;
  }
}

.logs {
  height: 500px;
  overflow-y: scroll;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;

  .log {
    width: 100%;
    color: #333;
  }
}

.timer-page {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

.dial-wrap {
  position: relative;
  width: 260px;
  height: 260px;
  margin: $space-2 auto 0;
  display: grid;
  place-items: center;
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
    color: $on-surface;
  }

  &__goal {
    font-size: 12.5px;
    font-weight: 600;
    color: $on-surface-variant;
    font-variant-numeric: tabular-nums;
  }

  &__state {
    margin-top: $space-2;
    padding: 4px 12px;
    border-radius: $radius-full;
    font-size: 12px;
    font-weight: 600;
    background: $surface-container;
    color: $on-surface-variant;
    transition: all .25s ease;

    &.is-running {
      background: $primary-container;
      color: $on-primary-container;
    }
  }
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-5;
}

.ctrl {
  @include flex-center;
  border: none;
  cursor: pointer;
  transition: transform .15s ease, opacity .2s ease;
  -webkit-tap-highlight-color: transparent;

  &:disabled {
    opacity: .35;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(.94);
  }

  &--ghost {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: $surface;
    color: $on-surface-variant;
    box-shadow: $shadow-1;
  }

  &--main {
    width: 84px;
    height: 84px;
    border-radius: 50%;
    background: linear-gradient(135deg, $primary, $primary-light);
    color: $on-primary;
    box-shadow: 0 8px 22px rgba($primary, .32);

    &.is-running {
      background: linear-gradient(135deg, #146c2e, #2e9e4c);
      box-shadow: 0 8px 22px rgba(20, 108, 46, .3);
    }
  }
}

.info {
  width: 40%;
  height: 100%;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-1;
}
</style>