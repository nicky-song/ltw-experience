import classNames from 'classnames';
import Spinner from '@components/Spinner';
import Title from '@components/Typography/Title';

interface CardLoadingProps {
  previewMode?: boolean;
}

const CardLoading: React.FC<CardLoadingProps> = ({ previewMode = false }) => {
  return (
    <div
      className={classNames({
        'card-container__wrapper': true,
        'card-container__wrapper__preview-mode': previewMode,
      })}>
      <div
        className={classNames({
          'card-container__card-component': true,
          'card-container__preview-mode': previewMode,
        })}>
        <Title level={4}>{'Loading'}</Title>
        <Spinner
          className='card-container__spinner'
          size={'large'}
          spinning={true}></Spinner>
      </div>
    </div>
  );
};

export default CardLoading;
