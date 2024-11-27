import {
  format,
  formatDistance,
  isSameWeek,
  isToday,
  isYesterday,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatTimestamp(timestamp: Date) {
  let date = "PP";
  if (isToday(timestamp)) date = "HH:mm";
  else if (isYesterday(timestamp)) date = "'Ontem'";
  else if (isSameWeek(timestamp, new Date())) date = "EEEE' às 'HH:mm";

  return format(timestamp, date, { locale: ptBR });
}

export function displayFullTimestamp(timestamp: Date) {
  return formatDistance(timestamp, new Date(), {
    addSuffix: true,
    locale: ptBR,
  });
}
