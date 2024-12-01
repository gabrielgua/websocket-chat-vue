import { defineStore } from "pinia";
import { reactive, ref } from "vue";

type Toast = {
  id: number;
  title: string;
  variant: ToastVariant;
  description?: string;
  remainingSeconds: number;
  interval?: NodeJS.Timeout;
};

export type ToastVariant = "info" | "success" | "danger";

export const useToastStore = defineStore("toast", () => {
  const DISMISS_TIME = 10000;
  const TOAST_LIMIT = 5;
  const toasts = reactive<Toast[]>([]);

  const append = (
    title: string,
    variant?: ToastVariant,
    description?: string
  ) => {
    const remainingSeconds = Math.ceil(DISMISS_TIME / 1000);

    const toast: Toast = {
      id: Date.now(),
      variant: variant ? variant : "info",
      title,
      description,
      remainingSeconds,
    };

    toast.interval = setInterval(() => {
      const existing = toasts.find((t) => t.id === toast.id);
      if (existing) {
        existing.remainingSeconds -= 1;

        if (toast.remainingSeconds <= 0) {
          dismiss(toast.id);
        }
      }
    }, 1000);

    toasts.unshift(toast);
    if (toasts.length >= TOAST_LIMIT) {
      toasts.pop();
    }
  };

  const dismiss = (id: number) => {
    const index = toasts.findIndex((t) => t.id === id);
    if (index !== -1) {
      const [toast] = toasts.splice(index, 1);

      if (toast.interval) {
        clearInterval(toast.interval);
      }
    }
  };

  return { toasts, append, dismiss };
});
