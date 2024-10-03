import {
  useAppDispatch,
  useAppSelector,
  useAppDispatch as useDispatch,
} from '@hooks/reduxHooks';
import { updateCardAction } from '@learn-to-win/common/features/Cards/cardSlice';
import {
  Card,
  ContentBlockType,
  SlateJSON,
} from '@learn-to-win/common/features/Cards/cardTypes';
import {
  deleteContentBlockFromCard,
  moveContentBlockDownInCard,
  moveContentBlockUpInCard,
  updateContentBlockInCard,
} from '@components/ContentBlock/CardHelper';
import { useCallback, useState, useEffect } from 'react';

export const useEditContentBlockControls = (id: string, card: Card) => {
  const dispatch = useDispatch();

  const moveContentUp = useCallback((): void => {
    const newCard: Card = moveContentBlockUpInCard(card, id);
    dispatch(updateCardAction(newCard));
  }, [id, card, dispatch]);

  const moveContentDown = useCallback((): void => {
    const newCard: Card = moveContentBlockDownInCard(card, id);
    dispatch(updateCardAction(newCard));
  }, [id, card, dispatch]);

  const deleteContent = useCallback((): void => {
    const newCard: Card = deleteContentBlockFromCard(card, id);
    dispatch(updateCardAction(newCard));
  }, [id, card, dispatch]);

  return { moveContentDown, moveContentUp, deleteContent };
};

export const useSaveRichTextBlock = () => {
  const dispatch = useDispatch();
  return useCallback(
    (
      richText: SlateJSON,
      card: Card,
      blockId: string,
      blockType: string,
      titleSynced?: boolean,
    ) => {
      const newCard = updateContentBlockInCard(
        card,
        {
          id: blockId,
          type: blockType,
          json: richText,
        } as ContentBlockType,
        titleSynced ?? card?.json?.titleSynced,
      );

      dispatch(updateCardAction(newCard));
    },
    [dispatch],
  );
};

export const useMediaActions = (
  card: Card,
  id: string,
  type: 'image' | 'video' | 'audio',
) => {
  const dispatch = useDispatch();
  const removeMediaUrl = () => {
    const newCard = updateContentBlockInCard(
      card,
      {
        id,
        type,
        url: undefined,
        name: undefined,
      },
      card?.json?.titleSynced,
    );
    dispatch(updateCardAction(newCard));
  };

  const addMediaUrl = (url: string, name: string) => {
    const newCard = updateContentBlockInCard(
      card,
      {
        id,
        type,
        url,
        name,
      },
      card?.json?.titleSynced,
    );
    dispatch(updateCardAction(newCard));
  };

  return { addMediaUrl, removeMediaUrl };
};

export const useBatchCardUpdates = (
  block: ContentBlockType,
  scrollToBottomRef: React.MutableRefObject<HTMLDivElement | null>,
) => {
  const [updatedBlock, setUpdatedBlock] = useState(block);
  const [updating, setUpdating] = useState<string>('');
  const [skipTitleSync, setSkipTitleSync] = useState<boolean>(true);
  const [titleSynced, setTitleSynced] = useState<boolean | undefined>(
    undefined,
  );
  const { cards, loading, selectedCardId } = useAppSelector(
    (state) => state.card,
  );
  const dispatch = useAppDispatch();
  const card: Card | undefined = cards?.find(
    (card: Card) => card.id === selectedCardId,
  );

  /* 
  Workaround for state being overridden if redux actions are dispatched at the
  same time. React will batch local state changes together so we can use previous state
  in the useState hook
  */
  useEffect(() => {
    if (updating && card) {
      const newCard = updateContentBlockInCard(
        card,
        updatedBlock,
        titleSynced ?? card?.json?.titleSynced,
        skipTitleSync,
      );

      if (updating === 'addOption') {
        scrollToBottomRef?.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      dispatch(updateCardAction(newCard));
      setUpdating('');
      setSkipTitleSync(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updating, updatedBlock, dispatch, skipTitleSync]);

  const updateBlock = (
    block: (prev: ContentBlockType) => ContentBlockType,
    action: string,
    skipTitleSync = true,
    titleSynced?: boolean,
  ) => {
    if (action === 'addOption' && loading) {
      return;
    }
    setSkipTitleSync(skipTitleSync);
    setTitleSynced(titleSynced);
    setUpdatedBlock(block);
    setUpdating(action);
  };

  return { updateBlock, block: updatedBlock };
};
