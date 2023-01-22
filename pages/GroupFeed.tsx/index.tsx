import React, { useState, useEffect, useRef } from 'react'
import { SocialProtocol, Post, User, ProtocolOptions } from '@spling/social-protocol'
import { WalletContextState, useWallet } from '@solana/wallet-adapter-react'

import Posts from '@/components/Post'

const getTruncatedAddress = (address: string | undefined) => {
    if (!address) {
        return ''
    }
    return `${address.slice(0, 7)}...${address.slice(address.length - 7)}`
}

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
    rpcUrl: 'https://rpc.helius.xyz/?api-key=07172e08-2375-4358-9ad1-522bd8871a8e',
    useIndexer: true,
} as ProtocolOptions

export default function GroupFeed() {
    const [socialProtocol, setSocialProtocol] = useState<SocialProtocol>()
    const [walletAddress, setWalletAddress] = useState<WalletContextState>()
    const [userInfo, setUserInfo] = useState<User | null>()
    const [posts, setPosts] = useState<Post[]>();
    const [imgAdd, setImgAddress] = useState<string>()
    const [images, setImages] = useState<File>()

    const solWal = useWallet()

    useEffect(() => {
        setWalletAddress(solWal);

        const initialize = async () => {
            if (walletAddress?.wallet?.adapter?.publicKey) {
                const socialProtocol: SocialProtocol = await new SocialProtocol(solWal, null, options).init()
                setSocialProtocol(socialProtocol)

                const user = await socialProtocol.getUserByPublicKey(walletAddress?.wallet?.adapter?.publicKey)
                setUserInfo(user)
                console.log(user)
                if (socialProtocol !== null && socialProtocol !== undefined) {
                    const posted: Post[] = await socialProtocol.getAllPosts(16)
                    setPosts(posted)
                    console.log(posted)
                    

                }
            }
        }
        initialize()
    }, [solWal, walletAddress])

    return (
        <div className='div className="bg-[#747474] h-screen flex justify-center'>
            <div className="bg-[#747474] h-fit w-full flex justify-center">
                <div className=' flex flex-col w-[960px] h-fit ml-28'>
                    <div className='bg-slate-200 text-[#565656] flex flex-row rounded-b-3xl p-7'>
                        <div className="flex flex-col w-1/2">
                            <img src="/Logo.png" alt="logo" className="w-[240px]" />
                            <h2 className="text-2xl">Feed</h2>
                        </div>
                        <div className="flex flex-row w-1/2 justify-end">
                            <div className="flex flex-col items-end justify-around mr-[20px] px-[10px] pl-[80px] bg-[#A0D8EF] rounded-2xl">
                                <h2 className="text-xl">{userInfo?.nickname}</h2>
                                <h2 className="tracking-wider">{getTruncatedAddress(userInfo?.publicKey?.toString())}</h2>
                            </div>

                            {userInfo?.avatar ? <img
                                src={userInfo?.avatar}
                                alt="avatar"
                                className='rounded-full h-[80px] w-[80px] border-4 border-[#A0D8EF]'
                            /> :
                                <img src='/ProfilePic.png' alt='ProfilePic' className='rounded-full h-[80px] w-[80px] border-4 border-[#A0D8EF]' />
                            }
                        </div>
                    </div>
                    {posts?.map((postObj, index) => <Posts key={index} post={postObj} socialProtocol={socialProtocol} walletAddress={walletAddress} user={userInfo} />)}
                </div>
                <button className="h-[100px] w-[100px] bg-[#A0D8EF] rounded-full sticky top-[86%] right-[8%] ml-5 flex justify-center items-center" onClick={() => { window.location.href = './CreatePost' }}>
                    <img src='/Add White.png' alt='Add Sign' className="h-1/2 w-1/2" />
                </button>
            </div>
        </div>
    )

}