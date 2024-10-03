import {
  useState,
  useEffect,
  ReactNode,
  Fragment,
  useContext,
  useCallback,
} from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDebouncedCallback } from '@hooks/useDebouncedCallback';
import { getFilteredLearningItems } from '@learn-to-win/common/features/LearningItems/learningItemService';
import {
  Card,
  CreateCardValues,
  ImportCardResponse,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { LearningItem } from '@learn-to-win/common/features/LearningItems/learningItemTypes';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ImportOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Alert, Divider, Form, Input, Select, Space, Tooltip } from 'antd';
import Button from '@components/Button';
import Text from '@components/Typography/Text';
import AuthoringCard from '@components/AuthoringCard';
import CardLoading from '@components/AuthoringCard/CardLoading';
import { DrawerContext } from '@pages/AdminLesson/context';
import { getCardsAndSetSelectedCardAction } from '@learn-to-win/common/features/Cards/cardSlice';
import { DrawerContext as DrawerContextType } from '@pages/AdminLesson/types';
import { useAppDispatch, useAppSelector } from '@hooks/reduxHooks';
import {
  createCardBatch,
  getCardsAPI,
} from '@learn-to-win/common/features/Cards/cardService';
import { CardType, LearningItemType } from '@learn-to-win/common/constants';

type SelectedLearningItemType = {
  id: string;
  type: LearningItemType;
  label: ReactNode;
} | null;

