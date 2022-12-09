import { useRouter } from "next/router";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { loggedStateAtom } from "../atoms/loggedState.atom";
import { createUser } from "../services/API/user";
import ButtonLoading from "./common/ButtonLoading";

const SignupModal = (props: any) => {
  const router = useRouter();
  const [loggedUser, setLoggedState] = useRecoilState(loggedStateAtom);
  const [username, setUsername] = useState("");
  const [isLoading, setLoading] = useState(false);

  const submit = (e: any) => {
    e.preventDefault();
    try {
      if (username !== "") {
        setLoading(true);
        const AlgoSigner = window.AlgoSigner;

        if (typeof AlgoSigner !== "undefined") {
          AlgoSigner.connect()
            .then((succ: any) => {
              AlgoSigner.accounts({
                ledger: "TestNet",
              })
                .then(async (d: any) => {
                  const address = d[0].address;
                  const res = await createUser(username, address);
                  if (res) {
                    if (res.data.status !== 200) {
                      alert(res.data.result.description[0]);
                      setLoading(false);
                    } else {
                      setLoggedState({
                        address: address,
                        username: username,
                      });
                      setLoading(false);
                      router.push("/Feed");
                    }
                  } else {
                    alert("Something went wrong,please try again!");
                    setLoading(false);
                  }
                })
                .catch((e: any) => {
                  setLoading(false);
                  console.debug(e);
                });
            })
            .catch(() => {
              setLoading(false);
              alert("Failed to connect algosigner wallet");
            });
        } else {
          setLoading(false);
          alert("Algosigner not installed!");
        }
      } else {
        alert("Username is required!");
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div
      id="signup-modal"
      aria-hidden="true"
      className="flex justify-center items-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full bg-gray-600 bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-md h-full md:h-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-toggle="authentication-modal"
            onClick={() => {
              props.setSignupOpen(false);
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
              Create Your New Account
            </h3>
            <form className="space-y-6" action="#">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Johndoe"
                  required
                />
              </div>
              <button
                type="submit"
                onClick={submit}
                disabled={isLoading}
                className="w-full text-white bg-primary-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                {isLoading ? <ButtonLoading /> : "Create account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
