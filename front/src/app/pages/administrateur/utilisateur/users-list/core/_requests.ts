import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../../_metronic/helpers";
import { User, UsersQueryResponse } from "./_models";
import api from "../../../../../../services/api";

const USER_URL = `${import.meta.env.VITE_API_URL}/api/utilisateurs`;

const getUsers = (query: string): Promise<UsersQueryResponse> => {
  return api
    .get(`${USER_URL}?${query}`)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data);
};

const getUserById = (id: ID): Promise<User | undefined> => {
  return api
    .get(`${USER_URL}/${id}`)
    .then((response: AxiosResponse<User>) => response.data);
};

const createUser = (user: User): Promise<User | undefined> => {
  return api
    .post(USER_URL, user)
    .then((response: AxiosResponse<User>) => response.data);
};

// const updateUser = (id: ID, user: User): Promise<User | undefined> => {
//   return api.patch(`${USER_URL}/${id}`, user).then((response: AxiosResponse<User>) => response.data);
// };
const updateUser = (id: ID, user: User): Promise<User | undefined> => {
  return api
    .patch(`${USER_URL}/${id}`, user, {
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
    })
    .then((response: AxiosResponse<User>) => response.data);
};

const deleteUser = (userId: ID): Promise<void> => {
  return api.delete(`${USER_URL}/${userId}`).then(() => {});
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => api.delete(`${USER_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

export {
  getUsers,
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  createUser,
  updateUser,
};
