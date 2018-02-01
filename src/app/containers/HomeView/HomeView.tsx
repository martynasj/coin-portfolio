import React from 'react'
import { RouteComponentProps, Route } from 'react-router'
import { observer, inject } from 'mobx-react'
import { Text, Button, Modal } from '../../components'
import { Flex, Box } from 'reflexbox'
import img from './background.gif'
import logo from './logo.svg'
import arrow from './arrow.svg'


interface Props extends InjectedProps, RouteComponentProps<{}> {}

interface InjectedProps {
  userStore: UserStore
  hasLoadedState: boolean
}

@inject((store: RootStore): InjectedProps => ({
  userStore: store.user,
  hasLoadedState: store.user.hasLoadedState,
}))
@observer
export default class HomeView extends React.Component<Props> {

  componentWillReceiveProps(nextProps) {
    if (this.props.hasLoadedState == false && nextProps.hasLoadedState == true) {
      this.promptToExistingPortfolio()
    }
  }

  private handleCreateNewPortfolio = async () => {
    this.props.history.push('/create-portfolio')
  }

  private promptToExistingPortfolio() {
    this.props.history.push('/go-to')
  }
  
  private handleLogin = () => {
    this.props.history.push('/login')
  }

  render() {
    return (
      <div>
        <Route path={'/go-to'} component={() => (
                <Modal title={`Go to ${this.props.userStore.portfolios[0].name} ?`} onOverlayClick={() => this.props.history.goBack()}>
                  <Box flex justify={'space-around'}>
                    <Button onClick={() => this.props.history.push(`/dashboard/${this.props.userStore.portfolios[0].id}`)}>GO</Button>
                    <Button onClick={() => this.props.history.goBack()}>Cancel</Button>
                  </Box>
                </Modal>
              )} 
          />
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

              <Box my={'1rem'}>
                <Text xl bold capitalize>
                  Bitcoin, ICO and Cryptocurrency Portfolio
                </Text>
              </Box>

              <Box my={'1rem'}>
                <Text semibold light large>
                  Dolla is the ultimate cryptocurrency portfolio tracker tool for browser. 
                  Manage all your cryptocurrencies, including Bitcoin, Ethereum, Litecoin and over 2000 alt coins.
                </Text>
              </Box>

              <Flex wrap style={{marginTop: '2rem', maxWidth: '308px'}} justify='space-between'>
                <Button onClick={this.handleCreateNewPortfolio} style={{ minWidth: '150px', lineHeight: 2 }}>
                  Create Now
                  <img style={{height: '10px', marginLeft: '10px'}} src={arrow}/>
                </Button>
                <Button
                  simple
                  onClick={this.handleLogin}
                  style={{
                    lineHeight: 2,
                    minWidth: '150px',
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