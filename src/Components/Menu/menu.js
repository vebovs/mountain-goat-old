import React from 'react';
import './menu.css';

export default class Menu extends React.Component {
    constructor() {
        super();
        this.state = {
            toggle: false
        };
    }

    toggle = () => {
        this.setState(state => ({
            toggle: !state.toggle
        }));
    }

    render() {
        return (
            <div className={!this.state.toggle ? 'wrapper' : 'wrapper responsive'}>
                <div className='menubtn'>
                    <button className='button' onClick={this.toggle}>
                        <span className='icon'>
                            <i className='fa fa-user'></i>
                        </span>
                    </button>
                </div>
                <div className='menu'>
                    <div className='container is-fluid'>
                        <nav className='level'>
                            <div className='level-left'>
                                <div className='level-item'>
                                    <h3 className='title is-3'>{this.props.title}</h3>
                                </div>
                            </div>
                            <div className='level-right'>
                                <div className='level-item'>
                                    <button className='button' onClick={this.toggle}>
                                        <span className='icon'>
                                            <i className='fa fa-times'></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </nav>
                    </div>
                    <div>
                        {
                            this.props.children
                        }
                    </div>
                </div>
            </div>
        );
    }
}