import { useStrict } from 'mobx'
import { RootStore } from './RootStore'
import { ApiService } from '../api'

export function createStores(history, apiService: ApiService): RootStore {
  // enable MobX strict mode
  useStrict(true)

  const rootStore = new RootStore(history, apiService)
  return rootStore
}
