import { action, observable } from 'mobx'

export type OrderType = 'date'|'highest-holdings'|'alphabet'|'biggest-gainer'|'highest-price'

export class SettingsStore {
  // @ts-ignore
  private rootStore: RootStore
  @observable private _orderBy: OrderType = 'alphabet'

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
  }

  @action
  public setOrderBy(orderType: OrderType) {
    this._orderBy = orderType
  }

  public get orderBy() {
    return this._orderBy
  }

  public get orderTypes(): Array<{ name: string, value: OrderType }> {
    return [
      { name: 'Alphabet', value: 'alphabet' },
      { name: 'Date Added', value: 'date' },
      { name: 'Highest Holdings', value: 'highest-holdings' },
      { name: 'Highest Price', value: 'highest-price' },
      { name: 'Biggest Gainer (%)', value: 'biggest-gainer' },
    ]
  }
}