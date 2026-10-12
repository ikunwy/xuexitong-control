import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const pendingCount = ref(0)   // 并发请求计数
  const visible = ref(false)    // 遮罩是否显示

  let showTimer: any = null
  let hideTimer: any = null

  const isLoading = computed(() => pendingCount.value > 0)

  /**
   * 请求开始：计数 +1
   * 延迟 200ms 显示，避免快速请求导致的闪烁
   */
  function start(delay = 200) {
    pendingCount.value++
    // 有请求进来，取消待执行的隐藏
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }

    // 已有显示中的遮罩，或已有待显示定时器，不再重复设置
    if (visible.value || showTimer) return

    showTimer = setTimeout(() => {
      if (pendingCount.value > 0) visible.value = true
      showTimer = null
    }, delay)
  }

  /**
   * 请求结束：计数 -1
   * 计数归零时延迟 150ms 隐藏，避免连续请求之间的闪烁
   */
  function stop() {
    pendingCount.value = Math.max(0, pendingCount.value - 1)
    if (pendingCount.value > 0) return

    if (showTimer) {
      clearTimeout(showTimer)
      showTimer = null
    }

    hideTimer = setTimeout(() => {
      visible.value = false
      hideTimer = null
    }, 150)
  }

  /** 强制清空（比如退出登录、路由跳转时） */
  function forceHide() {
    pendingCount.value = 0
    visible.value = false
    if (showTimer) { clearTimeout(showTimer); showTimer = null }
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
  }

  return { pendingCount, visible, isLoading, start, stop, forceHide }
})