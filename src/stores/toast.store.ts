import { defineStore } from "pinia";
import { reactive, ref } from "vue";

type Toast = {
  id: number;
  title: string;
  variant: ToastVariant;
  description?: string;
  remainingSeconds: number;
  interval?: NodeJS.Timeout;
  avatarUrl?: string;
};

export type ToastVariant = "info" | "success" | "danger";

export const useToastStore = defineStore("toast", () => {
  const DISMISS_TIME = 10000000;
  const TOAST_LIMIT = 5;
  const toasts = reactive<Toast[]>([]);

  const toast = (
    title: string,
    options?: {
      variant?: ToastVariant;
      description?: string;
      avatarUrl?: string;
    }
  ) => {
    const remainingSeconds = Math.ceil(DISMISS_TIME / 1000);

    const toast: Toast = {
      id: Date.now(),
      title,
      remainingSeconds,
      variant: options?.variant ? options.variant : "info",
      description: options?.description,
      avatarUrl: options?.avatarUrl,
    };

    if (toasts.length >= TOAST_LIMIT) {
      toasts.pop();
    }

    toasts.unshift(toast);

    toast.interval = setInterval(() => {
      const existing = toasts.find((t) => t.id === toast.id);
      if (existing) {
        existing.remainingSeconds -= 1;

        if (toast.remainingSeconds <= 0) {
          dismiss(toast.id);
        }
      }
    }, 1000);
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

  return { toasts, toast, dismiss };
});
