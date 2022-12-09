import React, { useState } from "react";
import Avatar from "react-avatar";
import moment from "moment";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { loggedStateAtom } from "../atoms/loggedState.atom";
import { useRecoilState } from "recoil";
import TransferModal from "./TransferModal";
import { checkUserPosted } from "../services/API/post";

const Post = (props: any) => {
  const [loggedUser, setLoggedState] = useRecoilState(loggedStateAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [openTransferModal, setOpenTransferModal] = useState(false);

  const checkIsUserPosted = async () => {
    const res = await checkUserPosted(loggedUser.address);
    if (res?.data) {
      setOpenTransferModal(true);
    } else {
      alert("You have to publish atleast one nft before perform this!");
    }
  };

  return (
    <div className="w-full shadow h-auto bg-white rounded-md border border-dotted p-2">
      {openTransferModal && (
        <TransferModal
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          postId={props.post.postId}
          address={props?.post?.owner.address}
          loggedUser={loggedUser}
          setOpenTransferModal={setOpenTransferModal}
        />
      )}
      <div className="flex justify-between">
        <div className="w-10 h-10">
          <Avatar
            name={`${props?.post?.owner.username}`}
            size="30"
            textSizeRatio={1.75}
            className="rounded-full mx-5 cursor-pointer"
          />
        </div>
        <div className="flex-grow flex flex-col mx-10 mt-1">
          <p className="font-semibold text-sm text-gray-700">
            {props?.post?.owner.username}
          </p>
          <span className="text-xs font-thin text-gray-700">
            {moment(props?.post?.createdAt).fromNow()}
          </span>
        </div>
        <div className="w-8 h-8 mr-2">
          <button className="w-full h-full rounded-full bg-gray-200 focus:outline-none flex justify-center items-center">
            <DotsVerticalIcon className="h-5 w-5 text-black" />
          </button>
        </div>
      </div>
      {props?.post?.title ? (
        <div className="mb-1 mt-2">
          <p className="text-gray-700 max-h-10 truncate px-3 text-sm">
            {props.post.title}
          </p>
        </div>
      ) : null}
      {props?.post?.nftUrl ? (
        <div className="w-full h-96 max-h-80 rounded-md">
          <img
            src={`https://ipfs.io/ipfs/${props?.post?.nftUrl
              .split("ipfs://")
              .pop()}`}
            alt="postimage"
            className="w-full h-96 max-h-80 rounded-md"
          />
        </div>
      ) : null}
      {props?.post?.nftOwner ? (
        <div className="mb-1 mt-2">
          <span className="text-red-600 font-bold">Current Owner</span>
          <p className="text-gray-700 max-h-10 truncate px-3 text-sm">
            {props.post.nftOwner}
          </p>
        </div>
      ) : null}
      <div className="flex justify-center items-center my-5">
        <button
          type="button"
          onClick={() => {
            checkIsUserPosted();
          }}
          className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2"
        >
          <svg
            className="mr-2 -ml-1 w-4 h-4 "
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="bitcoin"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M504 256c0 136.1-111 248-248 248S8 392.1 8 256 119 8 256 8s248 111 248 248zm-141.7-35.33c4.937-32.1-20.19-50.74-54.55-62.57l11.15-44.7-27.21-6.781-10.85 43.52c-7.154-1.783-14.5-3.464-21.8-5.13l10.93-43.81-27.2-6.781-11.15 44.69c-5.922-1.349-11.73-2.682-17.38-4.084l.031-.14-37.53-9.37-7.239 29.06s20.19 4.627 19.76 4.913c11.02 2.751 13.01 10.04 12.68 15.82l-12.7 50.92c.76 .194 1.744 .473 2.829 .907-.907-.225-1.876-.473-2.876-.713l-17.8 71.34c-1.349 3.348-4.767 8.37-12.47 6.464 .271 .395-19.78-4.937-19.78-4.937l-13.51 31.15 35.41 8.827c6.588 1.651 13.05 3.379 19.4 5.006l-11.26 45.21 27.18 6.781 11.15-44.73a1038 1038 0 0 0 21.69 5.627l-11.11 44.52 27.21 6.781 11.26-45.13c46.4 8.781 81.3 5.239 95.99-36.73 11.84-33.79-.589-53.28-25-65.99 17.78-4.098 31.17-15.79 34.75-39.95zm-62.18 87.18c-8.41 33.79-65.31 15.52-83.75 10.94l14.94-59.9c18.45 4.603 77.6 13.72 68.81 48.96zm8.417-87.67c-7.673 30.74-55.03 15.12-70.39 11.29l13.55-54.33c15.36 3.828 64.84 10.97 56.85 43.03z"
            ></path>
          </svg>
          Get
        </button>
      </div>
    </div>
  );
};

export default Post;
