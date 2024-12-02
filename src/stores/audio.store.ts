import { defineStore } from "pinia";
import { reactive, ref } from "vue";

import notificationSound from "../assets/sounds/notification_sound.mp3";

export const useAudioStore = defineStore("audio", () => {
  const enabled = ref<boolean>(false);

  const toggleAudio = () => {
    enabled.value = !enabled.value;
    console.log(enabled.value);
  };

  const configure = (audio: HTMLAudioElement, volume: number) => {
    audio.volume = volume;
  };

  const play = () => {
    if (enabled.value) {
      const notification = new Audio(notificationSound);
      configure(notification, 0.1);

      notification.play();
    }
  };

  return { play, configure, toggleAudio, enabled };
});
