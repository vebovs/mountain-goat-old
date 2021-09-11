import React from 'react';
import './slider.css';

export default class Card extends React.Component {
    constructor() {
        super();
        this.state = {
            data: '3'
        }
    }

    handleInput = (event) => {
        this.setState({ data: event.target.value });
        this.props.onRangeInput(event.target.value);
    }

    render() {
        return (
            <div className={!this.props.toggle ? 'slider-wrapper' : 'slider-wrapper visible'}>
                    <div className='slider-box'>
                        <input className='slider-input' step='1' min='1' max='10' value={this.state.data} onChange={data => this.handleInput(data)} type='range' orient='vertical' />
                        <button className={this.props.loading ? 'button is-link is-loading enter' : 'button enter'} onClick={this.props.enter}>
                            <span className='icon'>
                                <i className='fa fa-search'></i>
                            </span>
                        </button>
                        <button className='button remove' onClick={this.props.exit}>
                            <span className='icon'>
                                <i className='fa fa-times'></i>
                            </span>
                        </button>
                    </div>
            </div>
        );
    }
}