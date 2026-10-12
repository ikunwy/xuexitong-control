<script setup>
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  zhCN,
  dateZhCN
} from 'naive-ui'
import { buildNaiveThemeOverrides } from '@/styles/naive-theme'
import GlobalLoading from '@/components/GlobalLoading.vue'

const themeOverrides = buildNaiveThemeOverrides()
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider placement="top-right">
      <n-dialog-provider>
        <router-view />
        <global-loading />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>