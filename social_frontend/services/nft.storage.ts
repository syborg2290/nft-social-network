import { NFTStorage } from "nft.storage";

export const upload = async (file: File) => {
  const endpoint: any = process.env.NEXT_PUBLIC_NFTSTORAGE_ENDPOINT; // the default
  const token: any = process.env.NEXT_PUBLIC_NFTSTORAGE_KEY; // your API key from https://nft.storage/manage
  const storage = new NFTStorage({ endpoint, token });
  const blob = new Blob([file], { type: file.type });

  const cid = await storage.storeBlob(blob);
  return `ipfs://${cid}`;
};
