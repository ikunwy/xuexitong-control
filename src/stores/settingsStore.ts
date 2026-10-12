// src/stores/settingsStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getConfigApi } from '@/api/config'

/* ---------------- 默认配置 ---------------- */
const DEFAULT_SETTINGS = {
  log_level: 'INFO',

  engine: {
    mode: 'timer',      // timer = 正计时 / pomodoro = 番茄钟
    courses: [],        // 参与统计的课程 id
    interval: 25        // 番茄钟时长（分钟）
  },

  profile: {
    enabled: true,
    nickname: '同学',
    college: '计算机学院',
    student_id: '2021010101'
  },

  api: {
    enabled: false,     // 是否把学习记录同步到自建后端
    host: '127.0.0.1',
    port: 8765,
    log_level: 'warning',
    token: ''
  },

  reminder: {
    enabled: true,
    time: '20:00',
    weekdays: [1, 2, 3, 4, 5],   // 1=周一 ... 7=周日
    sound: true
  },

  course: {
    name: '创新创业',
    index: 0,
    recognition_mode: 1          // 1 = 自动识别 / 2 = 手动选择
  },

  ui: {
    theme: 'light',              // light / dark / auto
    primary_color: '#0b57d0',
    font_size: 15
  },

  timer: {
    default_duration: 25,
    break_duration: 5,
    auto_start_break: true
  },

  media: {
    playback_rate: 1.0,
    mute: false,
    remember_position: true
  },

  // 运行状态（只读展示）
  running: false,
  paused: false,
  step: null
}

function deepClone(obj: Object) {
  return JSON.parse(JSON.stringify(obj))
}

export const useSettingsStore = defineStore('settings', () => {
  const settings   = ref(null)
  const loading    = ref(false)
  const saving     = ref(false)
  const lastSavedAt: any = ref(null)

  /* ---------------- 拉取 ---------------- */
  async function load(force = false) {
    loading.value = true
    try {
      // 真实项目：
      const res = await getConfigApi()
      settings.value = res.data
    } finally {
      loading.value = false
    }
  }

  /* ---------------- 保存 ---------------- */
  async function save() {
    saving.value = true
    try {
      // 真实项目：
      // await request.post('/settings', settings.value)
      await new Promise((r) => setTimeout(r, 400))
      lastSavedAt.value = Date.now()
    } finally {
      saving.value = false
    }
  }

  /* ---------------- 恢复默认 ---------------- */
  function reset() {
    settings.value = deepClone(DEFAULT_SETTINGS)
  }

  /* ---------------- 导出 JSON ---------------- */
  const asJSON = computed(() =>
    JSON.stringify(
      settings.value,
      null,
      2
    )
  )

  return {
    settings,
    loading,
    saving,
    lastSavedAt,
    asJSON,
    load,
    save,
    reset
  }
}, {
  persist: { key: 'xxt_settings' }
})