import React from 'react';
import './dropdown.css';

export default class Dropdown extends React.Component {
    constructor() {
        super();
        this.state = {
            toggle: true,
            nickname: ''
        }
    }

    handleToggle = () => {
        this.setState(state => {
            return state.toggle = !state.toggle;
        });
    }

    handleInput = () => {
        this.props.save(this.state.nickname);
    }
 
    render() {
        return (
            <div className={this.props.visible ? 'dropdown-wrapper-visible' : 'dropdown-wrapper'}>
                <div className='container is-fluid'>
                    <button className={this.state.toggle ? 'button rotate-up' : 'button rotate-down'} onClick={this.handleToggle}>
                        <span className='icon'>
                            <i className='fa fa-chevron-down'></i>
                        </span>
                    </button>
                    <div className={this.state.toggle ? 'dropdown-content extend' : 'dropdown-content'}>
                        <div className='box'>
                            <div className='field'>
                                <div className='control'>
                                    <input onChange={(e) => this.setState({nickname: e.target.value})} className="input is info" type="text" placeholder="Nickname"></input>
                                </div>
                            </div>
                            <div className='field is-grouped'>
                                <p className='control'>
                                <button className='button' onClick={this.handleInput}>
                                    <span className='icon'>
                                        <i className='fa fa-heart'></i>
                                    </span>
                                </button>
                                </p>
                                <p className='control'>
                                <button className='button' onClick={this.props.close}>
                                    <span className='icon'>
                                        <i className='fa fa-times'></i>
                                    </span>
                                </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}