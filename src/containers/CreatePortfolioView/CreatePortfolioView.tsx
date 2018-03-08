import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { inject } from 'mobx-react'
import { connect, FelaWithStylesProps } from 'react-fela'
import { Box, Flex } from 'reflexbox'
import { Input, Button, Text } from '../../components'

interface State {
  name: string
  isCreating: boolean
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
    name: '',
    isCreating: false,
  }

  private handleCreatePortfolio = async () => {
    this.setState({ isCreating: true })
    try {
      const portfolioId = await this.props.portfolio!.createNewPortfolio(this.state.name)
      this.props.history.push(`/dashboard/${portfolioId}`)
    } catch (err) {
      alert(err)
    } finally {
      this.setState({ isCreating: false })
    }
  }

  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    this.setState({ name: input })
  }

  private isNameValid = () => this.state.name.length > 1

  public render() {
    const { styles } = this.props
    const { isCreating } = this.state

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
          <Input value={this.state.name} onChange={this.handleChange} />
        </Box>
        <Button
          style={{ minWidth: 120 }}
          disabled={!this.isNameValid() || isCreating}
          onClick={this.handleCreatePortfolio}
        >
          Create
        </Button>
      </Flex>
    )
  }
}

export default withStyles(CreatePortfolioView)
