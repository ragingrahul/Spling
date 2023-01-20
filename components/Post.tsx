import { NextPage } from "next"


interface Props {
    post:{} | undefined
}

const Post: NextPage<Props> = (props: Props) => {
    
    return (<div className="w-[107.5%] rounded-2xl self-end mt-7 flex justify-between">
            <img src='/ProfilePic.png' alt='ProfilePic' className='rounded-full h-[60px] w-[60px] border-4 border-[#A0D8EF]' />
            <div className="bg-slate-200 text-[#565656] flex flex-row rounded-2xl p-7 w-[92.9%]">
        </div>
    </div>)
}

export default Post