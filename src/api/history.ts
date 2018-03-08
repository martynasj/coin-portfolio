import _ from 'lodash'
import firebase from 'firebase'
import dates from '../util/dates'

const history = {
  async getClosestEntry(date: Date): Promise<Api.HistoryEntry|null> {
    // later when we have more accurate historical prices in the db
    // we should add some logic to which historical entry we want to return
    // probably round the input date and return the one that is closes to it
    // either it's greater or lower then the input
    const unixDate = dates.toUnix(date)

    const snap = await firebase
      .firestore()
      .collection('historical-data')
      .where('date', '<=', unixDate) // hardcoded logic
      .orderBy('date', 'desc')
      .limit(1)
      .get()

    const firstMatch = _.first(snap.docs)

    if (firstMatch) {
      return firstMatch.data() as Api.HistoryEntry
    } else {
      return null
    }
  },
}

export default history