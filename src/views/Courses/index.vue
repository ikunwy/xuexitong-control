<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  NInput, NCard, NProgress, NTag, NSkeleton, NEmpty, NIcon
} from 'naive-ui'
import { SearchOutline } from '@vicons/ionicons5'
import { useCourseStore } from '@/stores/courseStore'
import { registerInstructionRoutesApi } from '@/api/course'


const router = useRouter()
const courseStore = useCourseStore()
const { courses, loading } = storeToRefs(courseStore)
const keyword = ref('')

const coursesRaw = ref(courses.value)

const filtered = computed(() => {
  const k = keyword.value.trim().toLowerCase()
  if (!k) return courses.value
  return courses.value.filter(
    (c: any) => c.title.map((t: string) => t).join('').toLowerCase().includes(k) || c.title.map((t: string) => t).join('').toLowerCase().includes(k)
  )
})

onMounted(() => courseStore.loadCourses())

function progressOf(c: any) {
  return c?.progress?.length ? +(c.progress[1].replace('%', '')) : 100
}

const loadingOpen = ref(false)
async function open(c: any) {
  loadingOpen.value = true
  try {
    // await registerInstructionRoutesApi('course_select', { name: c.title.length && c.title[0] })
    courseStore.setCurrent(c)
    router.push({ name: 'timer', query: { courseTitle: c.title.length && c.title[0] } })
  } finally {
    loadingOpen.value = false
  }
}

const filterdSelectValue = ref<string>('')
const selectTextMap: any = {
  'all': '全部',
  'unfinished': '未完成',
  'finished': '已完成'
}
const handleSelect = (e: 'all' | 'unfinished' | 'finished') => {
  filterdSelectValue.value = e
  courses.value = coursesRaw.value.filter((c: any) => {
    if (e === 'all') return true
    if (e === 'unfinished') {
      return c?.progress?.length && +c.progress[1].replace('%', '') < 100
    }
    if (e === 'finished') return !c.progress.length
  })
}
</script>

<template>
  <div class="courses">
    <n-input v-model:value="keyword" placeholder="搜索课程或教师" clearable size="large">
      <template #prefix>
        <n-icon :component="SearchOutline" />
      </template>
    </n-input>

    <div v-if="loading" class="skeleton-list">
      <n-skeleton v-for="i in 18" :key="i" height="300px" :sharp="false" style="border-radius: 16px" />
    </div>

    <div v-else-if="filtered.length">
      <div class="list">
        <div v-for="c in filtered" :key="c.id" class="list_item">
          <div class="card" @click="() => open(c)">
            <img style="width: 100%;height: 300px; object-fit: cover;" referrerpolicy="no-referrer" :src="c.img" />
            <div class="card-info">
              <div class="title">
                <div v-for="t in c.title" :key="t">{{ t }}</div>
                <div v-if="c?.progress?.length">{{c.progress.map((p: string) => p + ' ').join('')}}</div>
                <div v-else>没有任务点，无需看课</div>
              </div>
              <div class="progress">
                <n-progress type="line" :percentage="progressOf(c)" :show-indicator="false" :height="6"
                  :color="c.accent" rail-color="#ebe9f0" class="card-bar" />
              </div>
              <div class="just_start">点击卡片立即开始</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <n-empty v-else description="没有找到相关课程" />
  </div>
</template>

<style lang="scss" scoped>
.courses {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.list {
  width: 100%;
  display: grid;
  flex-wrap: wrap;
  gap: $space-3;
  grid-template-columns: repeat(3, 1fr);

  &>div {
    width: 100%;
  }
}

.card {
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: $radius-xs;
  overflow: hidden;
  transition: all .3s ease-in-out;

  .just_start {
    position: absolute;
    left: 50%;
    bottom: 10px;
    transform: translateX(-50%) translateY(100px);
    opacity: 0;
    color: #fff;
    transition: all .3s ease-in-out;
  }

  &:hover {
    cursor: pointer;
    .just_start {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  .card-info {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    transition: all .3s ease-in-out;

    .progress {
      position: absolute;
      right: -155px;
      top: 50%;
      width: 170px;
      transform: translateX(-50%) rotateZ(270deg);
    }

    .title {
      display: flex;
      flex-direction: column;
      gap: 3px;
      padding: $space-2;
      padding-right: 35px;

      div {
        text-align: end;
        color: #fff;
        font-size: $font-label;
      }
    }
  }
}

.course-card {
  cursor: pointer;
  border-radius: $radius-lg !important;
  box-shadow: $shadow-1;

  :deep(.n-card__content) {
    padding: $space-4;
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }
}

.card-head {
  display: flex;
  align-items: center;
  gap: $space-3;
}

.card-icon {
  @include flex-center;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  border-radius: $radius-md;
  font-size: 22px;
}

.card-title {
  flex: 1;
  min-width: 0;

  h3 {
    margin: 0 0 2px;
    font-size: 15px;
    font-weight: 650;
    @include ellipsis;
  }

  p {
    margin: 0;
    font-size: 12px;
    color: $on-surface-variant;
    @include ellipsis;
  }
}

.card-chapter {
  margin: 0;
  font-size: 13px;
  color: $on-surface-variant;
  @include ellipsis;
}

.card-foot {
  display: flex;
  align-items: center;
  gap: $space-3;
}

.card-bar {
  flex: 1;
}

.card-time {
  flex-shrink: 0;
  font-size: 11.5px;
  font-weight: 600;
  color: $on-surface-variant;
  font-variant-numeric: tabular-nums;
}

.skeleton-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  flex-direction: column;
  gap: $space-3;
}
</style>