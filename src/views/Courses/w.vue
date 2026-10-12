<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCourseStore } from '@/stores/courseStore'
import { registerInstructionRoutesApi } from '@/api/course'

const router = useRouter()
const courseStore = useCourseStore()
const { courses, loading, currentTitle } = storeToRefs(courseStore)
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

const loadingOpen = ref(false)
async function open(c: any) {
  loadingOpen.value = true
  try {
    await registerInstructionRoutesApi('course_select', { name: c.title.length && c.title[0] })
    courseStore.setCurrent(c)
    router.push({ name: 'timer' })
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
    <!-- 搜索 — VarInput -->
    <var-input v-model="keyword" placeholder="搜索课程或教师" clearable class="search">
      <template #prepend-icon>
        <var-icon name="magnify" :size="18" />
      </template>
    </var-input>

    <var-space>
      <!-- <var-checkbox-group @change="handleCheckbox" ref="group" v-model="filterdCondition">
        <var-checkbox checked-value="all">全部</var-checkbox>
        <var-checkbox checked-value="unfinished">未完成</var-checkbox>
        <var-checkbox checked-value="finished">已完成</var-checkbox>
      </var-checkbox-group> -->
      <var-menu-select @select="handleSelect" size="small" placement="bottom" v-model="filterdSelectValue">
        <var-button size="small" type="primary">{{ filterdSelectValue ? selectTextMap[filterdSelectValue] : '筛选课程'
        }}</var-button>
        <template #options>
          <var-menu-option label="全部" value="all" />
          <var-menu-option label="未完成" value="unfinished" />
          <var-menu-option label="已完成" value="finished" />
        </template>
      </var-menu-select>
    </var-space>

    <!-- 骨架屏 -->
    <div v-if="loading" class="skeleton-list">
      <var-skeleton v-for="i in 4" :key="i" :loading="true" :rows="3" class="skeleton-item" />
    </div>



    <!-- 课程列表 — VarCard -->
    <var-loading v-else-if="filtered.length && courses.length" description="正在进入课程章节..." :loading="loadingOpen">
      <div class="list">
        <div v-for="c in filtered" :key="c.id">
          <div class="card" @click="() => open(c)">
            <img style="width: 100%;height: 200px;" referrerpolicy="no-referrer" :src="c.img" />
            <div class="card-info">
              <div class="title">
                <div v-for="t in c.title" :key="t">{{ t }}</div>
                <div v-if="c?.progress?.length">{{c.progress.map((p: string) => p + ' ').join('')}}</div>
                <div v-else>没有任务点，无需看课</div>
              </div>
              <div class="progress">
                <var-progress :value="c?.progress?.length ? c.progress[1].replace('%') : 100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </var-loading>
    <!-- 空态 -->
    <var-empty v-else description="没有找到相关课程" />
  </div>
</template>

<style lang="scss" scoped>
.courses {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.search {
  --input-decorator-padding: 0 16px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.course-card {
  cursor: pointer;

  :deep(.var-card__content) {
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }
}

.card {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: $radius-xs;
  overflow: hidden;

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

    .progress {
      position: absolute;
      right: -155px;
      top: 50%;
      width: 170px;
      transform: translateX(-50%) rotateZ(-270deg);
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
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.skeleton-item {
  --skeleton-border-radius: #{$radius-lg};
}
</style>