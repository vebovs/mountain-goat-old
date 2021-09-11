import React from 'react';

export default class Card extends React.Component {
 
    render() {
        return (
            <div>
                <nav className='level is-mobile'>
                    <div className='level-left'>
                        <button className='button is-link is-light' onClick={this.props.show}>{this.props.name}</button>
                    </div>
                    <div className='level-right'>
                        <div className='level-item'>
                            <button className='button is-light' onClick={this.props.clear}>Clear</button>
                            <button className='button' onClick={this.props.remove}>
                                <span className='icon'>
                                    <i className='fa fa-trash'></i>
                                </span>
                            </button>
                        </div>
                    </div>
                </nav>
         </div>
        );
    }
}