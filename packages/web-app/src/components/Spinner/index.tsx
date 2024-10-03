import { Spin } from 'antd';
import { ReactNode } from 'react';
import { SpinIndicator } from 'antd/es/spin';
interface SpinnerProps {
  spinning: boolean;
  children?: ReactNode[] | ReactNode;
  size?: 'small' | 'default' | 'large';
  indicator?: SpinIndicator;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  spinning,
  children = null,
  size,
  indicator,
  className,
}) => {
  return (
    <>
      {spinning ? (
        <div data-testid='spinner'>
          <Spin
            spinning={spinning}
            size={size}
            className={className}
            indicator={indicator}
          />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default Spinner;
