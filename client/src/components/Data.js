import React from 'react';

const Data = props => (
  <div key={props.id} className="data">
    {props.data}
  </div>
)

export default Data;

