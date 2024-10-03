import { getApiGatewayUrl, getRestClient } from '../../utils/restClient';

export const getInvitationsAPI = async (userId: string | undefined) => {
  const res = await getRestClient().get(
    `${getApiGatewayUrl()}invitations?invitedUserId=${userId}&order[updatedAt]=desc`,
  );
  return res?.data['hydra:member'];
};

export const getInvitation = async (invitationId: string | undefined) => {
  const res = await getRestClient().get(
    `${getApiGatewayUrl()}invitations/${invitationId}`,
  );
  return res?.data;
};

export const getCourseInvitation = async (userId: string, courseId: string) => {
  const res = await getRestClient().get(
    `${getApiGatewayUrl()}invitations?invitedUserId=${userId}&courseId=${courseId}`,
  );
  return res?.data['hydra:member'];
};
