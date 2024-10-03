import { getApiGatewayUrl, getRestClient } from '../../utils/restClient';
import { Card, CreateCardValues, GetCardsParams } from './cardTypes';

export const getCardsAPI = async ({
  learningItemId,
  filter,
}: GetCardsParams): Promise<Card[]> => {
  const res = await getRestClient().get(
    `${getApiGatewayUrl()}learning_items/${learningItemId}/cards?order[sequenceOrder]=asc${
      filter ?? ''
    }`,
  );
  return res?.data['hydra:member'];
};

export const createCard = async (
  card: CreateCardValues,
): Promise<{ id: string }> => {
  const res = await getRestClient().post<{ id: string }>(
    `${getApiGatewayUrl()}cards`,
    {
      title: card.title,
      type: card.type,
      sequenceOrder: card.sequenceOrder,
      learningItem: `/api/learning_items/${card.learningItemId}`,
      confidenceCheck: card.confidenceCheck ?? false,
      json: card.json,
    },
  );
  return res?.data;
};

export const createCardBatch = async (
  cards: CreateCardValues[],
  learningItemId: string,
) => {
  const res = await getRestClient().post(
    `${getApiGatewayUrl()}learning_items/${learningItemId}/cards`,
    { cards },
  );
  return res?.data;
};

export const updateCard = async (card: Partial<Card> & { id: string }) => {
  const res = await getRestClient().patch(
    `${getApiGatewayUrl()}cards/${card.id}`,
    card,
    {
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
    },
  );
  return res?.data;
};

export const deleteCard = async (id: string) => {
  await getRestClient().delete(`${getApiGatewayUrl()}cards/${id}`);
};
