// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId) // Delete timeout if existed
    }
    timeoutId = setTimeout(() => {
      func(...args) // Call the function after the delay
    }, delay)
  }

  // Add method of canceling timeout
  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debounced as T & {cancel: () => void}
}

export default debounce
