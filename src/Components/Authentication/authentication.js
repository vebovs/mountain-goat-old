import React from 'react';
import './authentication.css';

export default class Authentication extends React.Component {
    constructor() {
        super();
        this.state = {
          toggleLogin: true,
          toggleRegister: false,
          username: '',
          password: ''
        }
    }

    toggleLogin = () => {
      this.setState(() => ({
          toggleLogin: true,
          toggleRegister: false,
          username: '',
          password: ''
      }));
    }

    toggleRegister = () => {
      this.setState(() => ({
          toggleLogin: false,
          toggleRegister: true,
          username: '',
          password: ''
      }));
    }

    handleLogin = () => {
      this.props.onLoginInput(this.state.username, this.state.password);
    }

    handleRegister = () => {
      this.props.onRegisterInput(this.state.username, this.state.password);
    }
    
    render() {
        return (
          <div className='container is-fluid'>
            <div className='tabs'>
            <ul>
              <li className={this.state.toggleLogin ? 'is-active' : null}><button className={this.state.toggleLogin ? 'button is-link is-inverted' : 'button is-white'} onClick={this.toggleLogin}>Login</button></li>
              <li className={this.state.toggleRegister ? 'is-active' : null}><button className={this.state.toggleRegister ? 'button is-link is-inverted' : 'button is-white'} onClick={this.toggleRegister}>Register</button></li>
          </ul>
          </div>
          { this.state.toggleLogin && <div>
            <div className='field'>
              <label className='label'>Username</label>
              <div>
                <input className='input' onChange={(e) => this.setState({username: e.target.value})}  type='text' placeholder='Username'/>
              </div>
            </div>
            <div className='field'>
              <label className='label'>Password</label>
              <div>
                <input className='input' onChange={(e) => this.setState({password: e.target.value})} type='password' placeholder='Password'/>
              </div>
            </div>
            <div className='field'>
              <p className='control'>
                <button onClick={this.handleLogin} className='button is-info is-outlined'>
                  Login
                </button>
              </p>
          </div>
          </div>
          }
          { this.state.toggleRegister && <div>
            <div className='field'>
              <label className='label'>Username</label>
              <div>
                <input className='input' onChange={(e) => this.setState({username: e.target.value})} type='text' placeholder='Username'/>
              </div>
            </div>
            <div className='field'>
              <label className='label'>Password</label>
              <div>
                <input className='input' onChange={(e) => this.setState({password: e.target.value})} type='password' placeholder='Password'/>
              </div>
            </div>
            <div className='field'>
              <p className='control'>
                <button onClick={this.handleRegister} className='button is-info is-outlined'>
                  Register
                </button>
                { this.props.success &&
                  <span className='icon has-text-success'>
                    <i className='fa fa-check-square'></i>
                  </span>
                }
              </p>
          </div>
          </div>
          }
        </div>
        );
    }
}
