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

/* ---------------- 状态展示 ---------------- */
const runStateText = computed(() => {
    if (!settings.value) return '空闲'
    if (settings.value.running && !settings.value.paused) return '运行中'
    if (settings.value.running && settings.value.paused) return '已暂停'
    return '空闲'
})

const runStateType = computed(() => {
    if (!settings.value) return 'default'
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
    <div>
        <div class="settings" v-show="!settings || !Object.keys(settings).length">
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


            <!-- JSON 预览：横跨整行 -->
            <n-card class="settings__card json-card" :bordered="false" size="small">
                <template #header>
                    <span class="json-card__title">当前配置（JSON）</span>
                </template>
                <n-scrollbar style="max-height: 260px">
                    <pre class="json-preview" v-if="settings">{{ settingsStore.asJSON }}</pre>
                    <n-empty v-else description="暂无配置" />
                </n-scrollbar>
            </n-card>
        </div>
        <n-empty v-show="settings" description="配置" />
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