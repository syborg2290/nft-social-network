import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

let seStorage;

if (typeof window !== "undefined") {
  seStorage = window.sessionStorage;
}

const { persistAtom } = recoilPersist({
  key: "recoil-persist", // this key is using to store data in local storage
  storage: seStorage, // configurate which stroage will be used to store the data
});

export const loggedStateAtom = atom({
  key: "loggedAtomState",
  default: {
    username: "",
    address: "",
  },
  effects_UNSTABLE: [persistAtom],
});
