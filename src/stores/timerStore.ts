import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { registerInstructionRoutesApi } from "@/api/course";

export const useTimerStore = defineStore(
  "timer",
  () => {
    const seconds = ref(0);
    const running = ref(false);
    const allSeconds = ref(0); // 刷课总时长
    let intervalId: any = null;

    const formatted = computed(() => {
      const h = Math.floor(seconds.value / 3600);
      const m = Math.floor((seconds.value % 3600) / 60);
      const s = seconds.value % 60;
      const p = (n: any) => String(n).padStart(2, "0");
      return h > 0 ? `${p(h)}:${p(m)}:${p(s)}` : `${p(m)}:${p(s)}`;
    });

    const minutes = computed(() => Math.floor(seconds.value / 60));

    async function start() {
      if (running.value) return;
      try {
        await registerInstructionRoutesApi("course_control_resume");
        running.value = true;
        intervalId = setInterval(() => {
          seconds.value++;
        }, 1000);
        return true;
      } catch (err) {
        return false;
      }
    }

    async function pause() {
      try {
        await registerInstructionRoutesApi("course_control_pause");
        running.value = false;
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        return true;
      } catch (err) {
        return false;
      }
    }

    async function reset() {
      const isPause = await pause();
      if (isPause) {
        running.value = false;
        allSeconds.value += seconds.value;
        seconds.value = 0;
      }
    }

    return { seconds, running, formatted, minutes, start, pause, reset };
  },
  {
    // pinia-plugin-persistedstate v3 用 paths；v4 请改成 pick: ['seconds']
    persist: { key: "xxt_timer" },
  },
);
