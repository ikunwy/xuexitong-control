<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import { useCourseStore } from '@/stores/courseStore'

const router = useRouter()
const userStore = useUserStore()
const courseStore = useCourseStore()

const { profile } = storeToRefs(userStore)
const { totalProgress, todayMinutes, courses } = storeToRefs(courseStore)

const totalStudied = computed(() =>
  courses.value.reduce((a, c) => a + c.studiedMinutes, 0)
)

const settings = [
  { key: 'remind', label: '学习提醒', desc: '每天 20:00 推送', icon: 'bell-outline' },
  { key: 'theme',  label: '深色模式', desc: '跟随系统',        icon: 'weather-night' },
  { key: 'cache',  label: '清理缓存', desc: '12.4 MB',         icon: 'delete-outline' },
  { key: 'about',  label: '关于我们', desc: 'v1.0.0',          icon: 'information-outline' }
]

async function handleLogout() {
  await Dialog.confirm({
    title: '退出登录',
    message: '确定要退出当前账号吗？',
    confirmButtonText: '退出',
    cancelButtonText: '取消'
  })
  userStore.logout()
  router.replace({ name: 'login' })
}

function handleItem(key) {
  console.log('setting:', key)
}
</script>

<template>
  <div class="profile">
    <!-- 用户卡 — VarCard -->
    <var-card class="user-card" :elevation="true">
      <div class="user-card__row">
        <var-avatar :size="60" class="user-card__avatar">
          {{ profile.nickname.slice(0, 1) }}
        </var-avatar>
        <div class="user-card__info">
          <h2 class="user-card__name">{{ profile.nickname }}</h2>
          <p class="user-card__meta">{{ profile.college }} · {{ profile.studentId }}</p>
        </div>
      </div>
    </var-card>

    <!-- 学习统计 -->
    <var-card class="stats-card" :elevation="true">
      <div class="stats">
        <div class="stat">
          <strong>{{ totalProgress }}%</strong>
          <span>总进度</span>
        </div>
        <div class="stat">
          <strong>{{ todayMinutes }}</strong>
          <span>今日分钟</span>
        </div>
        <div class="stat">
          <strong>{{ Math.round(totalStudied / 60) }}</strong>
          <span>累计小时</span>
        </div>
        <div class="stat">
          <strong>{{ courses.length }}</strong>
          <span>课程数</span>
        </div>
      </div>
    </var-card>

    <!-- 设置列表 — VarCell -->
    <var-paper class="course-group" :elevation="1">
      <var-cell
        v-for="s in settings"
        :key="s.key"
        :title="s.label"
        :description="s.desc"
        ripple
        @click="handleItem(s.key)"
      >
        <template #icon>
          <var-icon :name="s.icon" :size="20" class="row-icon" />
        </template>
      </var-cell>
    </var-paper>

    <!-- 退出登录 — VarButton -->
    <var-button
      type="danger"
      text
      block
      class="logout"
      @click="handleLogout"
    >
      退出登录
    </var-button>
  </div>
</template>

<style lang="scss" scoped>
.profile { display: flex; flex-direction: column; gap: $space-5; }

.user-card {
  background: linear-gradient(135deg, $primary 0%, $primary-light 100%);

  :deep(.var-card__content) { padding: $space-5 $space-4; }

  &__row { display: flex; align-items: center; gap: $space-4; }

  &__avatar {
    --avatar-background: rgba(255, 255, 255, .22);
    --avatar-color: #fff;
    border: 1.5px solid rgba(255, 255, 255, .5);
    font-size: 24px;
    font-weight: 700;
  }

  &__info { min-width: 0; }

  &__name {
    margin: 0 0 4px;
    font-size: $font-title;
    font-weight: 700;
    color: $on-primary;
    @include ellipsis;
  }

  &__meta {
    margin: 0;
    font-size: $font-label;
    color: rgba(255, 255, 255, .85);
    @include ellipsis;
  }
}

.stats-card {
  :deep(.var-card__content) { padding: $space-4 0; }
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  position: relative;

  & + &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 12%;
    height: 76%;
    width: 1px;
    background: rgba($outline-variant, .55);
  }

  strong {
    font-size: 19px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  span { font-size: 11.5px; color: $on-surface-variant; }
}

.group { border-radius: $radius-lg; overflow: hidden; }
.row-icon { color: $on-surface-variant; }

.logout {
  --button-height: 52px;
  border-radius: $radius-full !important;
  font-weight: 650;
  letter-spacing: .3px;
}
</style>