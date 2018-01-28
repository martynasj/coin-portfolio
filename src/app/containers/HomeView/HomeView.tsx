import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Button, Text } from '../../components'
import { Flex } from 'reflexbox'
import { theme } from '../../theme'
import img from './background.gif'
import logo from './logo.svg'
import arrow from './arrow.svg'


interface Props extends RootStore, RouteComponentProps<{}> {}

  function detectmob() { 
    if( navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
    ){
       return true;
     } 
     else {
       return false;
     }
   }

   const ismob = detectmob()

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
                  style={ ismob ? 
                    {
                      height: '70px',
                    } :
                    {
                      height: '70px',
                    }
                  }
                  src={logo}/>
              </div>

              <Text xl bold capitalize m2>
                Bitcoin, ICO and Cryptocurrency Portfolio
              </Text>

              <Text semibold light large m2>
                Dolla is the ultimate cryptocurrency portfolio tracker tool for browser. 
                Manage all your cryptocurrencies, including Bitcoin, Ethereum, Litecoin and over 2000 alt coins.
              </Text>

              <Flex wrap style={{marginTop: '1.5rem', maxWidth: '308px'}} justify='space-between'>
                <Button onClick={this.handleCreateNewPortfolio} style={{marginTop: '0.5rem', minWidth: '150px', lineHeight: 2}}>
                  Create Now
                  <img style={{height: '10px', marginLeft: '10px'}} src={arrow}/>
                </Button>
                <Button
                  onClick={this.handleLogin}
                  style={{
                    minWidth: '150px',
                    backgroundColor: 'transparent',
                    color: theme.colors.accent,
                    marginTop: '0.5rem',
                    lineHeight: 2
                  }}
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