import Text from '@components/Typography/Text';
import './styles.scss';
import { Fragment } from 'react';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

interface PasswordRequirementsProps {
  passwordRequirements: Array<[string, boolean]>;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  passwordRequirements,
}) => {
  return (
    <Fragment>
      <div className={'password-requirements'}>
        {passwordRequirements.map((data) => (
          <div key={data[0]} className='password-requirements__requirements'>
            <Text classes='password-requirements__leftContainer'>
              {data[0]}
            </Text>
            <div>
              {data[1] ? (
                <CheckCircleFilled className='password-requirements__check' />
              ) : (
                <CloseCircleFilled className='password-requirements__close' />
              )}
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default PasswordRequirements;
