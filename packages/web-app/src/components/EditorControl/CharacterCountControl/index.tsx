import React from 'react';
import './index.scss';
import { Progress } from 'antd';

interface CharacterCountControlProps {
  characterCount?: number;
  textLength: number;
}

const CharacterCountControl: React.FC<CharacterCountControlProps> = (
  props: CharacterCountControlProps,
) => {
  const percent = props.characterCount
    ? (props.textLength / props.characterCount) * 100
    : 0;
  return (
    <div
      className='edit-control-character-count'
      style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span className='edit-control-character-count-text'>Character Count</span>
      <Progress
        style={{ width: '30px' }}
        type='circle'
        percent={percent}
        status={percent > 100 ? 'exception' : 'success'}
        size={30}
        format={() => ''}
      />
    </div>
  );
};

export default CharacterCountControl;
