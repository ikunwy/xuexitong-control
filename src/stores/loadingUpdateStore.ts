import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoadingStore = defineStore(
  "loading",
  () => {
    const loadingContainerStart = ref<HTMLElement>();
    const loadingContainerEnd = ref<HTMLElement>();
    const portionNum = ref(4);
    const state = ref(true);
    const startDuration = "0.3s";
    const endDuration = "0.6s";
    const progress = ref(0);
    let timer: any;

    const loadingOut = () => {
      loadingContainerStart.value &&
        loadingContainerStart.value.classList.add("startOut");
      loadingContainerEnd.value &&
        loadingContainerEnd.value.classList.add("endOut");
      finishProgress();
    };
    const isLoading = () => {
      let timer = setInterval(() => {
        if (document.readyState === "complete") {
          clearInterval(timer);
          loadingOut();
          state.value = false;
        }
      }, 300);
    };
    const loadingIn = (next: (vm?: any) => void) => {
      state.value = true;
      loadingContainerStart.value &&
        loadingContainerStart.value.classList.remove("startOut");
      loadingContainerEnd.value &&
        loadingContainerEnd.value.classList.remove("endOut");
      startProgress();
      setTimeout(() => {
        next();
        isLoading();
      }, 600);
    };
    const setContainer = (start: HTMLElement, end: HTMLElement) => {
      loadingContainerStart.value = start;
      loadingContainerEnd.value = end;
    };
    const startProgress = () => {
      progress.value = 0;
      timer = setInterval(() => {
        if (progress.value >= 100) {
          clearInterval(timer);
          return;
        }
        const increment = Math.floor(Math.random() * 50) + 1
        progress.value += increment;
        if (progress.value > 90) progress.value = 90;
      }, 300);
    };
    const finishProgress = () => {
      clearInterval(timer);
      progress.value = 100;
    };
    return {
      loadingIn,
      loadingOut,
      isLoading,
      setContainer,
      progress,
      portionNum,
      state,
      startDuration,
      endDuration,
    };
  },
  {
    persist: true,
  },
);
