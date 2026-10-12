<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/courseStore'
import {
  HomeOutline,
  BookOutline,
  SettingsOutline,
  RefreshOutline,
  PersonOutline,
  LaptopSharp
} from '@vicons/ionicons5'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()

const pageTitle = computed(() => route.meta.title || '学习通')

const navItems = [
  { name: 'home', icon: HomeOutline, label: '首页' },
  { name: 'courses', icon: BookOutline, label: '课程' },
  { name: 'profile', icon: PersonOutline, label: '我的' },
  { name: 'CDP', icon: LaptopSharp, label: 'CDP' },
  { name: 'settings', icon: SettingsOutline, label: '设置' },
]

/* ---------------- 弧形菜单参数 ---------------- */
const RADIUS = 120          // 距 FAB 圆心距离
const START_ANGLE = -80     // 起始角：正上方略偏右
const ANGLE_STEP = 28       // 每项逆时针偏转角度

const isOpen = ref(false)

/* 计算每个 Tab 的位移坐标，写入 CSS 变量 */
function itemStyle(index) {
  const angle = START_ANGLE - index * ANGLE_STEP      // 逆时针 = 角度递减
  const rad = (angle * Math.PI) / 180
  const x = Math.cos(rad) * RADIUS
  const y = Math.sin(rad) * RADIUS
  return {
    '--x': `${x.toFixed(2)}px`,
    '--y': `${y.toFixed(2)}px`,
    '--delay': `${index * 40}ms`                       // 展开时逐项延迟
  }
}

function toggle() { isOpen.value = !isOpen.value }
function close() { isOpen.value = false }

function goTo(item) {
  close()
  if (route.name !== item.name) router.push({ name: item.name })
}

function handleRefresh() {
  courseStore.loadCourses(true)
  Snackbar.success('已刷新')
}

/* 路由变化时自动收起菜单 */
watch(() => route.name, close)

/* ESC 关闭 */
function onKeydown(e) {
  if (e.key === 'Escape' && isOpen.value) close()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

function isActive(name) { return route.name === name }
</script>

<template>
  <div class="app-shell">
    <!-- 顶部 App Bar -->
    <header class="app-bar">
      <div class="app-bar__brand">
        <span class="brand-mark">学</span>
        <h1 class="app-bar__title">{{ pageTitle }}</h1>
        <div>正在刷课（当前课程：{{ courseStore.currentTitle }} 可切换UDP页面查看）</div>
      </div>
      <n-button text round @click="handleRefresh">
        <template #icon>
          <n-icon :component="RefreshOutline" :size="20" />
        </template>
      </n-button>
    </header>

    <!-- 页面内容 -->
    <main class="app-body">
      <router-view v-slot="{ Component, route: r }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="r.path" />
        </transition>
      </router-view>
    </main>

    <!-- 遮罩：点击关闭 -->
    <transition name="mask">
      <div v-if="isOpen" class="fab-mask" @click="close" />
    </transition>

    <!-- 右下角弧形 FAB 菜单 -->
    <div class="fab-menu" :class="{ 'is-open': isOpen }">
      <!-- Tab 项：沿逆时针方向展开 -->
      <button v-for="(item, i) in navItems" :key="item.name" class="fab-menu__item"
        :class="{ 'is-active': isActive(item.name) }" :style="itemStyle(i)" :aria-label="item.label"
        @click="goTo(item)">
        <n-icon :component="item.icon" :size="22" />
        <div>{{ item.label }}</div>
      </button>

      <!-- 触发按钮 -->
      <button class="fab-menu__trigger" :class="{ 'is-open': isOpen }" aria-label="菜单" @click="toggle">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.4"
          stroke-linecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  background: $surface-container-low;
}

/* ---------- App Bar ---------- */
.app-bar {
  position: sticky;
  top: 0;
  z-index: 20;
  height: $header-height;
  padding: 0 $space-4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: $surface;
  backdrop-filter: saturate(180%) blur(18px);
  -webkit-backdrop-filter: saturate(180%) blur(18px);
  border-bottom: 1px solid rgba($outline-variant, .45);

  &__brand {
    display: flex;
    align-items: center;
    gap: $space-2;
  }

  &__title {
    margin: 0;
    font-size: $font-title;
    font-weight: 600;
    color: $on-surface;
    letter-spacing: .2px;
  }
}

.brand-mark {
  @include flex-center;
  width: 28px;
  height: 28px;
  border-radius: $radius-sm;
  background: linear-gradient(135deg, $primary, $primary-light);
  color: $on-primary;
  font-size: 14px;
  font-weight: 700;
}

/* ---------- 内容区 ---------- */
.app-body {
  flex: 1;
  padding: $space-4 $space-4 calc(120px + env(safe-area-inset-bottom));
  width: 100%;
  margin: 0 auto;
}

/* ---------- 遮罩 ---------- */
.fab-mask {
  position: fixed;
  inset: 0;
  z-index: 110;
  background: rgba(0, 0, 0, .28);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

.mask-enter-active,
.mask-leave-active {
  transition: opacity .2s ease;
}

.mask-enter-from,
.mask-leave-to {
  opacity: 0;
}

/* ---------- FAB 弧形菜单 ---------- */
.fab-menu {
  position: fixed;
  right: 24px;
  bottom: calc(24px + env(safe-area-inset-bottom));
  width: 64px;
  height: 64px;
  z-index: 120;

  &__trigger {
    position: absolute;
    inset: 0;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, $primary, $primary-light);
    color: $on-primary;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 26px rgba($primary, .38);
    z-index: 2;
    transition:
      transform .32s cubic-bezier(.34, 1.56, .64, 1),
      box-shadow .28s ease;
    -webkit-tap-highlight-color: transparent;

    &:active {
      transform: scale(.94);
    }

    &.is-open {
      transform: rotate(135deg);
      box-shadow: 0 6px 18px rgba($primary, .28);
    }
  }

  &__item {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 52px;
    height: 52px;
    margin: -26px 0 0 -26px;
    border-radius: 50%;
    background: $surface;
    color: $on-surface-variant;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: $shadow-2;
    z-index: 1;

    opacity: 0;
    pointer-events: none;
    transform: translate(0, 0) scale(.4);
    transition:
      transform .34s cubic-bezier(.34, 1.56, .64, 1),
      opacity .18s ease,
      background-color .2s ease,
      color .2s ease;
    transition-delay: 0ms;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      cursor: pointer;

      div {
        color: #fff;
        transform: translate(0, 0);
        opacity: 1;
      }
    }

    div {
      position: absolute;
      top: -15px;
      left: -25px;
      color: #acacac;
      transform: translate(35px, 25px);
      opacity: 0;
      transition: all .2s ease-in-out;
    }

    .fab-menu.is-open & {
      opacity: 1;
      pointer-events: auto;
      transform: translate(var(--x), var(--y)) scale(1);
      transition-delay: var(--delay);
    }

    &.is-active {
      background: $primary;
      color: $on-primary;
    }

    &:active {
      transform: translate(var(--x), var(--y)) scale(.92);
    }
  }
}
</style>