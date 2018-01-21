import React from 'react'
import { observer, inject } from 'mobx-react'
import { Redirect } from 'react-router-dom'
import { Button } from '../../components'

export interface IProps extends InjectedProps {
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
            <pre>{JSON.stringify(p, null, 2)}</pre>
          )}
        </div>
        <Button onClick={this.logout}>Logout</Button>
      </div>
    );
  }
}

export default DashboardView