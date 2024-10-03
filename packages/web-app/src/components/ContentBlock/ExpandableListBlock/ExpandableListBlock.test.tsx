import {
  Card,
  CardJson,
  ExpandableListBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import ExpandableListBlock from '.';
import { render, screen } from '@testing-library/react';
import { defaultSectionText } from '@learn-to-win/common/constants/expandableList';
import { MemoryRouter } from 'react-router-dom';
import { defineScrollIntoView } from '@/utils/testUtils';
import { CardType } from '@learn-to-win/common/constants';
jest.mock('@hooks/reduxHooks', () => ({
  useAppSelector: () => ({
    selectedCardId: '1',
  }),
  useAppDispatch: () => null,
}));

describe('Expandable list block', () => {
  const props = {
    key: 1,
    id: '1',
    card: {
      id: '1',
      title: 'Expandable List',
      type: CardType.LESSON_CARD,
      sequenceOrder: 1,
      learningItemId: '1',
      json: {} as CardJson,
      learningItem: '1',
    } as Card,
    showEditor: true,
    editing: true,
    block: {
      id: '1',
      type: 'expandableList',
      sections: [
        {
          id: '1',
          title: [
            {
              type: 'list-item',
              children: [
                {
                  text: 'Section Header 1',
                },
              ],
            },
          ],
          content: [
            {
              type: 'paragraph',
              children: [
                {
                  text: 'Hello There!',
                },
              ],
            },
          ],
        },
        {
          id: '2',
          title: [
            {
              type: 'list-item',
              children: [
                {
                  text: 'click me',
                },
              ],
            },
          ],
          content: [
            {
              type: 'paragraph',
              children: [
                {
                  text: defaultSectionText,
                },
              ],
            },
          ],
        },
        {
          id: '3',
          title: [
            {
              type: 'list-item',
              children: [
                {
                  text: 'Offline access',
                },
              ],
            },
          ],
          content: [
            {
              type: 'paragraph',
              children: [
                {
                  text: 'mobile',
                },
              ],
            },
          ],
        },
      ],
    } as ExpandableListBlockType,
  };
  it('should render a list block', () => {
    defineScrollIntoView();
    render(
      <MemoryRouter>
        <ExpandableListBlock {...props} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Hello There!/)).toBeInTheDocument();
    expect(screen.getByText(/click me/)).toBeInTheDocument();
    expect(screen.getByText(/Offline access/)).toBeInTheDocument();
  });
});
