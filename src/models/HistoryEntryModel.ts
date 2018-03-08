import dates from 'util/dates'

export default class HistoryEntryModel {
  public readonly date: Date
  public readonly open: number
  public readonly close: number

  private constructor(entry: Api.HistoryEntry) {
    this.date = dates.fromUnix(entry.date)
    this.open = entry.open
    this.close = entry.close
  }

  public static createFromApi(entry: Api.HistoryEntry) {
    return new HistoryEntryModel(entry)
  }

  public get averagePrice() {
    return (this.open + this.close) / 2
  }
}
