<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import {
    NCard, NForm, NFormItem,
    NInput, NInputNumber, NSwitch, NSelect, NSlider,
    NTimePicker, NColorPicker, NButton, NIcon, NTag,
    NCheckbox, NCheckboxGroup, NSpace,
    NScrollbar, useMessage, useDialog
} from 'naive-ui'
import {
    SaveOutline, RefreshOutline, PlayCircleOutline, PauseCircleOutline,
    ServerOutline, PersonOutline, NotificationsOutline, BookOutline,
    ColorPaletteOutline, TimerOutline, VideocamOutline, CogOutline
} from '@vicons/ionicons5'
import { useSettingsStore } from '@/stores/settingsStore'

const message = useMessage()
const dialog = useDialog()
const settingsStore = useSettingsStore()
const { settings, saving, lastSavedAt } = storeToRefs(settingsStore)

/* ---------------- 选项常量 ---------------- */
const LOG_LEVEL_OPTIONS = [
    { label: 'DEBUG', value: 'DEBUG' },
    { label: 'INFO', value: 'INFO' },
    { label: 'WARNING', value: 'warning' },
    { label: 'ERROR', value: 'ERROR' }
]

const ENGINE_MODE_OPTIONS = [
    { label: '正计时', value: 'timer' },
    { label: '番茄钟', value: 'pomodoro' }
]

const THEME_OPTIONS = [
    { label: '浅色', value: 'light' },
    { label: '深色', value: 'dark' },
    { label: '跟随系统', value: 'auto' }
]

const RECOGNITION_MODE_OPTIONS = [
    { label: '自动识别', value: 1 },
    { label: '手动选择', value: 2 }
]

const PLAYBACK_RATE_OPTIONS = [
    { label: '0.5x', value: 0.5 },
    { label: '0.75x', value: 0.75 },
    { label: '1.0x', value: 1.0 },
    { label: '1.25x', value: 1.25 },
    { label: '1.5x', value: 1.5 },
    { label: '2.0x', value: 2.0 }
]

const WEEKDAY_OPTIONS = [
    { label: '一', value: 1 },
    { label: '二', value: 2 },
    { label: '三', value: 3 },
    { label: '四', value: 4 },
    { label: '五', value: 5 },
    { label: '六', value: 6 },
    { label: '日', value: 7 }
]

const COURSE_SELECT_OPTIONS = [
    { label: '全部课程', value: 'all' },
    { label: '马克思主义基本原理', value: 1 },
    { label: '大学英语（四）', value: 2 },
    { label: '线性代数', value: 3 },
    { label: '中国近现代史纲要', value: 4 }
]

/* ---------------- 状态展示 ---------------- */
const runStateText = computed(() => {
    if (settings.value.running && !settings.value.paused) return '运行中'
    if (settings.value.running && settings.value.paused) return '已暂停'
    return '空闲'
})

const runStateType = computed(() => {
    if (settings.value.running && !settings.value.paused) return 'success'
    if (settings.value.running && settings.value.paused) return 'warning'
    return 'default'
})