const ImportCardForm: React.FC = () => {
  const [searchLearningItem, setSearchLearningItem] = useState<
    string | undefined
  >(undefined);
  const [selectedLearningItem, setSelectedLearningItem] =
    useState<SelectedLearningItemType>(null);
  const [selectPlaceholder, setSelectPlaceholder] =
    useState<string>('Search to Select');
  const [firstCardIndex, setFirstCardIndex] = useState<string>('');
  const [lastCardIndex, setLastCardIndex] = useState<string>('');
  const [firstPreviewIndex, setFirstPreviewIndex] = useState<string>('');
  const [lastPreviewIndex, setLastPreviewIndex] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [shouldFetchKCCards, setShouldFetchKCCards] = useState<boolean>(false);
  const debouncedFirstPreviewIndex = useDebouncedCallback(setFirstPreviewIndex);
  const debouncedLastPreviewIndex = useDebouncedCallback(setLastPreviewIndex);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { setIsDrawerOpen, learningItemId, learningItemType } =
    (useContext(DrawerContext) as DrawerContextType) || {};
  const { cards: adminCards } = useAppSelector((state) => state.card);

  const getQueryString = ({
    learningItemType,
    selectedLearningItemType,
    firstPreviewIndex,
    lastPreviewIndex,
  }: {
    learningItemType: string;
    selectedLearningItemType: LearningItemType;
    firstPreviewIndex: string;
    lastPreviewIndex: string;
  }) => {
    let queryString = '';
    const sequenceOrderFilter = `&sequenceOrder[gte]=${Number(
      firstPreviewIndex,
    )}&sequenceOrder[lte]=${Number(lastPreviewIndex)}`;

    if (
      learningItemType === LearningItemType.QUIZ &&
      selectedLearningItemType === LearningItemType.LESSON
    ) {
      // Don't filter KC cards by sequence order
      queryString = '&type[]=knowledge';
    } else if (
      learningItemType === LearningItemType.QUIZ &&
      selectedLearningItemType === LearningItemType.QUIZ
    ) {
      queryString = `${sequenceOrderFilter}&type[]=quiz`;
    } else if (
      learningItemType === LearningItemType.LESSON &&
      selectedLearningItemType === LearningItemType.LESSON
    ) {
      queryString = `${sequenceOrderFilter}&type[]=lesson&type[]=knowledge`;
    }

    return queryString;
  };
  const { isFetching: cardsFetching, data: cardsData } = useQuery(
    [
      'fetch-searched-cards',
      selectedLearningItem,
      firstPreviewIndex,
      lastPreviewIndex,
    ],
    async () => {
      if (!selectedLearningItem?.id) {
        return;
      }
      if (Number(firstPreviewIndex) > Number(lastPreviewIndex)) {
        return [];
      }

      const queryString = getQueryString({
        learningItemType: learningItemType as string,
        selectedLearningItemType: selectedLearningItem?.type,
        firstPreviewIndex,
        lastPreviewIndex,
      });

      const cards = await getCardsAPI({
        learningItemId: selectedLearningItem?.id,
        filter: queryString,
      });
      setCurrentIndex(0);

      // Filter KC cards
      if (
        learningItemType === LearningItemType.QUIZ &&
        selectedLearningItem?.type === LearningItemType.LESSON &&
        firstPreviewIndex
      ) {
        const fromIdx = parseInt(firstPreviewIndex) - 1;
        const toIdx = lastPreviewIndex
          ? parseInt(lastPreviewIndex)
          : cards.length;
        return cards.slice(fromIdx, toIdx);
      }
      return cards;
    },
    {
      enabled:
        !!selectedLearningItem?.id && !!firstPreviewIndex && !!lastPreviewIndex,
    },
  );

  const { isLoading: recentItemsLoading, data: recentItemsData = [] } =
    useQuery('get-recent-learningItems', async () => {
      const searchQuery = `order[updatedAt]=desc${
        learningItemType === LearningItemType.LESSON ? '&type=lesson' : ''
      }`;
      return await getFilteredLearningItems({
        organizationId: '1edd401b-4f47-6b0c-af14-f7a89e373a72',
        searchQuery,
      });
    });

  const {
    isFetching: searchItemsFetching,
    data: searchItemsData = [],
    refetch: refetchLearningItemSearch,
  } = useQuery(
    'search-learningItems',
    async () => {
      return await getFilteredLearningItems({
        organizationId: '1edd401b-4f47-6b0c-af14-f7a89e373a72',
        searchQuery: `name=${searchLearningItem}${
          learningItemType === LearningItemType.LESSON ? '&type=lesson' : ''
        }`,
      });
    },
    { enabled: false },
  );

  const { mutate } = useMutation<
    ImportCardResponse,
    unknown,
    CreateCardValues[]
  >({
    mutationFn: async (cards: CreateCardValues[]) => {
      if (learningItemId) {
        return createCardBatch(cards, learningItemId);
      }
    },
    onSuccess: ({ cards }: ImportCardResponse) => {
      if (!cards?.length) {
        return;
      }
      dispatch(
        getCardsAndSetSelectedCardAction({
          learningItemId,
          selectedCardId: cards[adminCards.length].id,
        }),
      );
    },
  });

  const debounceLearningItemSearch = useDebouncedCallback(
    refetchLearningItemSearch,
  );
  const transformResponseToOption = (data: LearningItem[]) => {
    const numberOfItems = 5;
    return data.slice(0, numberOfItems).map((item: LearningItem) => {
      const IconTagName =
        item.type === 'lesson' ? ReadOutlined : ThunderboltOutlined;
      return {
        value: `${item.id}|${item.type}`,
        title: item.name,
        label: (
          <div className='import-card-form__select-drop'>
            <IconTagName data-testid={`${item.type}-icon`} />{' '}
            <Text>{item.name}</Text>
          </div>
        ),
      };
    });
  };
  const defaultSearchData = transformResponseToOption(recentItemsData);
  const filteredSearchData = transformResponseToOption(searchItemsData);
  const isSubmitDisabled =
    !selectedLearningItem?.id ||
    cardsFetching ||
    (!firstCardIndex && !lastCardIndex) ||
    (cardsData && !cardsData.length);
  useEffect(() => {
    debounceLearningItemSearch();
  }, [searchLearningItem, debounceLearningItemSearch]);

  const onFinish = useCallback(() => {
    if (!cardsData) {
      return;
    }
    if (setIsDrawerOpen) {
      setIsDrawerOpen(false);
      setSelectedLearningItem(null);
    }
    // Set sequence order to before the end card
    let newSequenceOrder = adminCards?.length;
    const transformedCards = cardsData?.map((card: Card) => {
      return {
        learningItemId,
        sequenceOrder: newSequenceOrder++,
        type:
          learningItemType === LearningItemType.QUIZ &&
          card?.type === 'knowledge'
            ? CardType.QUIZ_CARD
            : card?.type,
        title: card?.title,
        json: card?.json,
        confidenceCheck: card?.confidenceCheck,
      };
    });
    mutate(transformedCards);
  }, [
    cardsData,
    mutate,
    adminCards?.length,
    learningItemId,
    setIsDrawerOpen,
    learningItemType,
  ]);

  const { isFetching: kcCardsFetching } = useQuery(
    ['fetch-knowledge-check-cards', selectedLearningItem],
    async () => {
      if (!selectedLearningItem?.id) {
        return;
      }

      const queryString = '&type[]=knowledge';
      const cards = await getCardsAPI({
        learningItemId: selectedLearningItem.id,
        filter: queryString,
      });
      return cards;
    },
    {
      enabled: shouldFetchKCCards && !!selectedLearningItem?.id,
      onSuccess(data) {
        if (!data?.length) {
          setError('No knowledge cards available for this lesson. Try another');
        }
      },
    },
  );

  return (
    <Form form={form} onFinish={onFinish} className='import-card-form'>
      <div className='import-card-form'>
        <div>
          <Form.Item>
            <div className='import-card-form__desc'>
              <Text>Choose Lesson or Quiz to Import</Text>
              <Tooltip
                className={'import-card-form__tooltip'}
                title='Once you import the new cards, any changes you make to them will only affect the current lesson or quiz.'>
                <QuestionCircleOutlined></QuestionCircleOutlined>
              </Tooltip>
            </div>
            <Select
              showSearch
              labelInValue
              data-testid='import-search-select'
              dropdownRender={(menu) => {
                return (
                  <CardDrawerMenu
                    menu={menu}
                    searchLearningItem={searchLearningItem}
                  />
                );
              }}
              loading={
                searchItemsFetching || recentItemsLoading || kcCardsFetching
              }
              placeholder={selectPlaceholder}
              onFocus={() => {
                setSelectPlaceholder('Select');
              }}
              onBlur={() => {
                setSelectPlaceholder('Search to Select');
              }}
              value={{
                value: selectedLearningItem?.id as string,
                label: selectedLearningItem?.label,
              }}
              searchValue={searchLearningItem}
              optionLabelProp={'title'}
              filterOption={false}
              onChange={(input: { value: string; label: ReactNode }) => {
                const { value, label } = input;
                const id = value?.split('|')[0];
                const type = value?.split('|')[1] as LearningItemType;
                setError(null);
                setShouldFetchKCCards(
                  type === LearningItemType.LESSON &&
                    learningItemType === LearningItemType.QUIZ,
                );
                setSelectedLearningItem({
                  id,
                  type,
                  label,
                });
                setFirstCardIndex('');
                setLastCardIndex('');
              }}
              onSearch={(input) => {
                setSearchLearningItem(input);
              }}
              options={
                searchLearningItem ? filteredSearchData : defaultSearchData
              }
              status={error ? 'error' : undefined}></Select>
            {error && <div className='import-card-form__error'>{error}</div>}
          </Form.Item>
          {!!selectedLearningItem?.id && (
            <>
              <Form.Item>
                <div className='import-card-form__desc'>
                  <Text>Choose Card Numbers</Text>
                </div>
                <div className='import-card-form__indexes'>
                  <Form.Item rules={[{ required: true }]}>
                    <Input
                      aria-placeholder='Select'
                      data-testid={'first-preview-index'}
                      value={firstCardIndex}
                      onChange={(e) => {
                        const value = e?.target?.value;
                        if (Number(value) >= 1 || !value) {
                          setFirstCardIndex(value);
                          debouncedFirstPreviewIndex(value);
                        }
                        if (
                          Number(value) >= 1 &&
                          Number(value) >= Number(lastCardIndex)
                        ) {
                          setLastCardIndex(value);
                          debouncedLastPreviewIndex(value);
                        }
                      }}
                      type='number'
                      placeholder='Select'
                      disabled={!!error}></Input>
                  </Form.Item>
                  <p>To</p>
                  <Form.Item>
                    <Input
                      aria-placeholder='Select'
                      data-testid={'second-preview-index'}
                      onChange={(e) => {
                        const value = e?.target?.value;
                        if (Number(value) >= 1 || !value) {
                          setLastCardIndex(value);
                          debouncedLastPreviewIndex(value);
                        }
                        if (
                          (Number(value) >= 1 &&
                            Number(firstCardIndex) >= Number(value)) ||
                          !firstCardIndex
                        ) {
                          setFirstCardIndex(value);
                          debouncedFirstPreviewIndex(value);
                        }
                      }}
                      value={lastCardIndex}
                      type='number'
                      placeholder='Select'
                      disabled={!!error}></Input>
                  </Form.Item>
                </div>
              </Form.Item>
              {!!lastCardIndex && !!firstCardIndex && (
                <CardIndexPreview
                  cardsData={cardsData}
                  loading={cardsFetching}
                  firstCardIndex={firstCardIndex}
                  lastCardIndex={lastCardIndex}
                  currentIndex={currentIndex}
                  setCurrentIndex={setCurrentIndex}
                />
              )}
            </>
          )}
        </div>
        <Button
          disabled={isSubmitDisabled}
          data-testid='import-submit'
          classes={'import-card-form__submit'}
          htmlType='submit'
          type='primary'
          size='large'>
          <ImportOutlined /> Import
          {cardsData && cardsData.length > 0 && `(${cardsData.length})`}
        </Button>
      </div>
    </Form>
  );
};

