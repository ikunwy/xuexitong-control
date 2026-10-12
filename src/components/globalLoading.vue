<script setup>
import { NSpin } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useLoadingStore } from '@/stores/loadingStore'

const { visible } = storeToRefs(useLoadingStore())
</script>

<template>
  <transition name="global-loading">
    <div v-if="visible" class="global-loading" role="status" aria-live="polite">
      <div class="global-loading__panel">
        <n-spin />
        <p class="global-loading__text">加载中…</p>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.global-loading {
  position: fixed;
  inset: 0;
  z-index: 7900;                     /* 低于 Naive UI 的 message/dialog (2000+) */
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, .32);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);

  &__panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 24px 32px;
    border-radius: 16px;
    min-width: 120px;
  }

  &__text {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    letter-spacing: .3px;
  }
}

/* 过渡动画 */
.global-loading-enter-active,
.global-loading-leave-active {
  transition: opacity .18s ease;
}

.global-loading-enter-active .global-loading__panel,
.global-loading-leave-active .global-loading__panel {
  transition: transform .22s cubic-bezier(.34, 1.36, .64, 1);
}

.global-loading-enter-from,
.global-loading-leave-to {
  opacity: 0;
}

.global-loading-enter-from .global-loading__panel,
.global-loading-leave-to .global-loading__panel {
  transform: scale(.92);
}
</style>