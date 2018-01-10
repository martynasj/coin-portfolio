import { useStrict } from 'mobx';
import { RootStore } from './RootStore'

export function createStores(history): RootStore {
    // enable MobX strict mode
  useStrict(true);

  const rootStore = new RootStore(history)
  return rootStore
}