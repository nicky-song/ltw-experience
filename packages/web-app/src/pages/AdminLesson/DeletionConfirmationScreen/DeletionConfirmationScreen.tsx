import React from 'react';
import { Button } from 'antd';
import './DeletionConfirmationScreen.scss';
import Title from '@components/Typography/Title';

type DeletionConfirmationScreenProps = {
  closeDeleteConfirmationScreen: (flag: boolean) => void;
  deleteCard: () => void;
};
export const DeletionConfirmationScreen: React.FC<
  DeletionConfirmationScreenProps
> = ({ closeDeleteConfirmationScreen, deleteCard }) => {
  return (
    <div className='card-container__card-component delete-screen'>
      <Title level={4} classes={'delete-screen__title'}>
        Looks like you want to delete this card, is that right?
      </Title>
      <div className='delete-screen__buttons-container'>
        <Button
          type='default'
          size='large'
          onClick={() => closeDeleteConfirmationScreen(false)}>
          Cancel
        </Button>
        <Button
          type='primary'
          size='large'
          danger
          className='delete-screen__delete-button'
          onClick={deleteCard}>
          Yes, delete
        </Button>
      </div>
    </div>
  );
};
