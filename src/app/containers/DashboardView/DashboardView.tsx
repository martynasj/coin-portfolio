import React from 'react'
import { observer, inject } from 'mobx-react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { Box, Flex } from 'reflexbox'
import { ApiService } from '../../api'
import PortfolioView from '../PortfolioView'
import { Button, Text } from '../../components'
import { theme } from '../../theme'
import arrow from './arrow.svg'
import addIcon from './add.svg'
import logo from '../../../assets/android-chrome-192x192.png'
import logoutIcon from './logout.svg'

const apiService = new ApiService() // should better use DI or something

export interface IProps extends InjectedProps, RouteComponentProps<null> {}

export interface IState {
  isLinkingAccount: boolean
}

interface InjectedProps {
  userStore?: UserStore
  uiStore: UIStore
  hasLoadedState: boolean
  activePortfolioId: string
}

@inject((store: RootStore): InjectedProps => ({
  userStore: store.user,
  uiStore: store.ui,
  activePortfolioId: store.ui.activePortfolioId,
  hasLoadedState: store.user.hasLoadedState,
}))
@observer
class DashboardView extends React.Component<IProps, IState> {
  state: IState = {
    isLinkingAccount: false,
  }

  componentWillMount() {
    if (this.props.hasLoadedState) {
      const firstPortfolio = this.props.userStore!.portfolios[0]
      if (firstPortfolio) {
        this.props.uiStore.setActivePortfolio(firstPortfolio.id)
      }
    }
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.hasLoadedState && !this.props.hasLoadedState) {
      const firstPortfolio = this.props.userStore!.portfolios[0]
      if (firstPortfolio && !nextProps.activePortfolioId) {
        this.props.uiStore.setActivePortfolio(firstPortfolio.id)
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
          const firebaseUser = await apiService.auth.linkEmailAndPasswordAccount(email, pass)
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
    this.props.uiStore.setActivePortfolio(portfolioId)
  }

  private getSelectValue = () => {
    const val = this.props.activePortfolioId
    return val
  }

  public render() {
    const { isLinkingAccount } = this.state
    const userStore = this.props.userStore!
    const uiStore = this.props.uiStore!
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
                <Text bold large>
                  Dolla
                </Text>
              </Flex>
              <Box mx={2}>
                <select
                  onChange={this.handlePortfolioSelect}
                  value={this.getSelectValue()}
                  style={{
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
                    fontWeight: 700,
                  }}
                >
                  {userStore.portfolios.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Box>
              <Box>
                <button onClick={this.handleCreateNewPortfolio} style={{ cursor: 'pointer' }}>
                  <img style={{ height: '10px', marginLeft: '10px' }} src={addIcon} />
                </button>
              </Box>
            </Box>
            <Flex align="center">
              {!currentUser!.isAnonymous ? (
                <Box mr={1}>
                  <Text>{currentUser!.email}</Text>
                </Box>
              ) : (
                <Box mr={1}>
                  <Text>Anonymous User</Text>
                </Box>
              )}
              {!currentUser!.isAnonymous ? (
                <button onClick={this.logout} style={{ cursor: 'pointer' }}>
                  <img style={{ height: '15px', marginTop: '6px' }} src={logoutIcon} />
                </button>
              ) : (
                <Button disabled={isLinkingAccount} onClick={this.handleLinkAccount}>
                  Claim Account
                </Button>
              )}
            </Flex>
          </Flex>
        </Box>
        {uiStore.activePortfolioId && <PortfolioView id={uiStore.activePortfolioId} />}
      </div>
    )
  }
}

export default DashboardView