const savedText = computed(() => {
    if (!lastSavedAt.value) return '尚未保存'
    const d = new Date(lastSavedAt.value)
    const pad = (n) => String(n).padStart(2, '0')
    return `上次保存 ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
})

/* ---------------- 操作 ---------------- */
onMounted(() => settingsStore.load())

async function handleSave() {
    await settingsStore.save()
    message.success('设置已保存')
}

function handleReset() {
    dialog.warning({
        title: '恢复默认设置',
        content: '所有配置将恢复为初始值，此操作不可撤销。',
        positiveText: '恢复',
        negativeText: '取消',
        onPositiveClick: () => {
            settingsStore.reset()
            message.success('已恢复默认设置')
        }
    })
}
</script>

<template>
    <div class="settings">
        <!-- 顶部操作栏 -->
        <div class="action-bar">
            <div class="action-bar__status">
                <n-tag :type="runStateType" size="small" round>
                    {{ runStateText }}
                </n-tag>
                <span class="action-bar__saved">{{ savedText }}</span>
            </div>

            <n-space :size="8">
                <n-button size="small" round :disabled="saving" @click="handleReset">
                    <template #icon>
                        <n-icon :component="RefreshOutline" />
                    </template>
                    恢复默认
                </n-button>
                <n-button type="primary" size="small" round :loading="saving" @click="handleSave">
                    <template #icon>
                        <n-icon :component="SaveOutline" />
                    </template>
                    保存
                </n-button>
            </n-space>
        </div>

        <!-- 两列卡片区 -->
        <div class="settings__grid">
            <!-- ============ 左列 ============ -->
            <div class="settings__col">
                <!-- 引擎 -->
                <n-collapse arrow-placement="right">
                    <n-card class="settings__card" :bordered="false" size="small">
                        <n-collapse-item name="1">
                            <template #header>
                                <div class="card-title">
                                    <n-icon :component="CogOutline" :size="18" />
                                    <span>登录</span>
                                </div>
                            </template>
                            <n-form label-placement="left" label-width="96">
                                <n-form-item label="自启动">
                                    <n-switch v-model:value="settings.login.enabled" />
                                </n-form-item>
                                <n-form-item label="账号">
                                    <n-input v-model:value="settings.login.username" />
                                </n-form-item>
                                <n-form-item label="密码">
                                    <n-input v-model:value="settings.login.password" />
                                </n-form-item>
                                <n-form-item label="网址">
                                    <n-input v-model:value="settings.login.url" />
                                </n-form-item>
                                <n-divider title-placement="left">
                                    定位元素
                                </n-divider>
                                <n-form-item label="账号输入框">
                                    <n-input v-model:value="settings.login.selectors.phone" />
                                </n-form-item>
                                <n-form-item label="密码输入框">
                                    <n-input v-model:value="settings.login.selectors.pwd" />
                                </n-form-item>
                                <n-form-item label="登录按钮">
                                    <n-input v-model:value="settings.login.selectors.login_btn" />
                                </n-form-item>
                                <n-form-item label="判断登录成功">
                                    <n-input v-model:value="settings.login.selectors.success_selector" />
                                </n-form-item>
                            </n-form>
                        </n-collapse-item>
                    </n-card>


                    <!-- 账号信息 -->
                    <n-card class="settings__card" :bordered="false" size="small">
                        <template #header>
                            <div class="card-title">
                                <n-icon :component="PersonOutline" :size="18" />
                                <span>账号信息</span>
                            </div>
                        </template>

                        <n-form label-placement="left" label-width="96" size="medium">
                            <!-- <n-form-item label="启用展示">
              <n-switch v-model:value="settings.profile.enabled" />
            </n-form-item>
            <n-form-item label="昵称">
              <n-input v-model:value="settings.profile.nickname" placeholder="请输入昵称" />
            </n-form-item>
            <n-form-item label="学院">
              <n-input v-model:value="settings.profile.college" placeholder="请输入学院" />
            </n-form-item>
            <n-form-item label="学号">
              <n-input v-model:value="settings.profile.student_id" placeholder="请输入学号" />
            </n-form-item> -->
                        </n-form>
                    </n-card>

                    <!-- 学习提醒 -->
                    <n-card class="settings__card" :bordered="false" size="small">
                        <template #header>
                            <div class="card-title">
                                <n-icon :component="NotificationsOutline" :size="18" />
                                <span>学习提醒</span>
                            </div>
                        </template>

                        <n-form label-placement="left" label-width="96" size="medium">
                            <!-- <n-form-item label="启用提醒">
              <n-switch v-model:value="settings.reminder.enabled" />
            </n-form-item>
            <n-form-item label="提醒时间">
              <n-time-picker
                v-model:formatted-value="settings.reminder.time"
                format="HH:mm"
                value-format="HH:mm"
                :disabled="!settings.reminder.enabled"
                style="width: 100%"
              />
            </n-form-item>
            <n-form-item label="重复">
              <n-checkbox-group
                v-model:value="settings.reminder.weekdays"
                :disabled="!settings.reminder.enabled"
              >
                <n-space :size="4">
                  <n-checkbox
                    v-for="d in WEEKDAY_OPTIONS"
                    :key="d.value"
                    :value="d.value"
                    :label="d.label"
                  />
                </n-space>
              </n-checkbox-group>
            </n-form-item>
            <n-form-item label="提示音">
              <n-switch
                v-model:value="settings.reminder.sound"
                :disabled="!settings.reminder.enabled"
              />
            </n-form-item> -->
                        </n-form>
                    </n-card>

                    <!-- 数据同步 -->
                    <n-card class="settings__card" :bordered="false" size="small">
                        <template #header>
                            <div class="card-title">
                                <n-icon :component="ServerOutline" :size="18" />
                                <span>数据同步</span>
                            </div>
                        </template>

                        <n-form label-placement="left" label-width="96" size="medium">
                            <n-form-item label="启用同步">
                                <n-switch v-model:value="settings.api.enabled" />
                            </n-form-item>
                            <n-form-item label="服务地址">
                                <n-input v-model:value="settings.api.host" placeholder="127.0.0.1"
                                    :disabled="!settings.api.enabled" />
                            </n-form-item>
                            <n-form-item label="端口">
                                <n-input-number v-model:value="settings.api.port" :min="1" :max="65535"
                                    :disabled="!settings.api.enabled" style="width: 100%" />
                            </n-form-item>
                            <n-form-item label="日志级别">
                                <n-select v-model:value="settings.api.log_level" :options="LOG_LEVEL_OPTIONS"
                                    :disabled="!settings.api.enabled" />
                            </n-form-item>
                            <n-form-item label="访问令牌">
                                <n-input v-model:value="settings.api.token" type="password" show-password-on="click"
                                    placeholder="可选" :disabled="!settings.api.enabled" />
                            </n-form-item>
                        </n-form>
                    </n-card>
                </n-collapse>
            </div>

            <!-- ============ 右列 ============ -->
            <div class="settings__col">
                <!-- 课程偏好 -->
                <n-card class="settings__card" :bordered="false" size="small">
                    <template #header>
                        <div class="card-title">
                            <n-icon :component="BookOutline" :size="18" />
                            <span>API服务</span>
                        </div>
                    </template>

                    <n-form label-placement="left" label-width="96" size="medium">
                        <n-form-item label="自启动">
                            <n-switch v-model:value="settings.api.enabled" />
                        </n-form-item>
                        <n-form-item label="IP地址">
                            <n-input v-model:value="settings.api.host" />
                        </n-form-item>
                        <n-form-item label="端口">
                            <n-input-number v-model:value="settings.api.port" :min="0" :step="1" style="width: 100%" />
                        </n-form-item>
                    </n-form>
                </n-card>

                <!-- 计时 -->
                <n-card class="settings__card" :bordered="false" size="small">
                    <template #header>
                        <div class="card-title">
                            <n-icon :component="TimerOutline" :size="18" />
                            <span>计时</span>
                        </div>
                    </template>

                    <!-- <n-form label-placement="left" label-width="96" size="medium">
            <n-form-item label="默认时长">
              <n-input-number
                v-model:value="settings.timer.default_duration"
                :min="5" :max="180" :step="5"
                style="width: 100%"
              >
                <template #suffix>分钟</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="休息时长">
              <n-input-number
                v-model:value="settings.timer.break_duration"
                :min="1" :max="60" :step="1"
                style="width: 100%"
              >
                <template #suffix>分钟</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="自动进入休息">
              <n-switch v-model:value="settings.timer.auto_start_break" />
            </n-form-item>
          </n-form> -->
                </n-card>

                <!-- 播放 -->
                <n-card class="settings__card" :bordered="false" size="small">
                    <template #header>
                        <div class="card-title">
                            <n-icon :component="VideocamOutline" :size="18" />
                            <span>播放</span>
                        </div>
                    </template>

                    <!-- <n-form label-placement="left" label-width="96" size="medium">
            <n-form-item label="默认倍速">
              <n-select
                v-model:value="settings.media.playback_rate"
                :options="PLAYBACK_RATE_OPTIONS"
              />
            </n-form-item>
            <n-form-item label="默认静音">
              <n-switch v-model:value="settings.media.mute" />
            </n-form-item>
            <n-form-item label="记忆播放位置">
              <n-switch v-model:value="settings.media.remember_position" />
            </n-form-item>
          </n-form> -->
                </n-card>

                <!-- 运行状态 -->
                <!-- <n-card class="settings__card" :bordered="false" size="small">
          <template #header>
            <div class="card-title">
              <n-icon
                :component="settings.running && !settings.paused ? PlayCircleOutline : PauseCircleOutline"
                :size="18"
              />
              <span>运行状态</span>
            </div>
          </template>

          <n-form label-placement="left" label-width="96" size="medium">
            <n-form-item label="运行中">
              <n-tag :type="settings.running ? 'success' : 'default'" size="small" round>
                {{ settings.running ? '是' : '否' }}
              </n-tag>
            </n-form-item>
            <n-form-item label="已暂停">
              <n-tag :type="settings.paused ? 'warning' : 'default'" size="small" round>
                {{ settings.paused ? '是' : '否' }}
              </n-tag>
            </n-form-item>
            <n-form-item label="当前步骤">
              <n-tag size="small" round>{{ settings.step ?? '—' }}</n-tag>
            </n-form-item>
          </n-form>
        </n-card> -->
            </div>
        </div>

        <!-- JSON 预览：横跨整行 -->
        <n-card class="settings__card json-card" :bordered="false" size="small">
            <template #header>
                <span class="json-card__title">当前配置（JSON）</span>
            </template>
            <n-scrollbar style="max-height: 260px">
                <pre class="json-preview">{{ settingsStore.asJSON }}</pre>
            </n-scrollbar>
        </n-card>
    </div>
</template>

<style lang="scss" scoped>
.settings {
    display: flex;
    flex-direction: column;
    gap: $space-4;
}

/* ---------- 顶部操作栏 ---------- */
.action-bar {
    @include flex-between;
    gap: $space-3;
    padding: $space-3 $space-4;
    background: $surface;
    border-radius: $radius-lg;
    box-shadow: $shadow-1;
    position: sticky;
    top: $header-height;
    z-index: 10;

    &__status {
        display: flex;
        align-items: center;
        gap: $space-2;
        min-width: 0;
    }

    &__saved {
        font-size: 12px;
        color: $on-surface-variant;
        @include ellipsis;
    }
}

/* ---------- 两列布局 ---------- */
.settings__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-4;
    align-items: start;

    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
    }
}

.settings__col {
    display: flex;
    flex-direction: column;
    gap: $space-4;
    min-width: 0;
}

/* ---------- 卡片 ---------- */
.settings__card {
    border-radius: $radius-lg !important;
    box-shadow: $shadow-1;
    background-color: $surface;
    gap: 24px;

    :deep(.n-card-header) {
        padding: $space-3 $space-4;
        border-bottom: 1px solid rgba($outline-variant, .4);
    }

    :deep(.n-card__content) {
        padding: $space-3 $space-4 $space-4;
    }

    :deep(.n-form-item:last-child) {
        margin-bottom: 0;
    }
}

/* ---------- 卡片标题 ---------- */
.card-title {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: 14.5px;
    font-weight: 650;
    color: $on-surface;
}

/* ---------- JSON 预览 ---------- */
.json-card {
    &__title {
        font-size: 13px;
        font-weight: 600;
        color: $on-surface-variant;
    }
}

.json-preview {
    margin: 0;
    padding: $space-2;
    font-family: 'SF Mono', Menlo, Consolas, 'Courier New', monospace;
    font-size: 11.5px;
    line-height: 1.55;
    color: $on-surface-variant;
    white-space: pre-wrap;
    word-break: break-all;
}
</style>