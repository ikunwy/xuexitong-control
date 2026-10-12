<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NInput, NButton, useMessage } from 'naive-ui'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const nickname = ref('')
const loading = ref(false)

async function handleLogin() {
  if (loading.value) return
  loading.value = true
  try {
    await userStore.login(nickname.value.trim())
    message.success('登录成功')
    router.replace({ name: 'courses' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login">
    <div class="login__hero">
      <div class="logo">学</div>
      <h1 class="login__title">学习通</h1>
      <p class="login__subtitle">让每一分钟学习都被看见</p>
    </div>

    <div class="login__form">
      <n-input
        v-model:value="nickname"
        placeholder="请输入昵称（可留空）"
        size="large"
        clearable
        @keyup.enter="handleLogin"
      />

      <n-button
        type="primary"
        size="large"
        block
        :loading="loading"
        @click="handleLogin"
      >
        进入学习
      </n-button>

      <p class="login__hint">本地演示账号 · 数据仅保存在浏览器</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  min-height: 100vh;
  min-height: 100dvh;
  padding: $space-8 $space-6;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: $space-8;
  background:
    radial-gradient(120% 60% at 50% 0%, $primary-container 0%, transparent 60%),
    $surface;

  &__hero {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-3;
  }

  &__title {
    margin: 0;
    font-size: $font-display;
    font-weight: 700;
    color: $on-surface;
  }

  &__subtitle {
    margin: 0;
    font-size: $font-body;
    color: $on-surface-variant;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: $space-4;
    max-width: 400px;
    width: 100%;
    margin: 0 auto;
  }

  &__hint {
    margin: 0;
    text-align: center;
    font-size: $font-label;
    color: $on-surface-variant;
  }
}

.logo {
  @include flex-center;
  width: 76px;
  height: 76px;
  border-radius: $radius-xl;
  background: linear-gradient(135deg, $primary, $primary-light);
  color: $on-primary;
  font-size: 34px;
  font-weight: 700;
  box-shadow: $shadow-3;
}
</style>