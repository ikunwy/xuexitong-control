import request from '@/utils/request'

const routes_api = [
  'get_courses', // 获取课程列表
  'get_chapters_text', // 获取章节列表
  'course_control_stop', // 停止刷课
  'course_control_pause', // 暂停刷课
  'course_control_resume', // 恢复刷课
  'course_select', // 选课
  'tab_close_current', // 关闭当前标签页
  'histories_step', // 获取历史记录
] as const

export const registerInstructionRoutesApi = (instruction: typeof routes_api[number], params?: any) => {
  return request.get(`/commands/${instruction}`, {
    params
  })
}