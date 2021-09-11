import React from 'react';

export default class Dashboard extends React.Component {
    constructor() {
        super();
        this.state = {
          togglePanel: true,
          toggleLogout: false,
          username: '',
          password: ''
        }
    }

    togglePanel = () => {
      this.setState(() => ({
          togglePanel: true,
          toggleLogout: false
      }));
    }

    toggleLogout = () => {
      this.setState(() => ({
          togglePanel: false,
          toggleLogout: true
      }));
    }
    
    render() {
        return (
          <div className='container is-fluid'>
            <div className='tabs'>
            <ul>
              <li className={this.state.togglePanel ? 'is-active' : null}><button className={this.state.togglePanel ? 'button is-link is-inverted' : 'button is-white'} onClick={this.togglePanel}>{this.props.panel}</button></li>
              <li className={this.state.toggleLogout ? 'is-active' : null}><button className={this.state.toggleLogout ? 'button is-link is-inverted' : 'button is-white'} onClick={this.toggleLogout}>Logout</button></li>
          </ul>
          </div>
          { this.state.togglePanel && <div>
            {this.props.children}
          </div>
          }
          { this.state.toggleLogout && <div>
            <div className='field'>
              <p className='control'>
                <button onClick={this.props.onClick} className='button is-info is-outlined'>
                  Logout
                </button>
              </p>
          </div>
          </div>
          }
        </div>
        );
    }
}
