import api from "../../../services/axios";

export const fetchMyProjectsApi = async () => {
  const { data } = await api.get('/projects/?creator=me');
  return data;
};

export const fetchMyDonationsApi = async () => {
  const { data } = await api.get('/users/me/donations/');
  return data;
};
