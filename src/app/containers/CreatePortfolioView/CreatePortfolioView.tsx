import React from 'react'
import { inject } from 'mobx-react'
import { RouteComponentProps } from 'react-router'

function slugify(text: string): string {
  return text.toLowerCase().replace(' ', '-').trim()
}

interface Props extends RootStore, RouteComponentProps<{}> {}

@inject((allStores: RootStore) => ({
  portfolio: allStores.portfolio,
}))
export default class CreatePortfolioView extends React.Component<Props> {

  private handleCreateNewPortfolio = async () => {
    const name = prompt('Your portfolio name:\n')
    if (name) {
      const slug = slugify(name)
      try {
        const createdSlug = await this.props.portfolio.createNewPortfolio(slug)
        this.props.history.push(`/p/${createdSlug}`)
      } catch (err) {
        console.log(err)
      }
    }
  }

  render() {
    return (
      <div style={{background: 'linear-gradient(-20deg, #090e58, #6ed8e8)'}}>

        <div 
          style={{
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >

          <div
            style={{
              width: '55vw', 
              color: 'white', 
            }}
          >

            <div
              style={{
                fontSize: '7rem',
                margin: 0,
                fontWeight: 300,
              }}
            >
              <span style={{color: 'rgb(13, 22, 42)'}}>Shit</span>
              <span>fol.io</span>
            </div>

            <h2
              style={{
                maxWidth: '70%', 
                fontSize: '2.2rem', 
                textAlign: 'left',
                textTransform: 'capitalize' 
              }}
            >
              The ultimate cryptocurrency portfolio tracker tool for your desktop.
            </h2>

            <p
              style={{
                maxWidth: '70%', 
                marginLeft: 'auto',
                fontSize: '1.4rem',
                textAlign: 'right',
                color: 'rgb(13, 22, 42)'
              }}
            > 
              Manage all your cryptocurrencies, including Bitcoin, Ethereum, Litecoin and over 2000 alt coins.
            </p>

            <div>
              <button 
                style={{
                  border: 'none',
                  minWidth: '240px',
                  borderRadius: '5px',
                  backgroundColor: '#0e162b',
                  color: '#b1c7cc',
                  fontSize: '1rem',
                  fontWeight: 500,
                  lineHeight: 3,
                  margin: '20px',
                  cursor: 'pointer'
                }}
                onClick={this.handleCreateNewPortfolio}
              >
                Create New Portfolio
               </button>
            </div>

          </div>

        </div>

        <div
          style={{
            position: 'fixed',
            top: 'calc(100vh - 60px)',
            width: '100vw'
          }}
        >

          <div
            style={{
              width: '90%',
              display: 'flex',
              justifyContent: 'space-between',
              marginLeft: 'auto',
              marginRight: 'auto',
              color: '#618e97'
            }}
          >

            <span>Binance</span>
            <span>Bitfinex</span>
            <span>Bittrex</span>
            <span>Poloniex</span>
            <span>Gdax</span>
            <span>CoinExchange</span>

          </div>

        </div>

      </div>

    )
  }
}