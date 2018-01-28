import React from 'react'
import { RouteComponentProps, Route } from 'react-router'
import { observer, inject } from 'mobx-react'
import { Text, Button, Modal } from '../../components'
import { Box } from 'reflexbox'
import { theme } from '../../theme'

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

  render() {
    return (
      <div style={{background: 'linear-gradient(-20deg, #090e58, #6ed8e8)'}}>
        <Route path={'/go-to'} component={() => (
              <Modal title={`Go to ${this.props.userStore.portfolios[0].name} ?`} onOverlayClick={() => this.props.history.goBack()}>
                <Box w={1/2}>
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
            <Text
              style={{
                maxWidth: '70%',
                marginLeft: 'auto',
                marginTop: '1rem',
                marginBottom: '1rem',
                fontSize: '1.4rem',
                textAlign: 'right',
                color: 'rgb(13, 22, 42)'
              }}
            >
              Manage all your cryptocurrencies, including Bitcoin, Ethereum, Litecoin and over 2000 alt coins.
            </Text>
            <div>
              <Button
                style={{
                  minWidth: '240px',
                  borderRadius: '5px',
                  backgroundColor: theme.colors.callToAction,
                  color: theme.colors.textLight,
                  fontSize: theme.fontSizes.large,
                  fontWeight: 500,
                  lineHeight: 2,
                  margin: '20px',
                }}
                onClick={this.handleCreateNewPortfolio}
              >
                Create New Portfolio
               </Button>
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
            }}
          >
            <Text inline large style={{ color: '#618e97' }}>Binance</Text>
            <Text inline large style={{ color: '#618e97' }}>Bitfinex</Text>
            <Text inline large style={{ color: '#618e97' }}>Bittrex</Text>
            <Text inline large style={{ color: '#618e97' }}>Poloniex</Text>
            <Text inline large style={{ color: '#618e97' }}>Gdax</Text>
            <Text inline large style={{ color: '#618e97' }}>CoinExchange</Text>
          </div>
        </div>
      </div>
    )
  }
}