import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Button, Text } from '../../components'
import { Flex } from 'reflexbox'
import img from './background.gif'
import logo from './logo.svg'
import arrow from './arrow.svg'


interface Props extends RootStore, RouteComponentProps<{}> {}

export default class CreatePortfolioView extends React.Component<Props> {

  private handleCreateNewPortfolio = async () => {
    this.props.history.push('/create-portfolio')
  }

  private handleLogin = () => {
    this.props.history.push('/login')
  }

  render() {
    return (
      <div>
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
            <path d="M-20 280V0h88z" fill="#fff" fillRule="evenodd"></path>
          </svg>

          <div
            style={{
              width: '96vw',
              position: 'absolute',
              bottom: '20px'
            }}
          >
            <Text small bold capitalize>
              ©2018. Dolla™ by MIV Group
            </Text>
          </div>

          <div
            style={{
              width: '85vw',
              position: 'absolute'
            }}
          >

            <div
              style={{
                width: '40%',
                maxWidth: '500px',
                lineHeight: 1.5
              }}
            >

              <div>
                <img 
                  style={{ height: '70px' }}
                  src={logo}/>
              </div>

              <Text xl bold capitalize m2>
                Bitcoin, ICO and Cryptocurrency Portfolio
              </Text>

              <Text semibold light large m2>
                Dolla is the ultimate cryptocurrency portfolio tracker tool for browser. 
                Manage all your cryptocurrencies, including Bitcoin, Ethereum, Litecoin and over 2000 alt coins.
              </Text>

              <Flex wrap style={{marginTop: '2rem', maxWidth: '308px'}} justify='space-between'>
                <Button onClick={this.handleCreateNewPortfolio} style={{ lineHeight: 2 }}>
                  Create Now
                  <img style={{height: '10px', marginLeft: '10px'}} src={arrow}/>
                </Button>
                <Button
                  simple
                  onClick={this.handleLogin}
                  style={{ lineHeight: 2 }}
                >
                  Login
                </Button>
              </Flex>

            </div>
          </div>
        </div>
      </div>
    )
  }
}