import React from 'react'
import { Box, Flex } from 'reflexbox'
import { RouteComponentProps } from 'react-router-dom'
import { Input, Button, Text } from '../../components'
import { ApiService } from '../../api'

const apiService = new ApiService() // todo: use DI

export interface IProps extends RouteComponentProps<null> {
}

export interface IState {
  email: string
  password: string
}

class LoginView extends React.Component<IProps, IState> {
  state: IState = {
    email: '',
    password: '',
  }

  private signup = async () => {
    const { email, password } = this.state
    try {
      await apiService.auth.signupWithEmailAndPassword(email, password)
      this.props.history.push('/dashboard')
    } catch (err) {
      alert(err)
    }
  }

  private login = async () => {
    const { email, password } = this.state
    try {
      await apiService.auth.signinWithEmailAndPassword(email, password)
      this.props.history.push('/dashboard')
    } catch (err) {
      alert(err)
    }
  }

  public render() {
    const { email, password } = this.state

    return (
      <Flex
        align='center'
        justify='center'
        column
        style={{minHeight: '100vh'}}
      >
        <Box my={'2rem'}>
          <Text xl bold capitalize>Login to your dolla</Text>          
        </Box>
        <Box mb={1}>
          <Text small light>Email or Username</Text>
          <Input
            type="text"
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
          />
        </Box>
        <Box mb={1}>
          <Text small light>Password</Text>
          <Input
            type="password"
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            handleReturn={this.login}
          />
        </Box>
        <Box>
          <Button style={{ marginRight: '4px'}} onClick={this.login}>Login</Button>
          <Button style={{ marginLeft: '4px'}} onClick={this.signup}>Sign Up</Button>
        </Box>
      </Flex>
    );
  }
}

export default LoginView