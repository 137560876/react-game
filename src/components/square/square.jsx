import React from 'react';
import './square.less';

export default class Square extends React.Component {

  render() {

    return (
      <button style={{background: this.props.color}} id={this.props.Sid} className="square" onClick={this.props.newonClick}>
        <div id={this.props.Nid} className="num">{this.props.value}</div>
      </button >
    );
  }
}