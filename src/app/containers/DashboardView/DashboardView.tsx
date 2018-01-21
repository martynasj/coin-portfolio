import React from 'react'
import { observer, inject } from 'mobx-react'
import { Redirect, Route, Link, RouteComponentProps } from 'react-router-dom'
import { PortfolioView } from '../PortfolioView'
import { Button } from '../../components'

export interface IProps extends InjectedProps, RouteComponentProps<null> {
}

interface InjectedProps {
  userStore?: UserStore
}

@inject((store: RootStore): InjectedProps => ({
  userStore: store.user,
}))
@observer
class DashboardView extends React.Component<IProps, {}> {

  private logout = async () => {
    try {
      await this.props.userStore!.logout()
    } catch (err) {
      alert(err)
    }
  }

  public render() {
    const { match } = this.props
    const userStore = this.props.userStore!

    if (!userStore.hasLoadedState) {
      return <p>loading</p>
    }

    if (!userStore.currentUser) {
      return <Redirect to="/" />
    }

    return (
      <div>
        <h1>Dashboard</h1>
        <pre>{JSON.stringify(userStore.currentUser, null, 2)}</pre>
        <div>
          {userStore.portfolios.map(p =>
            <Link key={p.id} to={`${match.url}/${p.id}`}>
              <p>{p.name}</p>
            </Link>
          )}
        </div>
        <Button onClick={this.logout}>Logout</Button>
        <Route path={`${match.path}/:id`} component={PortfolioView} />
      </div>
    );
  }
}

export default DashboardView