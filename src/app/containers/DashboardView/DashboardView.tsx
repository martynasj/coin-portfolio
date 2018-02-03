import React from 'react'
import { observer, inject } from 'mobx-react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { Box, Flex } from 'reflexbox'
import { ApiService } from '../../api'
import PortfolioView from '../PortfolioView'
import { Button, Text } from '../../components'

export interface IProps extends InjectedProps, RouteComponentProps<null> {
}

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
        <Flex align="center" justify="space-between" p={2}>
          <Box flex>
            <Box mr={2}>
              <select
                style={{ padding: '4px 8px' }}
                onChange={this.handlePortfolioSelect}
                value={this.getSelectValue()}
              >
                {userStore.portfolios.map(p =>
                  <option key={p.id} value={p.id}>{p.name}</option>
                )}
              </select>
            </Box>
            <Box>
              <Button onClick={this.handleCreateNewPortfolio}>New Portfolio</Button>
            </Box>
          </Box>
          <Box flex align="center">
            {!currentUser!.isAnonymous ?
              <Box mr={2}>{currentUser!.email}</Box> :
              <Box mr={2}>Anonymous User</Box>
            }
            {!currentUser!.isAnonymous ?
              <Button onClick={this.logout}>Logout</Button> :
              <Button disabled={isLinkingAccount} onClick={this.handleLinkAccount}>Claim Account</Button>
            }
          </Box>
        </Flex>
        {uiStore.activePortfolioId && 
          <PortfolioView id={uiStore.activePortfolioId} />
        }
      </div>
    )
  }
}

export default DashboardView