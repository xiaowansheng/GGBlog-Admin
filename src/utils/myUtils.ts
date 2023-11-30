/**
 * 时间格式化
 * @param date
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear().toString().padStart(4, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");
  const formatStr = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  return formatStr;
}

/**
 * 首次等次固定延迟触发
 * @param func 
 * @param wait 
 * @returns 
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): () => void {
  let timeout: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;

  return function throttled(...args: Parameters<T>) {
    lastArgs = args;

    if (timeout === null) {
      timeout = setTimeout(() => {
        if (lastArgs) {
          func(...lastArgs);
          lastArgs = null;
          timeout = null;
        }
      }, wait);
    }
  };
}

/**
 * 首次直接触发函数
 * @param func 
 * @param wait 
 * @returns 
 */
export function throttle2<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;
  let isFirstCall = true;

  return function throttled(...args: Parameters<T>) {
    lastArgs = args;

    if (isFirstCall) {
      func(...args);
      isFirstCall = false;
      return;
    }

    if (timeout === null) {
      timeout = setTimeout(() => {
        if (lastArgs) {
          func(...lastArgs);
          lastArgs = null;
          timeout = null;
        }
      }, wait);
    }
  };
}