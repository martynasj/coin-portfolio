import React from 'react'
import { RouteComponentProps } from 'react-router'
import { theme } from '../../theme'
import { Flex } from 'reflexbox'
import img from './background.gif'
import binance from './binance.png'
import bitfinex from './bitfinex.png'
import bittrex from './bittrex.png'
import poloniex from './poloniex.png'
import gdax from './gdax.png'
import coinexchange from './coinexchange.png'
import logo from './logo.png'

interface Props extends RootStore, RouteComponentProps<{}> {}

export default class CreatePortfolioView extends React.Component<Props> {

  private handleCreateNewPortfolio = async () => {
    this.props.history.push('/create-portfolio')
  }

  render() {
    return (
      <div style={{backgroundColor: '#f5f5f5'}}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'left',
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: '100%',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              display: 'block',
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              filter: 'drop-shadow(#000 0 0 20px)'
            }}
          >
            <path d="M-24 240V0h100z" fill="#fff" fill-rule="evenodd"></path>
          </svg>
          <div
            style={{
              width: '85vw',
              position: 'absolute'
            }}
          >
           <div
            style={{
              fontSize: '1rem',
              width: '40%',
              maxWidth: '600px',
              color: theme.colors.textLight,
              fontWeight: 400,
              lineHeight: 1.2,
            }}
           >
              <div>
                <img style={{height: '45px', marginBottom: '30px'}} src={logo}/>
              </div>
              <h2
                style={{
                  fontSize: '1.8rem',
                  textTransform: 'capitalize',
                  margin: '20px 0',
                  color: theme.colors.neutral,
                  fontWeight: 700,
                }}
              >
                The ultimate cryptocurrency portfolio tracker tool for your browser.
              </h2>
              <p>Manage all your cryptocurrencies, including Bitcoin, Ethereum, Litecoin and over 2000 alt coins.</p>

              <Flex
                wrap
                style={{
                  marginTop: '20px'
                }}
              >
                <img style={{height: '8px', margin: '8px 20px 8px 0'}} src={binance}/>
                <img style={{height: '8px', margin: '8px 20px 8px 0'}} src={bitfinex}/>
                <img style={{height: '8px', margin: '8px 20px 8px 0'}} src={bittrex}/>
                <img style={{height: '8px', margin: '8px 20px 8px 0'}} src={poloniex}/>
                <img style={{height: '8px', margin: '8px 20px 8px 0'}} src={gdax}/>
                <img style={{height: '8px', margin: '8px 20px 8px 0'}} src={coinexchange}/>
              </Flex>

              <div>
                <button
                  style={{
                    border: 'none',
                    minWidth: '200px',
                    borderRadius: '5px',
                    backgroundColor: theme.colors.accent,
                    color: '#ffffff',
                    fontWeight: 500,
                    lineHeight: 2.5,
                    margin: '50px 0 0 0',
                    cursor: 'pointer'
                  }}
                  onClick={this.handleCreateNewPortfolio}
                >
                  Create New Portfolio
                </button>
              </div>

            </div>
          </div>
        </div>
        {/* <div
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
            }}
          >
            <Text inline large style={{ color: '#618e97' }}>Binance</Text>
            <Text inline large style={{ color: '#618e97' }}>Bitfinex</Text>
            <Text inline large style={{ color: '#618e97' }}>Bittrex</Text>
            <Text inline large style={{ color: '#618e97' }}>Poloniex</Text>
            <Text inline large style={{ color: '#618e97' }}>Gdax</Text>
            <Text inline large style={{ color: '#618e97' }}>CoinExchange</Text>
          </div>
        </div> */}
      </div>
    )
  }
}