import { createPinia } from 'pinia'
import persister from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persister, { expires: '2h' })

export default pinia

// import { useUserStore } from './modules/user'
// export { useUserStore }

export * from './modules/user.js'
export * from './modules/createStore.js'
