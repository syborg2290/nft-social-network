import Image from "next/image";
import React, { useState } from "react";
import { createPost } from "../services/API/post";
import { getUserByAddress } from "../services/API/user";
import { upload } from "../services/nft.storage";
import ButtonLoading from "./common/ButtonLoading";

const PublishNFTModal = (props: any) => {
  const [isLoading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const onChangeFileSelector = (e: any) => {
    const files: File[] = Array.from(e.target.files);
    setImage(files[0]);
  };

  const submit = async () => {
    if (title !== "") {
      if (description !== "") {
        if (mnemonic !== "") {
          if (image !== null) {
            setLoading(true);
            const assetUrl = await upload(image);
            if (assetUrl) {
              const user = await getUserByAddress(props.address);
              if (user) {
                const properties = {
                  Bass: "Groovy",
                  Vibes: "Funky",
                  Overall: "Good stuff",
                };
                const res = await createPost(
                  user?.data.result._id,
                  mnemonic,
                  JSON.stringify(properties),
                  assetUrl,
                  image.name,
                  image.type,
                  title,
                  description
                );
                if (res) {
                  if (res.data.status !== 200) {
                    alert(res.data.result.description[0]);
                    setLoading(false);
                  } else {
                    setLoading(false);
                    props.setNftPublishModalState(false);
                    alert("Success!");
                    window.location.reload();
                  }
                } else {
                  alert("Something went wrong,please try again!");
                  setLoading(false);
                }
              }
            }
          } else {
            alert("Please select an image!");
          }
        } else {
          alert("Account mnemonic is required!");
        }
      } else {
        alert("Description is required!");
      }
    } else {
      alert("Title is required!");
    }
  };

  return (
    <div
      id="nft-publish"
      aria-hidden="true"
      className="flex justify-center items-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full bg-gray-600 bg-opacity-50"
    >
      <div className="relative p-2 w-full max-w-md h-full md:h-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 top-20">
          <button
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-toggle="authentication-modal"
            onClick={() => {
              props.setNftPublishModalState(false);
            }}
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="py-6 px-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Publish your NFTs
            </h3>
            <div className="flex justify-center items-center w-full">
              <label className="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                {image !== null ? (
                  <Image
                    src={URL.createObjectURL(image)}
                    width={450}
                    height={350}
                    className="w-full h-full rounded-md"
                  />
                ) : (
                  <div className="flex flex-col justify-center items-center pt-5 pb-6">
                    <svg
                      aria-hidden="true"
                      className="mb-3 w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to select</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF
                    </p>
                  </div>
                )}
                <input
                  id="dropzone-file"
                  multiple={false}
                  onChange={onChangeFileSelector}
                  type="file"
                  className="hidden"
                  accept="image/png, image/gif, image/jpeg"
                  required
                />
              </label>
            </div>
            <form className="space-y-6 my-2" action="#">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Account MNEMONIC
                </label>
                <input
                  type="text"
                  name="mNEMONIC"
                  id="mNEMONIC"
                  onChange={(e) => {
                    setMnemonic(e.target.value);
                  }}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Coolest nft you have ever seen!"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Coolest nft you have ever seen!"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  rows={4}
                  name="description"
                  id="description"
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Tell more about your nft"
                  required
                />
              </div>
              <button
                type="submit"
                onClick={submit}
                disabled={isLoading}
                className="w-full text-white bg-primary-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                {isLoading ? <ButtonLoading /> : "Publish"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishNFTModal;
