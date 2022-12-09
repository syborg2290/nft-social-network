import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_HOST;

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const createUser = async (username: string, address: string) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/user/create/`,
      {
        username: username,
        address: address,
      },
      {
        headers: headers,
      }
    );
    return res;
  } catch (error) {
    console.debug(error);
  }
};

export const getUserByAddress = async (address: string) => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/user/getByAccountAddress/`,
      {
        headers: headers,
        params: {
          address: address,
        },
      }
    );
    return res;
  } catch (error) {
    console.debug(error);
  }
};
