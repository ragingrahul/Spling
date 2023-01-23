import React, { useState, useEffect, useRef } from "react";
import {
  SocialProtocol,
  Post,
  User,
  ProtocolOptions,
} from "@spling/social-protocol";
import { WalletContextState, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import Posts from "@/components/Post";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

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

export default function Dashboard() {
  const [socialProtocol, setSocialProtocol] = useState<SocialProtocol>();
  const [walletAddress, setWalletAddress] = useState<WalletContextState>();
  const [userInfo, setUserInfo] = useState<User | null>();
  const [posts, setPosts] = useState<Post[]>();
  const [bio, setBio] = useState<any>();
  const router = useRouter();

  const solWal = useWallet();

  useEffect(() => {
    setWalletAddress(solWal);

    const initialize = async () => {
      if (walletAddress?.wallet?.adapter?.publicKey) {
        const { id } = router.query;
        const socialProtocol: SocialProtocol = await new SocialProtocol(
          solWal,
          null,
          options
        ).init();
        setSocialProtocol(socialProtocol);

        const userInitialize = async () => {
          const user = await socialProtocol.getUser(Number(id));

          setUserInfo(user);
          if (walletAddress?.wallet?.adapter?.publicKey) {
          const mainUser = await socialProtocol.getUserByPublicKey(
            walletAddress?.wallet?.adapter?.publicKey
          );

          if (!mainUser) {
            window.location.href = "/";
          }
          }
          if (user) {
            setBio(JSON.parse(user?.bio));
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
            const filtered: Post[] = posted.filter((post) => {
              return post?.userId === Number(id);
            });
            setPosts(filtered);
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
        const filtered: Post[] = posted.filter((post) => {
          return post.userId === userInfo?.userId;
        });
        setPosts(filtered);
        console.log(filtered);
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
        <title>{userInfo?.nickname}&apos;s Profile</title>
      </Head>
      <div className="bg-[#747474] h-fit w-full flex justify-center">
        <div
          className="bg-slate-200 rounded-full h-24 w-24 -ml-10 mt-3 -mr-16 flex items-center justify-center hover:cursor-pointer"
          onClick={() => {
            window.location.href = "/GroupFeed";
          }}
        >
          <img src="/Delete Black.png" />
        </div>
        <div className=" flex flex-col w-[960px] h-fit ml-28">
          <div className="bg-slate-200 text-[#565656] flex flex-row rounded-b-3xl p-7">
            <div className="flex flex-col w-1/2">
            <img src="/Logo.png" alt="logo" className="w-[240px] hover:cursor-pointer" onClick={() => {window.location.href="/"}} />
              {userInfo && (
                <h2 className="text-2xl">
                  {userInfo?.nickname}&apos;s Profile
                </h2>
              )}
            </div>
            <div className="flex flex-row w-1/2 justify-end">
              <div className="flex flex-col items-end justify-around mr-[20px] px-[10px] pl-[80px] bg-[#A0D8EF] rounded-2xl">
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
              Category
            </h1>
            <div className="flex flex-row w-[100%] h-72">
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
            window.location.href = "/CreatePost";
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
