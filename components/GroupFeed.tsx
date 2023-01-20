import { SocialProtocol } from "@spling/social-protocol"
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react"
import { ProtocolOptions, User } from "@spling/social-protocol"
import { useEffect, useState, useRef } from "react"
import { NextPage } from "next"
import { Test } from "./TestSet"
import { TypeOfExpression } from "typescript"
import Post from "./Post"

interface Props {
    socialProtocol: SocialProtocol | undefined;
    walletAddress: WalletContextState | undefined;
}

const GroupFeed: NextPage<Props> = (props: Props) => {
    const [userInfo, setUserInfo] = useState<User | null>()
    const [posts, setPosts] = useState<typeof Test>();

    const getTruncatedAddress = (address: string | undefined) => {
        if (!address) {
            return ''
        }
        return `${address.slice(0, 7)}...${address.slice(address.length - 7)}`
    }


    useEffect(() => {
        const initialize = async () => {
            setPosts(Test);
            if (props.walletAddress?.wallet?.adapter?.publicKey) {
                const user = await props.socialProtocol?.getUserByPublicKey(props.walletAddress?.wallet?.adapter?.publicKey)
                setUserInfo(user)
                console.log(user)
            }
        }
        initialize()
    }, [])

    return (
        <div className=' flex flex-col w-[960px]'>
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
                    
                    {userInfo?.avatar ?<img 
                        src={userInfo?.avatar}
                        alt="avatar"
                        className='rounded-full h-[80px] w-[80px] border-4 border-[#A0D8EF]'
                    />:
                    <img src='/ProfilePic.png' alt='ProfilePic' className='rounded-full h-[80px] w-[80px] border-4 border-[#A0D8EF]' />
                    }
                </div>
            </div>
            {posts?.map((postObj,index)=><Post key={index} post={postObj}/>)}
        </div>
    )
}

export default GroupFeed