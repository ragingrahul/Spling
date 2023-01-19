
import { Inter, Solway, } from '@next/font/google'
import { MdOutlineAdd, MdOutlineDone } from 'react-icons/md'
import { AnchorProvider, Wallet } from '@project-serum/anchor'
import { SocialProtocol } from '@spling/social-protocol'
import { AnchorWallet, useAnchorWallet, useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import { clusterApiUrl, ConfirmOptions, Connection, Keypair, PublicKey } from '@solana/web3.js'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { FileData, Group, ProtocolOptions, User } from '@spling/social-protocol/dist/types'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Image from 'next/image'
import dynamic from 'next/dynamic'

declare global {
  interface Window {
    solana: any;
  }
}



const opts = {
  preFlightCommitment: "processed"
} as ConfirmOptions

const options = {
  rpcUrl: 'https://rpc.helius.xyz/?api-key=07172e08-2375-4358-9ad1-522bd8871a8e',
  useIndexer: true,
} as ProtocolOptions

const inter = Inter({ subsets: ['latin'] })
const network = "https://rpc.helius.xyz/?api-key=07172e08-2375-4358-9ad1-522bd8871a8e"

const WalletMultiButtonDynamic = dynamic(
  async()=>(await import ('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  {ssr:false}
)

export default function Home() {
  const [socialProtocol, setSocialProtocol] = useState<SocialProtocol>()
  const [walletAddress, setWalletAddress] = useState<WalletContextState>()
  const [userInfo, setUserInfo] = useState<User | null>()
  const [loading, setLoading] = useState<boolean>(false)
  const [cardio, setCardio] = useState<boolean>(false)
  const [weight, setWeight] = useState<boolean>(false)
  const [yoga, setYoga] = useState<boolean>(false)
  const [userName,setUserName]=useState<string>('')
  const [avatar,setAvatar] = useState<File>()

  const avatarRef=useRef<HTMLInputElement>(null)

  const solWal = useWallet()

  const checkIfWalletConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom Wallet Connected!')

          const response = await solana.connect({
            onlyIfTrusted: true
          })
          console.log('Connected to Public Key : ', response.publicKey.toString())
          setWalletAddress(response.publicKey.toString())
        }
      } else {
        console.log('Solana Object not found! Get a phantom Wallet!')
      }
    } catch (error) {
      console.error(error)
    }
  }


  const CreateUser = async () => {
    if(userName.length === 0){
      return console.error('Enter Name to Continue');
    }

    

    if (socialProtocol) {
      if(avatar){
        const profileImage = avatar;
        let base64Img = await convertBase64(profileImage)
        const FileDataValue = {
          base64: base64Img ,
          size: avatar.size,
          type: avatar.type,
        };

        if(cardio || weight || yoga){
          const bio = {
            Cardio : cardio,
            Weight : weight,
            Yoga : yoga
          }
          const user: User = await socialProtocol.createUser(userName, FileDataValue as FileData, JSON.stringify(bio))
          // const user: User = await socialProtocol.createUser("Anoy", null, "God")
          console.log(user)
        }
        else{
          return console.error('Please select atleast one category to continue');
        }
        
      }else{
        return console.error('Upload avatar to Continue');
      }
      
    }
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

  const ConnectUI = () => {
    return (
      <>
        <h2 className='text-2xl mt-[180px]'>Welcome to Spling Gym</h2>
        {/* <button className='bg-[#A0D8EF] rounded-full mt-[40px] px-10 py-1 font-medium' onClick={connectWallet}>
          Connect
        </button> */}
        <WalletMultiButtonDynamic />
        <p className='mt-[10px] w-[220px] text-center'>
          Connect your phantom wallet to continue
        </p>
      </>
    )
  }

  const CreateUserUI = () => {
    return (
      <>
        <h2 className='text-3xl mt-[40px] font-normal'>It seems you are a newbie</h2>
        <input 
          value={userName} 
          type='text' 
          placeholder="Name" 
          className='rounded-2xl my-[20px] p-2 w-[300px] border-4 border-[#A0D8EF] focus:outline-none text-[#565656] bg-slate-200' 
          onChange={(e)=>{
            if(e.target)
            setUserName(e.target.value)
          }}
        />

        <div className='flex flex-row justify-around'>
          <div 
            onClick={()=>{
              avatarRef?.current?.click()
            }}
            className='h-[140px] w-[140px] rounded-full hover:cursor-pointer'
          >
            {avatar ? (
              <img 
                onClick={()=>{
                  avatarRef?.current?.click()
                }}
                src={URL.createObjectURL(avatar)}
                alt='avatar'
                className='rounded-full h-[140px] w-[140px] border-4 border-[#A0D8EF]'
              />
            ):(
              <img src='/ProfilePic.png' alt='ProfilePic'/>
            )}
          </div>
          <input 
            type="file"
            className="hidden"
            ref={avatarRef}
            onChange={(e)=>{
              if(!e.target.files)
                return
              setAvatar(e.target.files[0])
              console.log(e.target.files[0].type)
            }}
          />
         
          <div className='flex flex-col justify-start'>
            <div className='flex flex-row text-left mb-[10px]'>
              <button className={`${cardio ? `bg-[#A9EFA0]` : `bg-[#A0D8EF]`} rounded-full mx-[10px] px-10 py-1 font-normal hover:cursor-default`}>
                Cardio
              </button>
              {!cardio ?
                <MdOutlineAdd size={40} color={"white"} className='bg-[#A0D8EF] rounded-full hover:cursor-pointer' onClick={() => setCardio(!cardio)} />
                :
                <MdOutlineDone size={40} color={"white"} className='bg-[#A9EFA0] rounded-full hover:cursor-pointer' onClick={() => setCardio(!cardio)} />
              }

            </div>
            <div className='flex flex-row text-left mb-[10px]'>
              <button className={`${weight ? `bg-[#A9EFA0]` : `bg-[#A0D8EF]`} rounded-full mx-[10px] px-10 py-1 font-normal hover:cursor-default`}>
                Weight Training
              </button>
              {!weight ?
                <MdOutlineAdd size={40} color={"white"} className='bg-[#A0D8EF] rounded-full hover:cursor-pointer' onClick={() => setWeight(!weight)} />
                :
                <MdOutlineDone size={40} color={"white"} className='bg-[#A9EFA0] rounded-full hover:cursor-pointer' onClick={() => setWeight(!weight)} />
              }
            </div>
            <div className='flex flex-row text-left mb-[10px]'>
              <button className={`${yoga ? `bg-[#A9EFA0]` : `bg-[#A0D8EF]`} rounded-full mx-[10px] px-10 py-1 font-normal hover:cursor-default`}>
                Yoga
              </button>
              {!yoga ?
                <MdOutlineAdd size={40} color={"white"} className='bg-[#A0D8EF] rounded-full hover:cursor-pointer' onClick={() => setYoga(!yoga)} />
                :
                <MdOutlineDone size={40} color={"white"} className='bg-[#A9EFA0] rounded-full hover:cursor-pointer' onClick={() => setYoga(!yoga)} />
              }
            </div>
          </div>
        </div>


        <button className='bg-[#A0D8EF] rounded-full mt-[30px] px-14 py-3 font-medium' onClick={CreateUser}>
          Become a member
        </button>
        <p className='mt-[10px] w-[280px] text-center'>
          One time sign up to gain access to our fitness community
        </p>
      </>
    )
  }

  const renderNotConnectedContainer = () => {
    return (
      <div className="bg-[#747474] h-screen flex justify-center items-center">
        <div className="flex flex-row  text-[#565656] w-[1280px] h-[720px] rounded-[150px]">
          <img src="./IMG_0166.JPG" alt='running' className='w-1/2 rounded-l-[150px]' />
          <div className='flex flex-col items-center w-1/2 bg-slate-200 rounded-r-[150px]'>
            <img src='./Logo.png' alt='Spling Gym' className='mt-[150px]' />
            {walletAddress?.wallet?.adapter?.publicKey ? (!userInfo ? CreateUserUI() : <div></div>) : ConnectUI()}
          </div>
        </div>
      </div>)
  }

  const renderConnectedContainer = () => {

  }

  useEffect(() => {
    setWalletAddress(solWal);
  }, [solWal,walletAddress])

  return (
    <div>
      {renderNotConnectedContainer()}
    </div>
  )
}
