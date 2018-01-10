import React from 'react'
import { inject } from 'mobx-react'
import { RouteComponentProps } from 'react-router'

function slugify(text: string): string {
  return text.toLowerCase().replace(' ', '-').trim()
}

interface Props extends RootStore, RouteComponentProps<{}> {}

@inject((allStores: RootStore) => ({
  portfolio: allStores.portfolio,
}))
export default class CreatePortfolioView extends React.Component<Props> {

  private handleCreateNewPortfolio = async () => {
    const name = prompt('Your portfolio name:\n')
    if (name) {
      const slug = slugify(name)
      try {
        const createdSlug = await this.props.portfolio.createNewPortfolio(slug)
        this.props.history.push(`/p/${createdSlug}`)
      } catch (err) {
        console.log(err)
      }
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.handleCreateNewPortfolio}>Create New Portfolio</button>
      </div>
    )
  }
}