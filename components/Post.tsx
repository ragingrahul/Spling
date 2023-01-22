import { NextPage } from "next"
import { Post, SocialProtocol, Reply,User } from "@spling/social-protocol"
import { WalletContextState } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import Replies from "./Replies"
import { toast } from 'react-toastify';


interface Props {
    post:Post | undefined,
    socialProtocol:SocialProtocol|undefined,
    walletAddress:WalletContextState|undefined,
    user: User | null | undefined
}

const Posts: NextPage<Props> = (props: Props) => {
    const [text, setText] = useState<any>();
    const [current, setCurrent] = useState<any>();
    const [target, setTarget] = useState<any>();
    const [replies, setReplies] = useState<Reply[]>();
    const [like, setLike] = useState(false);
    const [type, setType] = useState("Progression")
    const [toggleReply, setToggleReply] = useState(false);
    const [rep, setRep] = useState<string>('')

    useEffect(() => {
      const InitializePost = async () => {
        if (props?.post?.text && props?.post?.postId && props?.post?.title) {
            console.log(props?.post?.text)
          let test: any = JSON.parse(props?.post?.text);
          const replies: Reply[] | undefined =
            await props?.socialProtocol?.getAllPostReplies(props?.post?.postId);
          setReplies(replies);
          setText(test.exercise);
          setCurrent(test.current);
          setTarget(test.target);
          setType(props?.post?.title);
          if (props?.post.likes) {
            const check = props?.post.likes.find((userId) => {
              return userId == props?.user?.userId;
            });
            setLike(check ? true : false);
          }
        }
      };
      InitializePost();
    }, [props?.post?.likes, props?.user?.userId]);

    const AddLike = async() => {
        const likeInitialize = async() => {
            if(props?.post){
                await props.socialProtocol?.likePost(props?.post?.publicKey)
            }
            setLike(!like)
        }
            
        toast.promise(likeInitialize(), {
            pending: "processing, Transaction pending",
            success: !like ? "Liked a post" : "Unliked a post",
            error: !like ? "Error liking the post" : "Error Unliking the post" ,
          });
    }

    const ReplySection = () =>  {
        return <div className="bg-[#adbabf] h-fit rounded-b-xl -z-2 -mt-10 ">
            <div className="flex mt-14 ml-5 items-center mb-6">
                   {props?.user?.avatar ? <img
                        src={props?.user?.avatar}
                        alt="avatar"
                        className='rounded-full h-[70px] w-[70px] border-4 border-[#A0D8EF] hover:cursor-pointer' onClick={() => window.location.href=`./Dashboard/${props?.user?.userId}`}
                    /> :
                        <img src='/ProfilePic.png' alt='ProfilePic' className='rounded-full h-[70px] w-[70px] border-4 border-[#A0D8EF] hover:cursor-pointer' onClick={() => window.location.href=`./Dashboard/${props?.user?.userId}`}/>
                    }
                <input
                    value={rep}
                    type='text'
                    placeholder="Type a comment"
                    className='rounded-2xl p-2 w-[70%] mx-5 border-4 border-[#A0D8EF] focus:outline-none text-[#565656] bg-slate-200'
                    onChange={(e) => {
                    if (e.target)
                    setRep(e.target.value)
                    }}
                />
                <button className="bg-[#A0D8EF] rounded-xl h-[47px] w-[10%] border-[#A0D8EF] border-4 flex justify-center items-center" onClick={SendReply}>
                    <img src='/Add Black.png' alt='Add' className="h-1/2 " />
                </button>
            </div>
            {replies && replies.map((reply:Reply,index:number) => <Replies key={index} reply={reply}/>)}
        </div>
    }

    const SendReply = async() => {
        if(!(rep.length > 0)){
            return toast.warn('Write a comment first')
        }

        const replyInitialize = async () => {
          if (props?.post?.postId && rep.length > 0) {
            const createdReply: Reply | undefined =
              await props?.socialProtocol?.createPostReply(
                props?.post?.postId,
                rep
              );
            if (replies && createdReply) {
              const newReplies: Reply[] = [...replies, createdReply];
              setReplies(newReplies);
            }
            setRep("");
          }
        };

        toast.promise(replyInitialize(), {
            pending: "processing, Transaction pending",
            success: "Replied to a post",
            error: "Error adding reply",
          });
    }

    const percBar = () => {
        return(<div className='bg-[#A0D8EF] h-10 rounded-xl' style={{width:`${Math.ceil(current/target >= 1 ? 100 : current/target * 100)}%`}}></div>)
    }
    return (
    <div className="w-[120%] rounded-2xl self-end mt-7 flex justify-between">
        <div className="flex flex-col w-48 items-end">
        {props?.post?.user?.avatar ? <img
            src={props?.post?.user?.avatar}
            alt="avatar"
            className='rounded-full h-[70px] w-[70px] border-4 border-[#A0D8EF] hover:cursor-pointer mr-6' onClick={() => window.location.href=`./Dashboard/${props?.post?.userId}`}
        /> :
            <img src='/ProfilePic.png' alt='ProfilePic' className='rounded-full h-[70px] w-[70px] border-4 mr-6 border-[#A0D8EF] hover:cursor-pointer' onClick={() => window.location.href=`./Dashboard/${props?.post?.userId}`}/>
        }
        <div className="flex flex-end h-fit w-fit mt-5 mr-6 relative">
            <div className="bg-[#A0D8EF] p-3 rounded-full text-center text-[#565656] ">{props?.post?.groupId === 15 ? "Cardio" : props?.post?.groupId === 16 ? "Weight Training" : "Yoga"}</div>
        </div>
        </div>
        <div className="flex flex-col w-[83.5%]">
        <div className="bg-slate-200 text-[#565656] flex flex-row rounded-2xl p-7 w-[100%] self-end z-2 relative">
            {(type == "Progression" &&
            <div className="flex flex-col w-[90%]">
                <h1 className="bg-slate-200 font-[Chillax] text-6xl w-[60%]">{text}</h1>
                <div className="mt-[30px] flex">
                    <div className="bg-[#565656] h-10 w-[85%] rounded-xl flex ">
                        {Math.ceil(current / target * 100) !==0 && percBar()}
                    </div>
                    <h1 className="text-4xl align-middle ml-2 font-[Chillax]">{Math.ceil(current / target * 100)}%</h1>
                </div>
                <button className="text-[#565656] mt-[15px] text-left" onClick={()=>setToggleReply(!toggleReply)}>See Comments({replies?.length})</button>
            </div>
            ) || <div className="flex flex-col w-[90%]">
                <h1 className="bg-slate-200 font-[Chillax] text-6xl w-[60%]">Congratulations {props?.post?.user?.nickname}</h1>
                    <div className="bg-[#565656] h-[50] w-[50%] rounded-2xl mt-[30px]">
                        {props?.post?.media[0]?.file && <img src={props?.post?.media[0].file} alt='avatar' className="h-max w-max rounded-xl" />}
                    </div>
                    <h1 className="bg-slate-200 font-[Chillax] text-6xl w-[100%] mt-3">for completing {text} exercise !!</h1>
                <button className="text-[#565656] mt-[15px] text-left" onClick={()=>setToggleReply(!toggleReply)}>See Comments({replies?.length})</button>
        </div>}
            <div className="flex flex-col w-[10%] items-center">
                <div className="h-[55px] w-[55px] block" onClick={AddLike}>
                    {(!like && <img src = '/Biceps-Inactive.png' alt='Unlike' className=" bg-cover hover:cursor-pointer"/>) ||
                    <img src = '/Biceps-active.png' alt='like' className="bg-cover hover:cursor-pointer"/>}
                </div>
            </div>
            </div>
            {toggleReply && 
            ReplySection()}
        </div>
    </div>)
}

export default Posts