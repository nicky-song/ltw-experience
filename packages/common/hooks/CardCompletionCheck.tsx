// Card Completion Context
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Card, ExpandableListBlockType } from '../features/Cards/cardTypes';
import { CardEnrollment } from '../features/Enrollments/enrollmentTypes';
import { CardType } from '../constants';

const CardCompletionCheckContext = createContext<
  | (CardCompletion & {
      setState: Dispatch<SetStateAction<CardCompletion>>;
    })
  | null
>(null);

type CardCompletion = {
  currentCardId: string | null;
  expandableLists: Record<string, boolean[]>;
  mediaPlayed: Record<string, boolean>;
};
export const CardCompletionCheckProvider: FC<{
  cardId: string;
  card: Card;
  children: ReactNode;
}> = ({ children, cardId, card }) => {
  const [state, setState] = useState({
    currentCardId: cardId,
    expandableLists: {},
    mediaPlayed: {}, // default to true while determining if video exists or not
  } as CardCompletion);

  // get the expandable list sections from the card
  useEffect(() => {
    const expandableListBlocks = card?.json?.contentBlocks?.filter(
      (contentBlock) => contentBlock.type === 'expandableList',
    ) as ExpandableListBlockType[];
    expandableListBlocks.forEach((expandableListBlock) => {
      setState((prevState) => ({
        ...prevState,
        expandableLists: {
          ...prevState.expandableLists,
          [expandableListBlock.id]: expandableListBlock.sections.map(
            (_, i) => i === 0,
          ),
        },
      }));
    });
  }, [card]);

  // get the video block from the card
  useEffect(() => {
    const mediaBlocks = card?.json?.contentBlocks?.filter(
      (contentBlock) =>
        (contentBlock.type === 'video' || contentBlock.type === 'audio') &&
        contentBlock.url,
    );

    mediaBlocks.forEach((videoBlock) => {
      setState((prevState) => ({
        ...prevState,
        mediaPlayed: {
          ...prevState.mediaPlayed,
          [videoBlock.id]: false,
        },
      }));
    });
  }, [card]);

  const memoizedValue = useMemo(() => {
    return {
      ...state,
      setState,
    };
  }, [state]);
  return (
    <CardCompletionCheckContext.Provider value={memoizedValue}>
      {children}
    </CardCompletionCheckContext.Provider>
  );
};

export const useCardCompletionCheck = ({
  isAtBottom,
  cardEnrollment,
  cardType,
}: {
  isAtBottom: boolean;
  cardEnrollment?: CardEnrollment;
  cardType?: CardType;
}) => {
  const context = useContext(CardCompletionCheckContext);
  const isInContext = context !== null;

  // Calculate if the card is complete and the reason why it isn't complete
  return useMemo(() => {
    if (isInContext) {
      const { expandableLists, mediaPlayed } = context!;

      const isExpandableListComplete = Object.values(expandableLists).every(
        (section) => section.every((isComplete) => isComplete),
      );
      const isEveryMediaBlockCompleted = Object.values(mediaPlayed).every(
        (isComplete) => isComplete,
      );

      const isAtBottomOfScreen = isAtBottom;

      // Overrides
      const isCardEnrollmentComplete = cardEnrollment?.completedAt;

      const isCompletionUIHidden =
        cardType === CardType.KNOWLEDGE_CARD || cardType === CardType.QUIZ_CARD; // knowledge & quiz cards handle their own completion UI
      const isOverridden = isCardEnrollmentComplete;

      let message = '';

      if (cardType === 'title') {
        message = 'Get Started';
      } else if (isOverridden) {
        message = 'Continue';
      } else if (!isExpandableListComplete) {
        message = 'Expand All To Continue';
      } else if (!isEveryMediaBlockCompleted) {
        message = 'Play To Continue';
      } else if (!isAtBottomOfScreen) {
        message = 'Scroll To Continue';
      } else {
        message = 'Continue';
      }

      const isCompleted =
        isOverridden ||
        (isExpandableListComplete &&
          isAtBottomOfScreen &&
          isEveryMediaBlockCompleted);

      return {
        isCardComplete: isCompleted,
        continueMessage: message,
        isCompletionUIHidden,
      };
    }
    return { isCardComplete: false, continueMessage: '' };
  }, [cardEnrollment?.completedAt, cardType, context, isAtBottom, isInContext]);
};

export const useCardCompletionForExpandableList = (contentBlockId: string) => {
  const context = useContext(CardCompletionCheckContext);

  // Handle section marked as viewed
  const setExpandableListSectionAsViewed = useCallback(
    (index: number) => {
      context?.setState((prev) => {
        const prevSections = [...prev.expandableLists[contentBlockId]];
        prevSections[index] = true;
        return {
          ...prev,
          expandableLists: {
            ...prev.expandableLists,
            [contentBlockId]: prevSections,
          },
        };
      });
    },
    [contentBlockId, context],
  );

  return { setExpandableListSectionAsViewed };
};

export const useCardCompletionForMedia = (contentBlockId: string) => {
  const context = useContext(CardCompletionCheckContext);

  const setMediaAsViewed = useCallback(() => {
    context?.setState((prev) => {
      return {
        ...prev,
        mediaPlayed: {
          ...prev.mediaPlayed,
          [contentBlockId]: true,
        },
      };
    });
  }, [contentBlockId, context]);
  return {
    setMediaAsViewed,
  };
};
