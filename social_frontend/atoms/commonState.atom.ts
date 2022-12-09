import { atom } from "recoil";

export const nftPublishModalStateAtom = atom({
  key: "nftPublishModalState",
  default: false,
});

export const postsStateAtom = atom({
  key: "postsState",
  default: [],
});
