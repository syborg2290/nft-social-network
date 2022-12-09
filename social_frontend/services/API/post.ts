import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_HOST;

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const createPost = async (
  owner: string,
  account_mnemonic: string,
  properties: string,
  asset_url: string,
  file_name: string,
  mime_type: string,
  title: string,
  description: string
) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/post/create/`,
      {
        owner,
        account_mnemonic,
        properties,
        asset_url,
        file_name,
        mime_type,
        title,
        description,
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

export const getAllPosts = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/post/all/`, {
      headers: headers,
    });
    return res;
  } catch (error) {
    console.debug(error);
  }
};

export const transferAsset = async (
  postId: string,
  mnemonic: string,
  senderAddr: string,
  recipientAddr: string
) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/post/transferAsset/`,
      {
        postId,
        mnemonic,
        senderAddr,
        recipientAddr,
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

export const checkUserPosted = async (address: string) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/post/checkUserPosted/`, {
      headers: headers,
      params: {
        address: address,
      },
    });
    return res;
  } catch (error) {
    console.debug(error);
  }
};
