import _ from 'lodash'
import React from 'react'
import { observer, inject } from 'mobx-react'
import { Redirect, Route, RouteComponentProps } from 'react-router-dom'
import { Box, Flex } from 'reflexbox'
import { ApiService } from '../../api'
import { PortfolioView } from '../PortfolioView'
import { Button, Text } from '../../components'
import { theme } from '../../theme'
import arrow from './arrow.svg'
import add from './add.svg'
import logo from './logo.svg'
import logout from './logout.svg'

export interface IProps extends InjectedProps, RouteComponentProps<null> {
}

export interface IState {
  isLinkingAccount: boolean
}

interface InjectedProps {
  userStore?: UserStore
  hasLoadedState: boolean
}

@inject((store: RootStore): InjectedProps => ({
  userStore: store.user,
  hasLoadedState: store.user.hasLoadedState,
}))
@observer
class DashboardView extends React.Component<IProps, IState> {

  state: IState = {
    isLinkingAccount: false,
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.hasLoadedState && !this.props.hasLoadedState) {
      const pathname = this.props.location.pathname
      // todo: refactor - store selected portfolio id in the state maybe?
      if (pathname.split('/').length === 2) {
        const firstPortfolio = _.first(this.props.userStore!.portfolios)
        if (firstPortfolio) {
          this.props.history.push(`${this.props.match.url}/${firstPortfolio.id}`)
        }
      }
    }
  }

  private logout = async () => {
    try {
      await this.props.userStore!.logout()
      this.props.history.push('/')
    } catch (err) {
      alert(err)
    }
  }

  private handleLinkAccount = async () => {
    const email = prompt('email')
    if (email) {
      const pass = prompt('password')
      if (pass) {
        this.setState({ isLinkingAccount: true })
        try {
          const firebaseUser = await ApiService.auth.linkEmailAndPasswordAccount(email, pass)
          this.props.userStore!.setUser(firebaseUser)
        } catch (err) {
          alert(err)
        } finally {
          this.setState({ isLinkingAccount: false })
        }
      }
    }
  }

  private handleCreateNewPortfolio = () => {
    this.props.history.push('/create-portfolio')
  }

  private handlePortfolioSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const portfolioId = e.target.value
    this.props.history.push(`${this.props.match.url}/${portfolioId}`)
  }

  private getSelectValue = () => {
    const val = this.props.location.pathname.replace(`${this.props.match.url}/`, '')
    return val
  }

  public render() {
    const { isLinkingAccount } = this.state
    const { match } = this.props
    const userStore = this.props.userStore!
    const currentUser = userStore.currentUser

    if (userStore.hasLoadedUser && !currentUser) {
      return <Redirect to="/" />
    }

    if (!userStore.hasLoadedState) {
      return <Text>loading</Text>
    }

    return (
      <div>
        <Box style={{ backgroundColor: '#ffffff' }}>
          <Flex
            align="center"
            justify="space-between"
            p={2}
            style={{
              width: '95%',
              maxWidth: '900px',
              marginLeft: 'auto',
              marginRight: 'auto',
              padding: '10px',
            }}
          >
            <Box flex align="center">
              <Flex align="center">
                <img 
                  style={{
                    height: '25px',
                    marginRight: '10px',
                  }}
                  src={logo}
                />
                <Text bold large>Dolla</Text>
              </Flex>
              <Box mr={2} ml={2}>
                <select
                  onChange={this.handlePortfolioSelect}
                  value={this.getSelectValue()}
                  style={{
                    padding: '0',
                    backgroundColor: 'transparent',
                    borderBottom: `2px solid ${theme.colors.textInvertedLight}`,
                    color: theme.colors.text,
                    outline: 'none',
                    fontSize: theme.fontSizes.regular,
                    minWidth: 'calc(100% + 15px)',
                    backgroundImage: `url(${arrow})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '10px',
                    backgroundPosition: 'right',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontWeight: 700
                  }}
                >
                  {userStore.portfolios.map(p =>
                    <option key={p.id} value={p.id}>{p.name}</option>
                  )}
                </select>
              </Box>
              <Box>
                <button onClick={this.handleCreateNewPortfolio} style={{cursor: 'pointer'}}>
                  <img style={{height: '10px', marginLeft: '10px'}} src={add}/>
                </button>
              </Box>
            </Box>
            <Flex align="center">
              {!currentUser!.isAnonymous ?
                <Box mr={1}><Text>{currentUser!.email}</Text></Box> :
                <Box mr={1}><Text>Anonymous User</Text></Box>
              }
              {!currentUser!.isAnonymous ?
                <button onClick={this.logout} style={{cursor: 'pointer'}}>
                  <img style={{height: '15px', marginTop: '6px'}} src={logout}/>
                </button> :
                <Button disabled={isLinkingAccount} onClick={this.handleLinkAccount}>Claim Account</Button>
              }
            </Flex>
          </Flex>
        </Box>
        <Route path={`${match.path}/:id`} component={PortfolioView} />
      </div>
    )
  }
}

export default DashboardView