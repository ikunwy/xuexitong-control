import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { registerInstructionRoutesApi } from '@/api/course'

interface CourseProps {
  title: string[]
  img: string
  progress: string[]
  ts: number
}

export const useCourseStore = defineStore('course', () => {
  const courses = ref<any>([])
  const loading = ref(false)
  const currentCourse = ref<any>(null)
  const currentTitle = ref('')

  async function loadCourses() {
    loading.value = true
    try {
      const res = await registerInstructionRoutesApi('get_courses')
      courses.value = res.data.map((c: CourseProps) => ({ ...c, todayMinutes: 0 })) as any
    } finally {
      loading.value = false
    }
  }

  function setCurrent(c: CourseProps) {
    currentCourse.value = c
  }

  return {
    courses, loading, currentCourse, currentTitle,
    loadCourses, setCurrent
  }
}, {
  persist: { key: 'xxt_courses' }
})