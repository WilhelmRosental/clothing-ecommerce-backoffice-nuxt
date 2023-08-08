import { defineStore } from 'pinia'

export const useInterface = defineStore('interface', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      filters: false
    }
  },
  actions: {
    // since we rely on `this`, we cannot use an arrow function
    toggleFilters () {
      this.filters = !this.filters
    }
  }
})
