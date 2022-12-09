import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { nftPublishModalStateAtom } from "../atoms/commonState.atom";
import { loggedStateAtom } from "../atoms/loggedState.atom";
import Navbar from "../components/Navbar";
import PostsContainer from "../components/PostsContainer";
import PublishNFTModal from "../components/PublishNFTModal";
import { useEffectOnce } from "../hooks/useEffectOnece";
import { getAllPosts } from "../services/API/post";
import LoadingScreen from "../components/common/LoadingScreen";

const Feed: NextPage = () => {
  const router = useRouter();
  const [loggedUser, setLoggedState] = useRecoilState(loggedStateAtom);
  const [allPosts, setAllPosts] = useState([]);
  const [nftPublishModal, setNftPublishModalState] = useRecoilState(
    nftPublishModalStateAtom
  );

  const [isLoadingPosts, setLoadingPosts] = useState(true);

  useEffectOnce(() => {
    getAllPostsFunc();
    return () => console.debug("effect is destroyed");
  });

  const getAllPostsFunc = async () => {
    try {
      if (loggedUser?.address === "" && loggedUser?.username === "") {
        router.push("/Login");
      } else {
        const res: any = await getAllPosts();
        if (res !== null) {
          setAllPosts(res.data);
          setLoadingPosts(false);
        } else {
          setAllPosts([]);
          setLoadingPosts(false);
        }
      }
    } catch (error) {
      console.debug(error);
    }
  };

  return (
    <>
      {nftPublishModal && (
        <PublishNFTModal
          address={loggedUser?.address ? loggedUser?.address : ""}
          setNftPublishModalState={setNftPublishModalState}
        />
      )}

      <Navbar />
      <div className="mt-6 pb-5 flex justify-center items-center">
        {isLoadingPosts ? (
          <LoadingScreen />
        ) : (
          <PostsContainer posts={allPosts} />
        )}
      </div>
    </>
  );
};

export default Feed;
