import { useEffect, useRef, useState } from 'react';
import {BiPlus} from 'react-icons/bi'
import { SocialProtocol,User,ProtocolOptions } from '@spling/social-protocol';
import { WalletContextState,useWallet } from '@solana/wallet-adapter-react';

const options = {
    rpcUrl: 'https://rpc.helius.xyz/?api-key=07172e08-2375-4358-9ad1-522bd8871a8e',
    useIndexer: true,
  } as ProtocolOptions

export default function CreatePost() {
    const [progression, setProgression] = useState<boolean>(true)
    const [image, setImage] = useState<File>()
    const [socialProtocol,setSocialProtocol]=useState<SocialProtocol>()
    const [walletAddress, setWalletAddress] = useState<WalletContextState>()
    const imageRef = useRef<HTMLInputElement>(null)
    const [userInfo, setUserInfo] = useState<User | null>()
    const solWal=useWallet()

    const ProgressionUI = () => {
        return (
            <div className='flex flex-col'>
                <div className='mt-8'>
                    <input type="number" placeholder='Current Exercise' className='w-[370px] my-3 p-1 bg-slate-200 border-2 border-[#A0D8EF] rounded-xl focus:outline-none text-[#565656] ' />
                </div>
                <div className='mt-3'>
                    <input type="number" placeholder='Current Reps/Set' className='w-[370px] my-3 p-1 bg-slate-200 border-2 border-[#A0D8EF] rounded-xl focus:outline-none text-[#565656] ' />
                </div>
                <div className='mt-3'>
                    <input type="number" placeholder='Target Reps/Set' className='w-[370px] my-3 p-1 bg-slate-200 border-2 border-[#A0D8EF] rounded-xl focus:outline-none text-[#565656] ' />
                </div>

                <button className="text-2xl font-semibold mt-[40px] bg-[#A0D8EF] w-[180px] self-center p-1 rounded-3xl">
                    Add
                </button>
                <p className='self-center mt-[10px] font-medium'>
                    Show them what you are made of!!
                </p>
            </div>
        )

    }

    const CompletionUI = () => {
        return (
            <div className='flex flex-col'>
                <div className='mt-8'>
                    <input type="text" placeholder='Completed Exercise' className='w-[370px] my-3 p-1 bg-slate-200 border-2 border-[#A0D8EF] rounded-xl focus:outline-none text-[#565656] ' />
                </div>
                <div
                    onClick={() => {
                        imageRef?.current?.click();
                    }}
                    className="border-2 w-[370px] border-gray-600  border-dashed rounded-md mt-2 p-2  h-36 justify-center items-center flex"
                >
                    {image ? (
                        <img
                            onClick={() => {
                                imageRef?.current?.click();
                            }}
                            src={URL.createObjectURL(image)}
                            alt="thumbnail"
                            className="h-full rounded-md"
                        />
                    ) : (
                        <BiPlus size={40} color="gray" className='flex self-center justify-center' />
                    )}
                </div>

                <input
                    type="file"
                    className="hidden"
                    ref={imageRef}
                    onChange={(e) => {
                        if (!e.target.files)
                            return
                        setImage(e.target.files[0]);
                    }}
                />
                <button className="text-2xl font-semibold mt-[20px] bg-[#A0D8EF] w-[180px] self-center p-1 rounded-3xl">
                    Add
                </button>
                <p className='self-center mt-[10px] font-medium'>
                    Show the achievement
                </p>
            </div>

        )
    }
    useEffect(() => {
        setWalletAddress(solWal);
    
        const initialize = async () => {
          if (walletAddress?.wallet?.adapter?.publicKey) {
            const socialProtocol: SocialProtocol = await new SocialProtocol(solWal, null, options).init()
            setSocialProtocol(socialProtocol)
    
            const user = await socialProtocol.getUserByPublicKey(walletAddress?.wallet?.adapter?.publicKey)
            setUserInfo(user)
            console.log(user)
            //const group: Group = await socialProtocol.createGroup("Yoga", "A group that contains posts related to Yoga",null);
            // console.log(group)
          }
        }
        initialize()
      }, [solWal, walletAddress])
    return (
        <div>
            <div className="bg-[#747474] h-screen flex justify-center">


                <div className="bg-[#747474] h-screen flex items-center justify-center">
                    <div className="flex flex-row  text-[#565656] w-[1280px] h-[720px] rounded-[150px]">
                        <img src="./IMG_0166.JPG" alt='running' className='w-1/2 rounded-l-[150px]' />
                        <div className='flex flex-col items-center w-1/2 bg-slate-200 rounded-r-[150px]'>
                            <img src='./Logo.png' alt='Spling Gym' className='mt-[120px]' />
                            <h1 className="mt-[20px] text-3xl">Add a Post</h1>
                            <h1 className="mt-[30px] text-lg font-semibold mb-[4px]">Select a type</h1>
                            <div className="flex flex-row">
                                <div className={`p-[3px] px-[20px] ${progression?`bg-[#565656] text-slate-200`:`bg-[#A0D8EF]`} rounded-3xl font-semibold mx-[10px] border-2 border-[#A0D8EF] hover:cursor-pointer `} onClick={() => setProgression(true)}>Progression</div>
                                <div className={`p-[3px] px-[20px] ${!progression?`bg-[#565656] text-slate-200`:`bg-[#A0D8EF]`} rounded-3xl font-semibold mx-[10px] border-2 border-[#A0D8EF] hover:cursor-pointer `} onClick={() => setProgression(false)}>Completion</div>
                            </div>
                            {progression ? ProgressionUI() : CompletionUI()}
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}