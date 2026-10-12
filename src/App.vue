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
import LoadingUpdate from '@/components/loadingUpdate.vue'

const themeOverrides = buildNaiveThemeOverrides()
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider placement="top-right">
      <n-dialog-provider>
        <loading-update />
        <router-view />
        <global-loading />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>