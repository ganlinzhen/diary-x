declare global {
  interface Window {
    api: typeof import('../preload/index').API
  }
}

export {}
