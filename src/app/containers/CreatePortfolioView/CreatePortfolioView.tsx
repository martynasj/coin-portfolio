import _ from 'lodash'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { inject } from 'mobx-react'
import { connect, FelaWithStylesProps } from 'react-fela'
import { Box, Flex } from 'reflexbox'
import { slugify } from '../../util/slugify'
import { Input, Button, Text } from '../../components'
import { ApiService } from '../../api'

const apiService = new ApiService() // todo: use DI

interface State {
  input: string
  isChecking: boolean
  isCreating: boolean
  isAvailable: boolean
}

export interface IProps extends InjectedProps, RouteComponentProps<any> {}

export interface InjectedProps {
  portfolio?: PortfolioStore
  userStore?: UserStore
}

interface Styles {
  root
}

type Props = IProps & FelaWithStylesProps<IProps, Styles>

const withStyles = connect<IProps, Styles>({
  root: {
    minHeight: '100vh',
  },
})

@inject((allStores: RootStore): InjectedProps => ({
  portfolio: allStores.portfolio,
  userStore: allStores.user,
}))
class CreatePortfolioView extends React.Component<Props, State> {
  state = {
    input: '',
    isChecking: false,
    isCreating: false,
    isAvailable: false,
  }

  private debouncedCheck: (slug: string) => Promise<boolean>

  private handleCreatePortfolio = async () => {
    this.setState({ isCreating: true })

    if (!this.props.userStore!.currentUser) {
      try {
        await apiService.auth.signinAnonymously()
      } catch (err) {
        alert(err)
        this.setState({ isCreating: false })
        return
      }
    }

    const slug = this.getSlug()

    if (slug) {
      try {
        const createdSlug = await this.props.portfolio!.createNewPortfolio(slug)
        this.props.history.push(`/dashboard/${createdSlug}`)
      } catch (err) {
        this.setState({ isCreating: false })
        alert(err)
      }
    }
  }

  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const slug = slugify(input)
    this.setState({ input })
    this.debouncedCheck = this.debouncedCheck || _.debounce(this.checkAvailability, 250)
    if (this.isValidSlug(slug)) {
      this.debouncedCheck(slug)
    }
  }

  private checkAvailability = async (slug: string) => {
    this.setState({ isChecking: true })
    try {
      const isAvailable = await apiService.portfolio.isAvailable(slug)
      this.setState({ isAvailable })
    } catch (err) {
      console.log(err)
    } finally {
      this.setState({ isChecking: false })
    }
  }

  private getSlug = () => slugify(this.state.input)

  private isValidSlug = (slug: string) => slug.length > 2

  public render() {
    const { styles } = this.props
    const { isChecking, isCreating, isAvailable } = this.state
    const slug = this.getSlug()

    return (
      <Flex align="center" justify="center" column className={styles.root}>
        <Box my={'2rem'}>
          <Text xl bold capitalize>
            New portfolio
          </Text>
        </Box>
        <Box mb={1}>
          <Text small light>
            Portfolio name
          </Text>
          <Input blurOnInput value={this.state.input} onChange={this.handleChange} />
          <Text light style={{ padding: '2px' }}>
            moonjet.io/p/{slug}
          </Text>
        </Box>
        <Button
          style={{ minWidth: 120 }}
          disabled={!slug || isChecking || !isAvailable || isCreating}
          onClick={this.handleCreatePortfolio}
        >
          {isChecking ? 'Checking' : isAvailable || !this.isValidSlug(slug) ? 'Create' : 'Taken'}
        </Button>
      </Flex>
    )
  }
}

export default withStyles(CreatePortfolioView)
