import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { loggedStateAtom } from "../atoms/loggedState.atom";
import Avatar from "react-avatar";
import { nftPublishModalStateAtom } from "../atoms/commonState.atom";

const Navbar = () => {
  const [loggedUser, setLoggedState] = useRecoilState(loggedStateAtom);
  const [nftPublishModal, setNftPublishModalState] = useRecoilState(
    nftPublishModalStateAtom
  );

  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (loggedUser) {
      setUsername(loggedUser.username);
      setAddress(loggedUser.address);
    }
  }, [loggedUser]);

  return (
    <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <a href="#" className="flex items-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThr3IG89j-Q0XR2WauHYpBLi68Jr1MHrtjlw&usqp=CAU"
            className="mr-3 h-6 sm:h-9"
            alt=""
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Algo Social
          </span>
        </a>
        <span>{address}</span>
        <div className="flex md:order-2">
          <button
            type="button"
            onClick={() => {
              setNftPublishModalState(true);
            }}
            className="text-black bg-primary-600 hover:bg-primary-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Publish NFT
          </button>

          <Avatar
            name={`${username}`}
            size="30"
            textSizeRatio={1.75}
            className="rounded-full mx-5 cursor-pointer"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
