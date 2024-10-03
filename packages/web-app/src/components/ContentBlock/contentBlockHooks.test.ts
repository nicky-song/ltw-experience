import { renderHook } from '@testing-library/react';
import {
  useEditContentBlockControls,
  useMediaActions,
} from './contentBlockHooks';
import { Card, CardJson } from '@learn-to-win/common/features/Cards/cardTypes';
import { CardType } from '@learn-to-win/common/constants';
jest.mock('@hooks/reduxHooks', () => ({ useAppDispatch: () => null }));
describe('content block hooks', () => {
  it('should return functions with editor controls', () => {
    const { result } = renderHook(() =>
      useEditContentBlockControls('3', {
        id: '3',
        title: '',
        type: CardType.LESSON_CARD,
        sequenceOrder: 1,
        learningItemId: '1',
        json: {} as CardJson,
        learningItem: '1',
      } as Card),
    );
    const { moveContentUp, moveContentDown, deleteContent } = result.current;
    expect(moveContentDown).not.toBe(null);
    expect(moveContentUp).not.toBe(null);
    expect(deleteContent).not.toBe(null);
  });

  it('should return functions with media actions', () => {
    const { result } = renderHook(() =>
      useMediaActions(
        {
          id: '3',
          title: '',
          type: CardType.LESSON_CARD,
          sequenceOrder: 1,
          learningItemId: '1',
          json: {} as CardJson,
          learningItem: '1',
        } as Card,
        '3',
        'image',
      ),
    );

    const { addMediaUrl, removeMediaUrl } = result.current;
    expect(addMediaUrl).not.toBeNull();
    expect(removeMediaUrl).not.toBeNull();
  });
});
