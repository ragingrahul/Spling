import { NextPage } from "next"
import { Post, SocialProtocol, Reply,User } from "@spling/social-protocol"
import { WalletContextState } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"

interface Props {
    post:Post | undefined,
    socialProtocol:SocialProtocol|undefined,
    walletAddress:WalletContextState|undefined,
}
type PostText={
    exercise:string,
    current:number,
    target:number,
}

const Posts: NextPage<Props> = (props: Props) => {
    const [text, setText] = useState<any>();
    const [userInfo, setUserInfo] =useState<User | null>()
    const [current, setCurrent] = useState<any>();
    const [target, setTarget] = useState<any>();
    const [replies, setReplies] = useState<any>();
    const [like, setLike] = useState(false);
    const [type, setType] = useState("Progression")
    useEffect(()=>{
        const InitializePost = async() => {
        if(props?.walletAddress?.publicKey){
            const user=await props.socialProtocol?.getUserByPublicKey(props?.walletAddress?.publicKey)
            setUserInfo(user)
        }
            
        if(props?.post?.text && props?.post?.postId && props?.post?.title){
            //let test: any = JSON.parse(props?.post?.text)
            const replies: Reply[] | undefined = await props?.socialProtocol?.getAllPostReplies(props?.post?.postId)
            setReplies(replies);
            console.log(props?.post)
            const customObject=JSON.parse(JSON.stringify(props?.post?.text))
            setText(customObject.exercise);
            setCurrent(customObject.current);
            setTarget(customObject.target);
            setType(props?.post?.title)
            const check=props?.post.likes.find((userId)=>{return userId==userInfo?.userId;})
            console.log(check)
            if(check){
                setLike(false)
            }else{
                //console.log(check)
                setLike(true)
            }
                
        }
        
        }
        InitializePost();
    },[like])

    const AddLike = async() => {
        if(props?.post){
            await props.socialProtocol?.likePost(props?.post?.publicKey)
            
        }
            
        setLike(!like)
    }
    return (
    <div className="w-[110%] rounded-2xl self-end mt-7 flex justify-between">
        <img src='/ProfilePic.png' alt='ProfilePic' className='rounded-full h-[70px] w-[70px] border-4 border-[#A0D8EF]' />
        <div className="bg-slate-200 text-[#565656] flex flex-row rounded-2xl p-7 w-[91%]">
            {(type == "Progression" &&
            <div className="flex flex-col w-[90%]">
                <h1 className="bg-slate-200 font-[Chillax] text-6xl w-[60%]">{text}</h1>
                <div className="mt-[30px] flex">
                    <div className="bg-[#565656] h-10 w-[85%] rounded-xl ">
                        <div className={`bg-[#A0D8EF] h-[100%] w-[${current / target * 100}%] rounded-xl`}></div>
                    </div>
                    <h1 className="text-4xl align-middle ml-2 font-[Chillax]">{Math.ceil(current / target * 100)}%</h1>
                </div>
                <h1 className="text-[#565656] mt-[15px]">See Comments({replies?.length})</h1>
            </div>
            ) || <div className="flex flex-col w-[90%]">
                <h1 className="bg-slate-200 font-[Chillax] text-6xl w-[60%]">{text}</h1>
                    <div className="bg-[#565656] h-[100%] w-[95%] rounded-2xl mt-[30px]">
                        {props?.post?.media[0].file && <img src={props?.post?.media[0].file} alt='avatar' className="h-[100%] w-[100%] rounded-xl" />}
                    </div>
                <h1 className="text-[#565656] mt-[15px]">See Comments({replies?.length})</h1>
        </div>}
            <div className="flex flex-col w-[10%] items-center">
                <div className="h-[55px] w-[55px] block" onClick={AddLike}>
                    {(like && <img src = '/Biceps-Inactive.png' alt='Unlike' className=" bg-cover"/>) ||
                    <img src = '/Biceps-active.png' alt='like' className="bg-cover"/>}
                </div>
            </div>
        </div>
    </div>)
}

export default Posts