export const CardIndexPreview: React.FC<{
  cardsData?: Card[];
  firstCardIndex: string;
  lastCardIndex: string;
  currentIndex: number;
  setCurrentIndex: (val: number) => void;
  loading: boolean;
}> = ({ cardsData, currentIndex, setCurrentIndex, loading }) => {
  return (
    <>
      <div className={'import-card-form__preview'}>
        {!cardsData?.length && !loading ? (
          <Space
            direction='vertical'
            className={'import-card-form__alert-space'}>
            <Alert message={'No Cards Available'} type='error' />
          </Space>
        ) : (
          <>
            <div>
              <Text>Previewing</Text>
            </div>
            <div>
              <Button
                htmlType='button'
                disabled={currentIndex === 0}
                data-testid='preview-previous'
                size={'small'}
                classes={'import-card-form__preview-buttons'}
                type='ghost'
                icon={<ArrowLeftOutlined />}
                onClick={() => {
                  if (currentIndex > 0) {
                    setCurrentIndex(currentIndex - 1);
                  }
                }}></Button>
              <Button
                htmlType='button'
                disabled={currentIndex === (cardsData && cardsData?.length - 1)}
                data-testid='preview-next'
                size={'small'}
                classes={'import-card-form__preview-buttons'}
                type='ghost'
                icon={<ArrowRightOutlined />}
                onClick={() => {
                  if (cardsData && currentIndex < cardsData?.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                  }
                }}></Button>
            </div>
          </>
        )}
      </div>
      <div className={'import-card-form__card-preview'}>
        {(loading || !!cardsData?.length) && (
          <div className={'import-card-form__shroud'}></div>
        )}
        {!loading && !!cardsData?.length && (
          // Does not rerender component without a key
          <AuthoringCard
            card={cardsData[currentIndex]}
            key={cardsData[currentIndex].id}
            previewMode
          />
        )}
        {loading && <CardLoading previewMode />}
      </div>
    </>
  );
};

const CardDrawerMenu: React.FC<{
  searchLearningItem: string | undefined;
  menu: ReactNode;
}> = ({ searchLearningItem, menu }) => {
  return (
    <Fragment>
      {!searchLearningItem && (
        <div>
          <Text classes={'import-card-form__dropdown-title'}>
            Recently Updated
          </Text>
          <Divider className='import-card-form__dropdown-divider'></Divider>
        </div>
      )}
      {menu}
    </Fragment>
  );
};

export default ImportCardForm;
