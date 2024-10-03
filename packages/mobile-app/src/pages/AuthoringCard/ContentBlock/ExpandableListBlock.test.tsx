import { render, screen } from '../../../test/testing';
import { ExpandableListBlock } from './ExpandableListBlock';
import {
  ExpandableListBlockType,
  SlateJSON,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { fireEvent } from '@testing-library/react-native';

const getSlateJSONWithText = (text: string): SlateJSON => [
  {
    type: 'paragraph',
    children: [
      {
        text,
      },
    ],
  },
];

describe('ExpandableListBlock', () => {
  // Tests that the expandable list block renders with the correct number of sections
  it('should render with correct number of sections', () => {
    // Arrange
    const contentBlock: ExpandableListBlockType = {
      sections: [
        {
          id: 'section1',
          title: getSlateJSONWithText('Section 1 Title'),
          content: getSlateJSONWithText('Section 1 Content'),
        },
        {
          id: 'section2',
          title: getSlateJSONWithText('Section 2 Title'),
          content: getSlateJSONWithText('Section 2 Content'),
        },
        {
          id: 'section3',
          title: getSlateJSONWithText('Section 3 Title'),
          content: getSlateJSONWithText('Section 3 Content'),
        },
      ],
      id: 'test-id',
      type: 'expandableList' as const,
    };

    // Act
    render(<ExpandableListBlock contentBlock={contentBlock} />);

    expect(screen.getByText(/Section 1 Content/)).toBeTruthy();

    fireEvent.press(screen.getByText(/Section 2 Title/));

    expect(screen.getByText(/Section 2 Content/)).toBeTruthy();
  });
});
