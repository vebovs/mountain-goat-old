import React from 'react';
import './alert.css';

export default class Alert extends React.Component {

    render() {
        return (
            <div className={this.props.alert ? 'error flash' : 'error'}>
                <article className="message is-danger">
                    <div className="message-header">
                        <p>Alert</p>
                        <button onClick={this.props.onClick} className="delete" aria-label="delete"></button>
                    </div>
                    <div className="message-body">
                        {
                            this.props.children
                        }
                    </div>
                </article>
            </div>
        );
    }
}

