import { Inter } from "@next/font/google";
import { MdOutlineAdd, MdOutlineDone } from "react-icons/md";
import { SocialProtocol } from "@spling/social-protocol";
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import { ConfirmOptions } from "@solana/web3.js";
import { useEffect, useRef, useState } from "react";
import {
  FileData,
  ProtocolOptions,
  User,
} from "@spling/social-protocol/dist/types";
import dynamic from "next/dynamic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

declare global {
  interface Window {
    solana: any;
  }
}

const options = {
  rpcUrl:
    "https://rpc.helius.xyz/?api-key=07172e08-2375-4358-9ad1-522bd8871a8e",
  useIndexer: true,
} as ProtocolOptions;

const inter = Inter({ subsets: ["latin"] });

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function Home() {
  const [socialProtocol, setSocialProtocol] = useState<SocialProtocol>();
  const [walletAddress, setWalletAddress] = useState<WalletContextState>();
  const [userInfo, setUserInfo] = useState<User | null>();
  const [cardio, setCardio] = useState<boolean>(false);
  const [weight, setWeight] = useState<boolean>(false);
  const [yoga, setYoga] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [avatar, setAvatar] = useState<File>();
  const [bio, setBio] = useState<any>();

  const avatarRef = useRef<HTMLInputElement>(null);

  const solWal = useWallet();

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

  const CreateUser = async () => {
    if (userName.length === 0) {
      return toast.warn("Enter Name to Continue");
    }

    if (socialProtocol) {
      if (avatar) {
        const profileImage = avatar;
        let base64Img = await convertBase64(profileImage);
        const FileDataValue = {
          base64: base64Img,
          size: avatar.size,
          type: avatar.type,
        };

        if (cardio || weight || yoga) {
          const bio = {
            Cardio: cardio,
            Weight: weight,
            Yoga: yoga,
          };
          const promise = async () => {
            const user: User = await socialProtocol.createUser(
              userName,
              FileDataValue as FileData,
              JSON.stringify(bio)
            );
            if(user){
              window.location.href = '/GroupFeed'
            }
            console.log(user);
          };
          toast.promise(promise(), {
            pending: "Creating Profile",
            success: "Profile Created",
            error: "Error Creating Profile",
          });
        } else {
          return toast.warn("Please select atleast one category to continue");
        }
      } else {
        return toast.warn("Upload Avatar to Continue");
      }
    }
  };

  const ConnectUI = () => {
    return (
      <>
        <h2 className="text-2xl mt-[180px]">Welcome to Spling Gym</h2>
        <WalletMultiButtonDynamic />
        <p className="mt-[10px] w-[220px] text-center">
          Connect your phantom wallet to continue
        </p>
      </>
    );
  };

  const CreateUserUI = () => {
    return (
      <>
        <h2 className="text-3xl mt-[40px] font-normal">
          It seems you are a newbie
        </h2>
        <input
          value={userName}
          type="text"
          placeholder="Name"
          className="rounded-2xl my-[20px] p-2 w-[300px] border-4 border-[#A0D8EF] focus:outline-none text-[#565656] bg-slate-200"
          onChange={(e) => {
            if (e.target) setUserName(e.target.value);
          }}
        />

        <div className="flex flex-row justify-around">
          <div
            onClick={() => {
              avatarRef?.current?.click();
            }}
            className="h-[140px] w-[140px] rounded-full hover:cursor-pointer"
          >
            {avatar ? (
              <img
                onClick={() => {
                  avatarRef?.current?.click();
                }}
                src={URL.createObjectURL(avatar)}
                alt="avatar"
                className="rounded-full h-[140px] w-[140px] border-4 border-[#A0D8EF]"
              />
            ) : (
              <img src="/ProfilePic.png" alt="ProfilePic" />
            )}
          </div>
          <input
            type="file"
            className="hidden"
            ref={avatarRef}
            onChange={(e) => {
              if (!e.target.files) return;
              setAvatar(e.target.files[0]);
              console.log(e.target.files[0].type);
            }}
          />

          <div className="flex flex-col justify-start">
            <div className="flex flex-row text-left mb-[10px]">
              <button
                className={`${
                  cardio ? `bg-[#A9EFA0]` : `bg-[#A0D8EF]`
                } rounded-full mx-[10px] px-10 py-1 font-normal hover:cursor-default`}
              >
                Cardio
              </button>
              {!cardio ? (
                <MdOutlineAdd
                  size={40}
                  color={"white"}
                  className="bg-[#A0D8EF] rounded-full hover:cursor-pointer"
                  onClick={() => setCardio(!cardio)}
                />
              ) : (
                <MdOutlineDone
                  size={40}
                  color={"white"}
                  className="bg-[#A9EFA0] rounded-full hover:cursor-pointer"
                  onClick={() => setCardio(!cardio)}
                />
              )}
            </div>
            <div className="flex flex-row text-left mb-[10px]">
              <button
                className={`${
                  weight ? `bg-[#A9EFA0]` : `bg-[#A0D8EF]`
                } rounded-full mx-[10px] px-10 py-1 font-normal hover:cursor-default`}
              >
                Weight Training
              </button>
              {!weight ? (
                <MdOutlineAdd
                  size={40}
                  color={"white"}
                  className="bg-[#A0D8EF] rounded-full hover:cursor-pointer"
                  onClick={() => setWeight(!weight)}
                />
              ) : (
                <MdOutlineDone
                  size={40}
                  color={"white"}
                  className="bg-[#A9EFA0] rounded-full hover:cursor-pointer"
                  onClick={() => setWeight(!weight)}
                />
              )}
            </div>
            <div className="flex flex-row text-left mb-[10px]">
              <button
                className={`${
                  yoga ? `bg-[#A9EFA0]` : `bg-[#A0D8EF]`
                } rounded-full mx-[10px] px-10 py-1 font-normal hover:cursor-default`}
              >
                Yoga
              </button>
              {!yoga ? (
                <MdOutlineAdd
                  size={40}
                  color={"white"}
                  className="bg-[#A0D8EF] rounded-full hover:cursor-pointer"
                  onClick={() => setYoga(!yoga)}
                />
              ) : (
                <MdOutlineDone
                  size={40}
                  color={"white"}
                  className="bg-[#A9EFA0] rounded-full hover:cursor-pointer"
                  onClick={() => setYoga(!yoga)}
                />
              )}
            </div>
          </div>
        </div>

        <button
          className="bg-[#A0D8EF] rounded-full mt-[30px] px-14 py-3 font-medium"
          onClick={CreateUser}
        >
          Become a member
        </button>
        <p className="mt-[10px] w-[280px] text-center">
          One time sign up to gain access to our fitness community
        </p>
      </>
    );
  };

  const UserProfile = () => {
    return (
      <div className="bg-[#747474] h-screen flex items-center justify-center">
        <div className="flex flex-row  text-[#565656] w-[1280px] h-[720px] rounded-[150px]">
          <img
            src="./IMG_0166.JPG"
            alt="running"
            className="w-1/2 rounded-l-[150px]"
          />
          <div className="flex flex-col items-center w-1/2 bg-slate-200 rounded-r-[150px]">
            <img src="./Logo.png" alt="Spling Gym" className="mt-[150px]" />
            <h1 className="m-5 text-2xl font-[Chillax]">User Profile</h1>
            {userInfo?.avatar && (
              <img
                src={userInfo?.avatar}
                className="h-[160px] w-[160px] rounded-full border-[#A0D8EF] border-4"
              />
            )}
            <h1 className="mx-5 mt-2 text-2xl font-[Chillax]">Welcome {userInfo?.nickname}</h1>
            <h1 className="mx-5 mt-1 text-2xl font-[Chillax]">Interests</h1>
            <div className="flex flex-row">
              {bio?.Cardio && (
                <div className="bg-[#A0D8EF] rounded-full p-2 m-2 text-l px-4 font-medium">
                  Cardio
                </div>
              )}
              {bio?.Weight && (
                <h1 className="bg-[#A0D8EF] rounded-full p-2 m-2 text-l px-4 font-medium">
                  Weight Training
                </h1>
              )}
              {bio?.Yoga && (
                <h1 className="bg-[#A0D8EF] rounded-full p-2 m-2 text-l px-4 font-medium">
                  Yoga
                </h1>
              )}
            </div>
            <button
              className="bg-[#A0D8EF] rounded-full mt-[30px] px-14 py-3 font-medium"
              onClick={() => (window.location.href = "/GroupFeed")}
            >
              Feed
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderNotConnectedContainer = () => {
    return (
      <div className="bg-[#747474] h-screen flex justify-center">
        {!userInfo ? (
          <div className="bg-[#747474] h-screen flex items-center justify-center">
            <div className="flex flex-row  text-[#565656] w-[1280px] h-[720px] rounded-[150px]">
              <img
                src="./IMG_0166.JPG"
                alt="running"
                className="w-1/2 rounded-l-[150px]"
              />
              <div className="flex flex-col items-center w-1/2 bg-slate-200 rounded-r-[150px]">
                <img src="./Logo.png" alt="Spling Gym" className="mt-[150px]" />
                {walletAddress?.wallet?.adapter?.publicKey ? (
                  !userInfo ? (
                    CreateUserUI()
                  ) : (
                    <div></div>
                  )
                ) : (
                  ConnectUI()
                )}
              </div>
            </div>
          </div>
        ) : (
          UserProfile()
        )}
      </div>
    );
  };

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

        const promise = async () => {
          if (walletAddress?.wallet?.adapter?.publicKey) {
            const user = await socialProtocol.getUserByPublicKey(
              walletAddress?.wallet?.adapter?.publicKey
            );
            setUserInfo(user);
            if (user?.bio) {
              let bios: any = JSON.parse(user?.bio);
              setBio(bios);
            }
          }
        };
        toast.promise(promise(), {
          pending: "Initializing",
          success: "Profile Initialized",
          error: "Error Initializing",
        });
      }
    };
    initialize();
  }, [solWal, walletAddress]);

  return (
    <div>
      <Head>
        <title>Spling Gym</title>
        <meta name="Spling Gym" content="Spling Gym" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {renderNotConnectedContainer()}
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
