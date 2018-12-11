import React from 'react';
import './arrow.css';

export default function Arrow(props) {
  const colorMapping = {
    olympic: {
      0: 'miss',
      1: 'white',
      2: 'white',
      3: 'black',
      4: 'black',
      5: 'blue',
      6: 'blue',
      7: 'red',
      8: 'red',
      9: 'yellow',
      10: 'yellow'
    },
    nfaa: {
      0: 'miss',
      1: 'nfaa-blue',
      2: 'nfaa-blue',
      3: 'nfaa-blue',
      4: 'nfaa-blue',
      5: 'white'
    }
  };

  console.log(props.targetType);
  console.log(props.arrow.score);
  console.log(colorMapping[props.targetType][props.arrow.score]);
  return (
    <div
      className={`score ${colorMapping[props.targetType][props.arrow.score]}`}
    >
      {props.arrow.score}
    </div>
  );
}
