import _ from 'lodash'
import React from 'react'
import { observer, inject } from 'mobx-react'
import { Redirect, Route, RouteComponentProps } from 'react-router-dom'
import { Box, Flex } from 'reflexbox'
import { ApiService } from '../../api'
import { PortfolioView } from '../PortfolioView'
import { Button } from '../../components'

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
      return <p>loading</p>
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
        <Route path={`${match.path}/:id`} component={PortfolioView} />
      </div>
    )
  }
}

export default DashboardView