import { SocialProtocol } from "@spling/social-protocol"
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react"
import { ProtocolOptions, User,Post } from "@spling/social-protocol"
import { useEffect, useState, useRef } from "react"
import { FileData } from "@spling/social-protocol"

import { NextPage } from "next"
import { Test } from "./TestSet"
import { TypeOfExpression } from "typescript"
import Posts from "./Post"


const post1 = { exercise: "Running" }



interface Props {
    socialProtocol: SocialProtocol | undefined;
    walletAddress: WalletContextState | undefined;
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
const GroupFeed: NextPage<Props> = (props: Props) => {
    const [userInfo, setUserInfo] = useState<User | null>()
    const [posts, setPosts] = useState<typeof Test>();
    const [imgAdd,setImgAddress]=useState<string>()
    const [images, setImages] = useState<File>()

    const getTruncatedAddress = (address: string | undefined) => {
        if (!address) {
            return ''
        }
        return `${address.slice(0, 7)}...${address.slice(address.length - 7)}`
    }

    const createPost = async () => {
        if (images) {
            const profileImage = images
            let base64Img = await convertBase64(profileImage)
            const FileDataValue = {
                base64: base64Img,
                size: images.size,
                type: images.type,

            };
            const post = await props.socialProtocol?.createPost(15, "Completion", JSON.stringify(post1), FileDataValue as FileData)
        }

    }
    useEffect(() => {
        const initialize = async () => {
            setPosts(Test);
            if (props.walletAddress?.wallet?.adapter?.publicKey) {
                const user = await props.socialProtocol?.getUserByPublicKey(props.walletAddress?.wallet?.adapter?.publicKey)
                setUserInfo(user)
                console.log(user)
                const group = await props.socialProtocol?.getGroup(15)
                console.log(group)
                if (props.socialProtocol !== null && props.socialProtocol!== undefined) {
                    const posted:Post[] = await props.socialProtocol.getAllPosts(15)
                    console.log(posted)
                    
                    
                     if(posted.length>1){
                        if(posted[1].media[0].file)
                            setImgAddress(posted[1].media[0].file)
                          //console.log(posted[1].publicKey)
                          //await props.socialProtocol?.deletePost(posted[1].publicKey)
                     }
                    
                }

                //let base64Img = await convertBase64(profileImage)
                // const FileDataValue = {
                //     base64: base64Img,
                //     size: image.size,
                //     type: image.type,
                // };

                //const post=await props.socialProtocol?.createPost(15,"Completion",JSON.stringify(post1),null)
                //console.log(post)
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
                    {/* {<input
                        type="file"
                        onChange={(e) => {
                            if (!e.target.files)
                                return
                            setImages(e.target.files[0])
                            console.log(e.target.files[0].type)
                        }} 
                    />
                    <button onClick={createPost}>post</button>} */}
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
            {posts?.map((postObj, index) => <Posts key={index} post={postObj} socialProtocol={props.socialProtocol} walletAddress={props.walletAddress} />)}
        </div>
    )
}

export default GroupFeed