import { NextPage } from "next";
import { Reply } from "@spling/social-protocol";
import { useState } from "react";

interface Props {
  reply: Reply | null | undefined;
}

const Replies: NextPage<Props> = (props: Props) => {
  return (
    <div className="flex my-3 h-fit mx-[1.625rem] items-center">
      {props?.reply?.user?.avatar ? (
        <img
          src={props?.reply?.user?.avatar}
          alt="avatar"
          className="rounded-full h-[60px] w-[60px] border-4 border-[#A0D8EF] hover:cursor-pointer"
          onClick={() =>
            (window.location.href = `./Dashboard/${props?.reply?.userId}`)
          }
        />
      ) : (
        <img
          src="/ProfilePic.png"
          alt="ProfilePic"
          className="rounded-full h-[60px] w-[60px] border-4 border-[#A0D8EF] hover:cursor-pointer"
          onClick={() =>
            (window.location.href = `./Dashboard/${props?.reply?.userId}`)
          }
        />
      )}
      <div className="text-[#565656] bg-slate-200 rounded-2xl p-3 mx-6">
        {props?.reply?.text}
      </div>
    </div>
  );
};

export default Replies;
