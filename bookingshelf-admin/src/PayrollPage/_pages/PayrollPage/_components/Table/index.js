import React, { Component } from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

class Index extends Component {
  render() {
    return (
      <div className="table-container">
        <table className="table">
          <TableHeader/>
          <TableBody/>
        </table>
      </div>
    );
  }
}

export default Index;
