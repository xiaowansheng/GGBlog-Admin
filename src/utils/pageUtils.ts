/**
 * 滚动到顶部
 *    参数是滚动的时间，为0则直接跳转
 */
export function scrollToTop(duration: number = 0): void {
  if(duration==0){
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    return
  }
  const scrollStep = -window.scrollY / (duration / 15);
  const scrollInterval = setInterval(() => {
    if (window.scrollY !== 0) {
      window.scrollBy(0, scrollStep);
    } else {
      clearInterval(scrollInterval);
    }
  }, 15);
}

type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;

/**
 * 执行完函数后滚动到知道位置
 */
export async function scrollToContent(func: AsyncFunction<any>, element: element) {
  // 获取数据
  try {
    await func();
    // 滚到顶部
    if (element) {
      element.scrollIntoView({ behavior: "auto" });
    }
  } catch (e) {}
}
