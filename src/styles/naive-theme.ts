// src/styles/naive-theme.js
// 从 :root 上的 CSS 变量读取 M3 token，组装 Naive UI themeOverrides

function cssVar(name: any, fallback = '') {
  if (typeof window === 'undefined') return fallback
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback
  )
}

/**
 * 构建 Naive UI 主题覆盖
 * 需在 DOM 挂载后调用（onMounted 或 setup 里同步执行均可，只要 <style> 已注入）
 */
export function buildNaiveThemeOverrides() {
  const primary          = cssVar('--m3-primary',          '#0b57d0')
  const primaryLight     = cssVar('--m3-primary-light',    '#4a7fe8')
  const primaryPressed   = cssVar('--m3-primary-pressed',  '#0a4bb8')
  const primaryContainer = cssVar('--m3-primary-container','#d3e3fd')
  const onPrimary        = cssVar('--m3-on-primary',       '#ffffff')

  const surface          = cssVar('--m3-surface',          '#fdfbff')
  const surfaceLow       = cssVar('--m3-surface-low',      '#f7f5fb')
  const surfaceContainer = cssVar('--m3-surface-container','#f1eff6')
  const surfaceHigh      = cssVar('--m3-surface-high',     '#ebe9f0')
  const onSurface        = cssVar('--m3-on-surface',       '#1b1b1f')
  const onSurfaceVariant = cssVar('--m3-on-surface-variant','#44464f')

  const outline          = cssVar('--m3-outline',          '#74777f')
  const outlineVariant   = cssVar('--m3-outline-variant',  '#c4c6d0')

  const success          = cssVar('--m3-success',          '#146c2e')
  const warning          = cssVar('--m3-warning',          '#7a5900')
  const error            = cssVar('--m3-error',            '#ba1a1a')

  const radiusSm   = cssVar('--m3-radius-sm',   '8px')
  const radiusMd   = cssVar('--m3-radius-md',   '12px')
  const radiusLg   = cssVar('--m3-radius-lg',   '16px')
  const radiusXl   = cssVar('--m3-radius-xl',   '24px')
  const radiusFull = cssVar('--m3-radius-full', '999px')

  const fontFamily = cssVar('--m3-font-family') ||
    `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ` +
    `'Helvetica Neue', 'PingFang SC', 'Microsoft YaHei', sans-serif`

  return {
    common: {
      primaryColor:         primary,
      primaryColorHover:    primaryLight,
      primaryColorPressed:  primaryPressed,
      primaryColorSuppl:    primaryLight,

      infoColor:            primary,
      infoColorHover:       primaryLight,
      infoColorPressed:     primaryPressed,

      successColor:         success,
      successColorHover:    '#1a8138',
      successColorPressed:  '#0f5622',
      successColorSuppl:    '#1a8138',

      warningColor:         warning,
      warningColorHover:    '#946d00',
      warningColorPressed:  '#5e4500',
      warningColorSuppl:    '#946d00',

      errorColor:           error,
      errorColorHover:      '#d02b2b',
      errorColorPressed:    '#951414',
      errorColorSuppl:      '#d02b2b',

      textColorBase:        onSurface,
      textColor1:           onSurface,
      textColor2:           onSurfaceVariant,

      bodyColor:            surfaceLow,
      cardColor:            surface,
      modalColor:           surface,
      popoverColor:         surface,

      borderColor:          outlineVariant,
      dividerColor:         outlineVariant,

      borderRadius:         radiusMd,
      borderRadiusSmall:    radiusSm,

      fontFamily,
      fontSize:             '15px',
      fontSizeMedium:       '15px',

      heightMedium:         '44px',
      heightLarge:          '52px'
    },

    Button: {
      borderRadiusTiny:     radiusFull,
      borderRadiusSmall:    radiusFull,
      borderRadiusMedium:   radiusFull,
      borderRadiusLarge:    radiusFull,
      heightMedium:         '44px',
      heightLarge:          '52px',
      fontWeight:           '600',
      fontWeightStrong:     '700'
    },

    Card: {
      borderRadius:         radiusLg,
      paddingMedium:        '16px',
      paddingLarge:         '20px',
      color:                surface
    },

    Input: {
      borderRadius:         radiusMd,
      heightMedium:         '44px',
      heightLarge:          '52px',
      color:                surface,
      colorFocus:           surface,
      border:               `1px solid ${outlineVariant}`,
      borderHover:          `1px solid ${primaryLight}`,
      borderFocus:          `1px solid ${primary}`,
      boxShadowFocus:       `0 0 0 3px ${primary}24`
    },

    Select: {
      peers: {
        InternalSelection: {
          borderRadius:     radiusMd,
          heightMedium:     '44px',
          heightLarge:      '52px',
          border:           `1px solid ${outlineVariant}`,
          borderHover:      `1px solid ${primaryLight}`,
          borderFocus:      `1px solid ${primary}`,
          borderActive:     `1px solid ${primary}`,
          boxShadowFocus:   `0 0 0 3px ${primary}24`,
          boxShadowActive:  `0 0 0 3px ${primary}24`
        }
      }
    },

    List: {
      borderRadius:         radiusLg,
      color:                surface,
      colorHover:           surfaceLow,
      colorModal:           surface,
      borderColor:          outlineVariant
    },

    Tag: {
      borderRadius:         radiusFull,
      heightSmall:          '22px',
      heightMedium:         '26px',
      fontWeightStrong:     '700'
    },

    Progress: {
      railColor:            surfaceHigh,
      colorInfo:            primary,
      colorSuccess:         success
    },

    Avatar: {
      borderRadius:         radiusFull,
      color:                surfaceContainer,
      colorInfo:            primary
    },

    Skeleton: {
      borderRadius:         radiusMd,
      color:                surfaceContainer,
      colorEnd:             surfaceHigh
    },

    Message: {
      borderRadius:         radiusMd,
      padding:              '12px 20px',
      iconColorInfo:        primary,
      iconColorSuccess:     success,
      iconColorWarning:     warning,
      iconColorError:       error
    },

    Dialog: {
      borderRadius:         radiusXl,
      padding:              '24px',
      titleFontSize:        '18px',
      titleFontWeight:      '700'
    },

    Empty: {
      iconColor:            outline,
      textColor:            onSurfaceVariant
    },

    Switch: {
      railColor:            surfaceHigh,
      railColorActive:      primary,
      buttonColor:          surface
    },

    Checkbox: {
      borderRadius:         cssVar('--m3-radius-xs', '4px'),
      colorChecked:         primary,
      border:               `1px solid ${outline}`,
      borderChecked:        `1px solid ${primary}`
    },

    Divider: {
      color:                outlineVariant,
      textColor:            onSurfaceVariant
    }
  }
}
