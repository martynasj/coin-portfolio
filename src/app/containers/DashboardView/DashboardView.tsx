import _ from 'lodash'
import React from 'react'
import { observer, inject } from 'mobx-react'
import { Redirect, Route, RouteComponentProps } from 'react-router-dom'
import { Box, Flex } from 'reflexbox'
import { PortfolioView } from '../PortfolioView'
import { Button } from '../../components'

export interface IProps extends InjectedProps, RouteComponentProps<null> {
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
class DashboardView extends React.Component<IProps, {}> {

  componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.hasLoadedState && !this.props.hasLoadedState) {
      const firstPortfolio = _.first(this.props.userStore!.portfolios)
      if (firstPortfolio) {
        this.props.history.push(`${this.props.match.url}/${firstPortfolio.id}`)
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

  private handlePortfolioSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const portfolioId = e.target.value
    this.props.history.push(`${this.props.match.url}/${portfolioId}`)
  }

  private getSelectValue = () => {
    const val = this.props.location.pathname.replace(`${this.props.match.url}/`, '')
    return val
  }

  public render() {
    const { match } = this.props
    const userStore = this.props.userStore!

    if (userStore.hasLoadedUser && !userStore.currentUser) {
      return <Redirect to="/" />
    }

    if (!userStore.hasLoadedState) {
      return <p>loading</p>
    }

    return (
      <div>
        <Flex align="center">
          <Box mr={2}>{userStore.currentUser.email}</Box>
          <Box mr={2}>
            <select name="" id="" onChange={this.handlePortfolioSelect} value={this.getSelectValue()}>
              {userStore.portfolios.map(p =>
                <option key={p.id} value={p.id}>{p.name}</option>
              )}
            </select>
          </Box>
          <Button onClick={this.logout}>Logout</Button>
        </Flex>
        <Route path={`${match.path}/:id`} component={PortfolioView} />
      </div>
    );
  }
}

export default DashboardView