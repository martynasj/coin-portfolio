import React from 'react'
import { Box } from 'reflexbox'
import { Input, Button } from '../../components'
import { ApiService } from '../../api'

export interface IProps {
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
      await ApiService.auth.signupWithEmailAndPassword(email, password)
    } catch (err) {
      alert(err)
    }
  }

  private login = async () => {
    const { email, password } = this.state
    try {
      await ApiService.auth.signinWithEmailAndPassword(email, password)
    } catch (err) {
      alert(err)
    }
  }

  public render() {
    const { email, password } = this.state

    return (
      <Box>
        <p>Login</p>
        <Box mb={1}>
          <Input
            type="text"
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
          />
        </Box>
        <Box mb={1}>
          <Input
            type="text"
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
          />
        </Box>
        <Box>
          <Button onClick={this.login}>Login</Button>
          <Button onClick={this.signup}>Sign Up</Button>
        </Box>
      </Box>
    );
  }
}

export default LoginView