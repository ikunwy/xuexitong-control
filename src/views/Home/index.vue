<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  NCard, NProgress, NList, NListItem, NThing, NIcon, NTag, NSkeleton, NEmpty
} from 'naive-ui'
import { ChevronForwardOutline } from '@vicons/ionicons5'
import { useUserStore } from '@/stores/userStore'
import { useCourseStore } from '@/stores/courseStore'

const router = useRouter()
const userStore = useUserStore()
const courseStore = useCourseStore()

const { courses, loading, totalProgress, todayMinutes, studyingCount, currentCourse } =
  storeToRefs(courseStore)

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return '夜深了'
  if (h < 12) return '早上好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
})

onMounted(() => courseStore.loadCourses())

function progressOf(c) {
  return Math.round((c.studiedMinutes / c.totalMinutes) * 100)
}

function openTimer(c) {
  if (!c) return
  courseStore.setCurrent(c.id)
  router.push({ name: 'timer' })
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <p class="hero__greet">{{ greeting }}，{{ userStore.profile.nickname }}</p>
      <h2 class="hero__title">今天也要专注学习哦</h2>
    </section>
    <!-- 概览卡片 -->
    <section class="stats">
      <n-card class="stat-card stat-card--primary" :bordered="false">
        <span class="stat-card__label">总体进度</span>
        <strong class="stat-card__value">{{ totalProgress }}<em>%</em></strong>
        <n-progress
          type="line"
          :percentage="totalProgress"
          :show-indicator="false"
          :height="5"
          color="#ffffff"
          rail-color="rgba(255,255,255,.35)"
          class="stat-card__progress"
        />
      </n-card>

      <n-card class="stat-card" :bordered="false">
        <span class="stat-card__label">今日学习</span>
        <strong class="stat-card__value">{{ todayMinutes }}<em>min</em></strong>
        <n-progress
          type="line"
          :percentage="goalPercent"
          :show-indicator="false"
          :height="5"
          color="#0b57d0"
          rail-color="#ebe9f0"
          class="stat-card__progress"
        />
      </n-card>

      <n-card class="stat-card" :bordered="false">
        <span class="stat-card__label">在学课程</span>
        <strong class="stat-card__value">{{ studyingCount }}<em>门</em></strong>
        <span class="stat-card__foot">共 {{ courses.length }} 门</span>
      </n-card>
    </section>

    <!-- 继续学习 -->
    <section v-if="currentCourse" class="section">
      <h3 class="section__title">继续学习</h3>

      <n-card
        class="continue-card"
        :bordered="false"
        hoverable
        @click="openTimer(currentCourse)"
      >
        <div class="continue-card__row">
          <div
            class="continue-card__icon"
            :style="{ background: currentCourse.accent + '1a', color: currentCourse.accent }"
          >
            {{ currentCourse.emoji }}
          </div>
          <div class="continue-card__body">
            <h4 class="continue-card__name">{{ currentCourse.name }}</h4>
            <p class="continue-card__chapter">{{ currentCourse.chapter }}</p>
            <n-progress
              type="line"
              :percentage="progressOf(currentCourse)"
              :show-indicator="false"
              :height="6"
              :color="currentCourse.accent"
              rail-color="#ebe9f0"
            />
          </div>
          <n-icon :component="ChevronForwardOutline" :size="20" class="continue-card__arrow" />
        </div>
      </n-card>
    </section>

    <!-- 全部课程 -->
    <section class="section">
      <header class="section__head">
        <h3 class="section__title">全部课程</h3>
        <router-link :to="{ name: 'courses' }" class="section__more">查看全部</router-link>
      </header>

      <n-skeleton v-if="loading" :repeat="3" text style="height: 72px; margin-bottom: 8px" />

      <n-list v-else-if="courses.length" class="course-list" hoverable clickable>
        <n-list-item
          v-for="c in courses.slice(0, 3)"
          :key="c.id"
          @click="openTimer(c)"
        >
          <n-thing>
            <template #avatar>
              <div
                class="cell-icon"
                :style="{ background: c.accent + '1a', color: c.accent }"
              >
                {{ c.emoji }}
              </div>
            </template>
            <template #header>
              <span class="cell-title">{{ c.name }}</span>
            </template>
            <template #description>
              <span class="cell-desc">{{ c.teacher }} · 已学 {{ c.studiedMinutes }} 分钟</span>
            </template>
            <template #header-extra>
              <n-tag
                size="small"
                round
                :color="{ color: c.accent + '14', textColor: c.accent, borderColor: 'transparent' }"
              >
                {{ progressOf(c) }}%
              </n-tag>
            </template>
          </n-thing>
        </n-list-item>
      </n-list>

      <n-empty v-else description="暂无课程" />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.home { display: flex; flex-direction: column; gap: $space-6; }

.hero {
  &__greet {
    margin: 0 0 $space-1;
    font-size: $font-label;
    color: $on-surface-variant;
  }
  &__title {
    margin: 0;
    font-size: $font-headline;
    font-weight: 700;
    color: $on-surface;
  }
}

.stats {
  display: grid;
  grid-template-columns: 1.25fr 1fr 1fr;
  gap: $space-3;
}

.stat-card {
  min-height: 108px;
  border-radius: $radius-lg !important;
  box-shadow: $shadow-1;

  :deep(.n-card__content) {
    padding: $space-3 $space-3 $space-4;
    display: flex;
    flex-direction: column;
    gap: $space-2;
    height: 100%;
  }

  &__label {
    font-size: $font-label;
    color: $on-surface-variant;
  }

  &__value {
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
    color: $on-surface;

    em {
      font-style: normal;
      font-size: 12px;
      font-weight: 600;
      margin-left: 2px;
      color: $on-surface-variant;
    }
  }

  &__foot { font-size: 12px; color: $on-surface-variant; }

  &__progress { margin-top: auto; }

  &--primary {
    background: linear-gradient(135deg, $primary, $primary-light) !important;

    .stat-card__label,
    .stat-card__value,
    .stat-card__value em { color: $on-primary !important; }
    .stat-card__value em { opacity: .8; }
  }
}

.section {
  display: flex;
  flex-direction: column;
  gap: $space-3;

  &__head { @include flex-between; }
  &__title {
    margin: 0;
    font-size: $font-title;
    font-weight: 650;
    color: $on-surface;
  }
  &__more {
    font-size: $font-label;
    font-weight: 600;
    color: $primary;
  }
}

.continue-card {
  cursor: pointer;
  border-radius: $radius-lg !important;
  box-shadow: $shadow-1;

  :deep(.n-card__content) { padding: $space-4; }
}

.continue-card__row {
  display: flex;
  align-items: center;
  gap: $space-3;
}

.continue-card__icon {
  @include flex-center;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border-radius: $radius-md;
  font-size: 24px;
}

.continue-card__body { flex: 1; min-width: 0; }

.continue-card__name {
  margin: 0 0 2px;
  font-size: $font-body;
  font-weight: 650;
  @include ellipsis;
}

.continue-card__chapter {
  margin: 0 0 $space-2;
  font-size: $font-label;
  color: $on-surface-variant;
  @include ellipsis;
}

.continue-card__arrow { color: $outline; flex-shrink: 0; }

.course-list {
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-1;
}

.cell-icon {
  @include flex-center;
  width: 40px;
  height: 40px;
  border-radius: $radius-md;
  font-size: 18px;
}

.cell-title { font-size: 14.5px; font-weight: 600; }
.cell-desc  { font-size: 12px; }
</style>