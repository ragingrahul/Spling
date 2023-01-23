import React, { useState, useEffect, useRef } from "react";
import {
  SocialProtocol,
  Post,
  User,
  ProtocolOptions,
} from "@spling/social-protocol";
import { WalletContextState, useWallet } from "@solana/wallet-adapter-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from 'next/head'

import Posts from "@/components/Post";

const getTruncatedAddress = (address: string | undefined) => {
  if (!address) {
    return "";
  }
  return `${address.slice(0, 7)}...${address.slice(address.length - 7)}`;
};

const convertBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
const options = {
  rpcUrl:
    "https://rpc.helius.xyz/?api-key=07172e08-2375-4358-9ad1-522bd8871a8e",
  useIndexer: true,
} as ProtocolOptions;

export default function GroupFeed() {
  const [socialProtocol, setSocialProtocol] = useState<SocialProtocol>();
  const [walletAddress, setWalletAddress] = useState<WalletContextState>();
  const [userInfo, setUserInfo] = useState<User | null>();
  const [posts, setPosts] = useState<Post[]>();
  const [bio, setBio] = useState<any>();

  const solWal = useWallet();

  useEffect(() => {
    setWalletAddress(solWal);

    const initialize = async () => {
      if (walletAddress?.wallet?.adapter?.publicKey) {
        const socialProtocol: SocialProtocol = await new SocialProtocol(
          solWal,
          null,
          options
        ).init();
        setSocialProtocol(socialProtocol);

        const userInitialize = async () => {
          if (walletAddress?.wallet?.adapter?.publicKey) {
            const user = await socialProtocol.getUserByPublicKey(
              walletAddress?.wallet?.adapter?.publicKey
            );
            setUserInfo(user);
            console.log(user);
            if (!user) {
              window.location.href = "/";
            }

            if (user) {
              setBio(JSON.parse(user?.bio));
            }
          }
        };

        toast.promise(userInitialize(), {
          pending: "Initializing Profile",
          success: "Profile Initialized",
          error: "Error Initializing Profile",
        });

        const postInitialize = async () => {
          if (socialProtocol !== null && socialProtocol !== undefined) {
            const posted: Post[] = await socialProtocol.getAllPosts(15);
            setPosts(posted);
            console.log(posted);
          }
        };

        toast.promise(postInitialize(), {
          pending: "Initializing posts",
          success: "Posts Initialized",
          error: "Error Initializing Posts",
        });
      }
    };
    initialize();
  }, [solWal]);

  const setCategory = async (number: number) => {
    if (socialProtocol) {
      const postInitialize = async () => {
        const posted: Post[] = await socialProtocol.getAllPosts(number);
        setPosts(posted);
      };
      toast.promise(postInitialize(), {
        pending: "Initializing posts",
        success: "Posts Initialized",
        error: "Error Initializing Posts",
      });
    }
  };

  return (
    <div className="bg-[#747474] h-screen flex justify-center">
      <Head>
        <title>Spling Gym Feed</title>
      </Head>
      <div className="bg-[#747474] h-fit w-full flex justify-center">
        <div className=" flex flex-col w-[960px] h-fit ml-28">
          <div className="bg-slate-200 text-[#565656] flex flex-row rounded-b-3xl p-7">
            <div className="flex flex-col w-1/2">
              <img src="/Logo.png" alt="logo" className="w-[240px] hover:cursor-pointer" onClick={() => {window.location.href="./"}} />
              <h2 className="text-2xl">Feed</h2>
            </div>
            <div className="flex flex-row w-1/2 justify-end">
              <div
                className="flex flex-col items-end justify-around mr-[20px] px-[10px] pl-[80px] bg-[#A0D8EF] rounded-2xl hover:cursor-pointer"
                onClick={() =>
                  (window.location.href = `./Dashboard/${userInfo?.userId}`)
                }
              >
                <h2 className="text-xl">{userInfo?.nickname}</h2>
                <h2 className="tracking-wider">
                  {getTruncatedAddress(userInfo?.publicKey?.toString())}
                </h2>
              </div>

              {userInfo?.avatar ? (
                <img
                  src={userInfo?.avatar}
                  alt="avatar"
                  className="rounded-full h-[80px] w-[80px] border-4 border-[#A0D8EF] hover:cursor-pointer"
                  onClick={() =>
                    (window.location.href = `./Dashboard/${userInfo?.userId}`)
                  }
                />
              ) : (
                <img
                  src="/ProfilePic.png"
                  alt="ProfilePic"
                  className="rounded-full h-[80px] w-[80px] border-4 border-[#A0D8EF] hover:cursor-pointer"
                  onClick={() =>
                    (window.location.href = `./Dashboard/${userInfo?.userId}`)
                  }
                />
              )}
            </div>
          </div>
          <div className="w-[100%] h-[25.2rem] bg-slate-200 rounded-2xl flex flex-col mt-5 mb-1">
            <h1 className="my-5 text-4xl ml-7 text-[#565656] font-[Chillax]">
              Your Interests
            </h1>
            <div className="flex flex-row w-[100%] h-72">
              {bio?.Cardio && (
                <div className="bg-[#565656] rounded-2xl w-[25%] h-[100%]  ml-7">
                  <button
                    className="h-[100%] w-[100%] bg-gray-800 opacity-100  rounded-2xl"
                    onClick={() => setCategory(15)}
                  >
                    <div className="overflow-hidden relative h-[100%] w-[100%]">
                      <img
                        src="/Cardio.jpg"
                        className="transition ease-in h-full w-full rounded-2xl opacity-30 hover:opacity-70"
                      ></img>
                      <h1 className=" absolute text-red-100 w-full bottom-3 font-[Chillax] text-2xl ">
                        Cardio
                      </h1>
                    </div>
                  </button>
                </div>
              )}
              {bio?.Weight && (
                <div className="bg-[#565656] rounded-2xl w-[25%] h-[100%]  ml-7">
                  <button
                    className="h-[100%] w-[100%] bg-gray-800 opacity-100  rounded-2xl"
                    onClick={() => setCategory(16)}
                  >
                    <div className="overflow-hidden relative h-[100%] w-[100%]">
                      <img
                        src="/Weight.jpg"
                        className="transition ease-in h-full w-full rounded-2xl opacity-30 hover:opacity-70"
                      ></img>
                      <h1 className=" absolute text-red-100 w-full bottom-3 font-[Chillax] text-2xl ">
                        Weight Training
                      </h1>
                    </div>
                  </button>
                </div>
              )}
              {bio?.Yoga && (
                <div className="bg-[#565656] rounded-2xl w-[25%] h-[100%]  ml-7">
                  <button
                    className="h-[100%] w-[100%] bg-gray-800 opacity-100  rounded-2xl"
                    onClick={() => setCategory(17)}
                  >
                    <div className="overflow-hidden relative h-[100%] w-[100%]">
                      <img
                        src="/Yoga.jpg"
                        className="transition ease-in h-full w-full rounded-2xl opacity-30 hover:opacity-70"
                      ></img>
                      <h1 className=" absolute text-red-100 w-full bottom-3 font-[Chillax] text-2xl ">
                        Yoga
                      </h1>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
          {posts?.map((postObj, index) => (
            <Posts
              key={index}
              post={postObj}
              socialProtocol={socialProtocol}
              walletAddress={walletAddress}
              user={userInfo}
            />
          ))}
        </div>
        <button
          className="h-[100px] w-[100px] bg-[#A0D8EF] rounded-full sticky top-[86%] right-[8%] ml-5 flex justify-center items-center"
          onClick={() => {
            window.location.href = "./CreatePost";
          }}
        >
          <img src="/Add White.png" alt="Add Sign" className="h-1/2 w-1/2" />
        </button>
      </div>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
      />
    </div>
  );
}
