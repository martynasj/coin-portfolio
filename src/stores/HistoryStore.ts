import { ApiService } from 'api'
import { HistoryEntryModel } from 'models'

export default class HistoryStore {
  private service: ApiService
  // @ts-ignore
  private rootStore: RootStore

  constructor(rootStore: RootStore, service: ApiService) {
    this.rootStore = rootStore
    this.service = service
  }

  public async getClosestHistoricalDate(date: Date): Promise<HistoryEntryModel | null> {
    try {
      const entry = await this.service.history.getClosestEntry(date)
      return entry ? HistoryEntryModel.createFromApi(entry) : null
    } catch (err) {
      alert(err)
      return null
    }
  }
}
