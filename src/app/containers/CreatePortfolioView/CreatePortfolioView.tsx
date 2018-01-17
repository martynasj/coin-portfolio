import _ from 'lodash'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { inject } from 'mobx-react'
import { slugify } from '../../util/slugify'
import { Input } from '../../components'
import { ApiService } from '../../api'

interface State {
  input: string
  isChecking: boolean
  isCreating: boolean
  isAvailable: boolean
}

export interface IProps extends RouteComponentProps<any> {
  portfolio?: PortfolioStore
}

@inject((allStores: RootStore) => ({
  portfolio: allStores.portfolio,
}))
class CreatePortfolioView extends React.Component<IProps, State> {

  state = {
    input: '',
    isChecking: false,
    isCreating: false,
    isAvailable: false,
  }

  private debouncedCheck: (slug: string) => Promise<boolean>

  private handleCreatePortfolio = async () => {
    const slug = this.getSlug()
    this.setState({ isCreating: true })
    if (slug) {
      const createdSlug = await this.props.portfolio!.createNewPortfolio(slug)
      this.setState({ isCreating: false })
      this.props.history.push(`/p/${createdSlug}`)
    }
  }

  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const slug = slugify(input)
    this.setState({ input })
    this.debouncedCheck = this.debouncedCheck || _.debounce(this.checkAvailability, 250)
    this.debouncedCheck(slug)
  }

  private checkAvailability = async (slug: string) => {
    this.setState({ isChecking: true })
    try {
      const isAvailable = await ApiService.portfolio.isAvailable(slug)
      this.setState({ isAvailable })
    } catch (err) {
      console.log(err)
    } finally {
      this.setState({ isChecking: false })
    }
  }

  private getSlug = () => slugify(this.state.input)

  public render() {
    const { isChecking, isCreating, isAvailable } = this.state
    const slug = this.getSlug()

    return (
      <div>
        <h1>Create New Portfolio</h1>
        <Input
          value={this.state.input}
          onChange={this.handleChange}
        />
        <p>shitfol.io/p/{slug}</p>
        {slug &&
          <p>{isAvailable ? 'available' : 'taken'}</p>
        }
        <button
          disabled={!slug || isChecking || !isAvailable || isCreating}
          onClick={this.handleCreatePortfolio}
        >
          Create
        </button>
      </div>
    );
  }
}

export default CreatePortfolioView