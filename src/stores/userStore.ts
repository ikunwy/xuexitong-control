import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('xxt_token') || '')
  const profile = ref({
    nickname: '同学',
    studentId: '2021010101',
    college: '计算机学院'
  })

  const isLogged = computed(() => !!token.value)

  function login(nickname: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        token.value = `mock-token-${Date.now()}`
        profile.value.nickname = nickname || '同学'
        localStorage.setItem('xxt_token', token.value)
        resolve(true)
      }, 450)
    })
  }

  function logout() {
    token.value = ''
    localStorage.removeItem('xxt_token')
  }

  return { token, profile, isLogged, login, logout }
}, {
  persist: { key: 'xxt_user' }
})