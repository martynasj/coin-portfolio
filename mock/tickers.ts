import _ from 'lodash'

const ltc: Api.Ticker = {
  id: 'ltc',
  symbol: 'ltc',
  name: 'Litecoin',
  priceUSD: 161.6,
  priceBTC: 0.01872,
  bitfinex: {
    priceBTC: 0.0182,
    priceETH: 0.186,
    priceUSD: 159.76,
  },
}

export const tickersById = {
  ltc,
}

export const tickersArray = _.map(tickersById, ticker => ticker)
