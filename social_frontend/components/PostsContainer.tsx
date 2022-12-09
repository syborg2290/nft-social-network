import React from "react";
import Post from "./Post";

const PostsContainer = (props: any) => {
  return (
    <div className="mt-4 w-1/2 h-full">
      <div className="grid grid-cols-2 gap-5 overflow-y-auto">
        {props.posts.length > 0 ? (
          props.posts.map((post: any, idx: any) => {
            return <Post key={idx} post={post} />;
          })
        ) : (
          <span className="text-center font-bold text-2xl">No posts yet!</span>
        )}
      </div>
    </div>
  );
};

export default PostsContainer;
