import React, { useEffect, useRef, useState } from 'react';
import { BiPlus } from 'react-icons/bi'
import { SocialProtocol, User, ProtocolOptions, FileData } from '@spling/social-protocol';
import { WalletContextState, useWallet } from '@solana/wallet-adapter-react';
import { Console } from 'console';

const options = {
    rpcUrl: 'https://rpc.helius.xyz/?api-key=07172e08-2375-4358-9ad1-522bd8871a8e',
    useIndexer: true,
} as ProtocolOptions

export default function CreatePost() {
    const [progression, setProgression] = useState<boolean>(true)
    const [image, setImage] = useState<File>()
    const [socialProtocol, setSocialProtocol] = useState<SocialProtocol>()
    const [walletAddress, setWalletAddress] = useState<WalletContextState>()
    const imageRef = useRef<HTMLInputElement>(null)
    const [category, setCategory] = useState<string>()
    const [userInfo, setUserInfo] = useState<User | null>()
    const [groupId, setGroupId] = useState<number>(15)
    const [exercise, setExercise] = useState<string>()
    const [current, setCurrent] = useState<string>()
    const [target, setTarget] = useState<string>()
    const solWal = useWallet()

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


    const ProgressionUI = () => {
        return (
            <div className='flex flex-col'>
                <div className='mt-6'>
                    <input value={exercise} type="text" placeholder='Current Exercise' className='w-[370px]  p-1 bg-slate-200 border-2 border-[#A0D8EF] rounded-xl focus:outline-none text-[#565656] '
                        onChange={(e) => {
                            if (e.target)
                                setExercise(e.target.value)
                        }} />
                </div>
                <div className='mt-3'>
                    <input value={current} type="number" placeholder='Current Reps/Set' className='w-[370px] my-3 p-1 bg-slate-200 border-2 border-[#A0D8EF] rounded-xl focus:outline-none text-[#565656] '
                        onChange={(e) => {
                            if (e.target)
                                setCurrent(e.target.value)
                        }} />
                </div>
                <div className='mt-3'>
                    <input value={target} type="number" placeholder='Target Reps/Set' className='w-[370px] my-3 p-1 bg-slate-200 border-2 border-[#A0D8EF] rounded-xl focus:outline-none text-[#565656] '
                        onChange={(e) => {
                            if (e.target)
                                setTarget(e.target.value)
                        }} />
                </div>

                <button className="text-2xl font-semibold mt-[40px] bg-[#A0D8EF] w-[180px] self-center p-1 rounded-3xl" onClick={CreatePostProgression}>
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
                    <input value={exercise} type="text" placeholder='Completed Exercise' className='w-[370px] my-3 p-1 bg-slate-200 border-2 border-[#A0D8EF] rounded-xl focus:outline-none text-[#565656] '
                        onChange={(e) => {
                            if (e.target)
                                setExercise(e.target.value)
                        }}
                    />
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
                <button className="text-2xl font-semibold mt-[20px] bg-[#A0D8EF] w-[180px] self-center p-1 rounded-3xl" onClick={CreatePostCompletion}>
                    Add
                </button>
                <p className='self-center mt-[10px] font-medium'>
                    Show the achievement
                </p>
            </div>

        )
    }
    const CreatePostProgression = async () => {
        //const post=await socialProtocol.createPost()
        if (!exercise || !current || !target)
            return console.error("Fill exercise/current/target")

        const text = {
            exercise,
            current,
            target
        }
        if (!category) {
            return console.error("Select a category")
        }
        if (category === "Cardio") {
            const post = await socialProtocol?.createPost(15, "Progression", JSON.stringify(text), null)
        }
        else if (category === "Weight") {
            const post = await socialProtocol?.createPost(16, "Progression", JSON.stringify(text), null)
        }
        else {
            const post = await socialProtocol?.createPost(17, "Progression", JSON.stringify(text), null)
        }

        console.log(groupId, exercise, current, target)
    }

    const CreatePostCompletion = async () => {
        console.log(image?.type)
        if (!category) {
            return console.error("Select a category")
        }
        if (!exercise)
            return console.error("Fill exercise")
        if (image) {
            if (image.size > 1000000)
                return console.error("Upload image less than 1MB")
            if (!image.type.includes("image"))
                return console.error("Upload an image")


            const profileImage = image;
            let base64Img = await convertBase64(profileImage)
            const FileDataValue = {
                base64: base64Img,
                size: image.size,
                type: image.type,
            };
            if (category === "Cardio") {
                const post = await socialProtocol?.createPost(15, "Completion", JSON.stringify({exercise}), FileDataValue as FileData, null)
            }
            else if (category === "Weight") {
                const post = await socialProtocol?.createPost(16, "Completion", JSON.stringify({exercise}), FileDataValue as FileData, null)
            }
            else {
                const post = await socialProtocol?.createPost(17, "Completion", JSON.stringify({exercise}), FileDataValue as FileData, null)
            }
        }
        window.location.href="./"
    }

    const onOptionChange = (e: any) => {
        setCategory(e.target.value);
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
                //await socialProtocol.deletePost()
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
                                <div className={`p-[3px] px-[20px] ${progression ? `bg-[#565656] text-slate-200` : `bg-[#A0D8EF]`} rounded-3xl font-semibold mx-[10px] border-2 border-[#A0D8EF] hover:cursor-pointer `} onClick={() => setProgression(true)}>Progression</div>
                                <div className={`p-[3px] px-[20px] ${!progression ? `bg-[#565656] text-slate-200` : `bg-[#A0D8EF]`} rounded-3xl font-semibold mx-[10px] border-2 border-[#A0D8EF] hover:cursor-pointer `} onClick={() => setProgression(false)}>Completion</div>
                            </div>
                            <div className='flex flex-row mt-4 font-[Chillax]'>
                                <div className="flex items-center mx-2">
                                    <input id="default-radio-1" type="radio" value="Cardio" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onClick={onOptionChange} />
                                    <label htmlFor="default-radio-1" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Cardio</label>
                                </div>
                                <div className="flex items-center mx-2">
                                    <input id="default-radio-2" type="radio" value="Weight" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onClick={onOptionChange} />
                                    <label htmlFor="default-radio-2" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Weight Training</label>
                                </div>
                                <div className="flex items-center mx-2">
                                    <input id="default-radio-3" type="radio" value="Yoga" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onClick={onOptionChange} />
                                    <label htmlFor="default-radio-3" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yoga</label>
                                </div>
                            </div>

                            {progression ? ProgressionUI() : CompletionUI()}
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}