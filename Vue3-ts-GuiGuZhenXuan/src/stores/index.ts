import { createPinia } from 'pinia'
// 持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const stores = createPinia()
stores.use(piniaPluginPersistedstate)

export default stores
