import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const millisToMinutesAndSeconds = (millis: number) => {
  const minutes = Math.floor(millis / 60000);
  const seconds: any = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

export const millisToMinAndSecs = (millis: number) => {
  const minutes = Math.floor(millis / 60000);
  const seconds: any = ((millis % 60000) / 1000).toFixed(0);
  return minutes + " mins " + (seconds < 10 ? "0" : "") + seconds + " secs";
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
