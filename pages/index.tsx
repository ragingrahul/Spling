
import { Inter, } from '@next/font/google'
import {MdOutlineAdd,MdOutlineDone} from 'react-icons/md'
import { AnchorProvider, Wallet } from '@project-serum/anchor'
import { SocialProtocol } from '@spling/social-protocol'
import { AnchorWallet, useAnchorWallet, useWallet } from '@solana/wallet-adapter-react'
import { clusterApiUrl, ConfirmOptions, Connection, Keypair, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { ProtocolOptions, User } from '@spling/social-protocol/dist/types'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Image from 'next/image'

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

export default function Home() {
  const [socialProtocol, setSocialProtocol] = useState<SocialProtocol>()
  const [walletAddress, setWalletAddress] = useState()
  const [userInfo, setUserInfo] = useState<User | null>()
  const [loading, setLoading] = useState<boolean>(false)
  const [cardio,setCardio]=useState<boolean>(false)
  const [weight,setWeight]=useState<boolean>(false)
  const [yoga,setYoga]=useState<boolean>(false)

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

  const connectWallet = async () => {
    const { solana } = window;
    const response = await solana.connect()
    console.log('Connected to Public Key : ', response.publicKey.toString())
    setWalletAddress(response.publicKey.toString())
    if (response) {
      const provider = getProvider()
      const socialProtocol: SocialProtocol = await new SocialProtocol(provider.wallet as Wallet, null, options).init()
      setSocialProtocol(socialProtocol);
      const userInfo = await socialProtocol.getUserByPublicKey(provider.wallet.publicKey)
      console.log(userInfo)
    }
  }

  const getProvider = () => {
    const connection = new Connection(network, 'processed')
    const provider = new AnchorProvider(connection, window.solana, opts)
    return provider;
  }

  const Initialize = async () => {
    console.log(solWal)
    const provider = getProvider()

    const socialProtocol: SocialProtocol = await new SocialProtocol(provider.wallet as Wallet, null, options).init()
    setSocialProtocol(socialProtocol);
    const userInfo = await socialProtocol.getUserByPublicKey(provider.wallet.publicKey)
    setUserInfo(userInfo)
    console.log(userInfo)
  }

  const CreateUser = async () => {
    if (socialProtocol) {
      const user: User = await socialProtocol.createUser("Anoy", null, "God")
      console.log(user)
    }
  }
  const ConnectUI = () => {
    return (
      <>
        <h2 className='text-2xl mt-[180px]'>Welcome to Spling Gym</h2>
        <button className='bg-[#A0D8EF] rounded-full mt-[40px] px-10 py-1 font-medium' onClick={connectWallet}>
          Connect
        </button>
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
        <input type='text' placeholder="Name" className='rounded-2xl my-[20px] p-2 w-[300px] border-4 border-[#A0D8EF]' />
        <div className='flex flex-row text-left mb-[10px]'>
          <button className={`${cardio?`bg-[#A9EFA0]`:`bg-[#A0D8EF]`} rounded-full mx-[10px] px-10 py-1 font-normal hover:cursor-default`}>
            Cardio
          </button>
          {!cardio?
            <MdOutlineAdd size={40} color={"white"}className='bg-[#A0D8EF] rounded-full' onClick={()=>setCardio(!cardio)}/>
            :
            <MdOutlineDone size={40} color={"white"}className='bg-[#A9EFA0] rounded-full' onClick={()=>setCardio(!cardio)}/>
          }
          
        </div>
        <div className='flex flex-row text-left mb-[10px]'>
          <button className={`${weight?`bg-[#A9EFA0]`:`bg-[#A0D8EF]`} rounded-full mx-[10px] px-10 py-1 font-normal hover:cursor-default`}>
            Weight Training
          </button>
          {!weight?
            <MdOutlineAdd size={40} color={"white"}className='bg-[#A0D8EF] rounded-full' onClick={()=>setWeight(!weight)}/>
            :
            <MdOutlineDone size={40} color={"white"}className='bg-[#A9EFA0] rounded-full' onClick={()=>setWeight(!weight)}/>
          }
        </div>
        <div className='flex flex-row text-left mb-[10px]'>
          <button className={`${yoga?`bg-[#A9EFA0]`:`bg-[#A0D8EF]`} rounded-full mx-[10px] px-10 py-1 font-normal hover:cursor-default`}>
            Yoga
          </button>
          {!yoga?
            <MdOutlineAdd size={40} color={"white"}className='bg-[#A0D8EF] rounded-full' onClick={()=>setYoga(!yoga)}/>
            :
            <MdOutlineDone size={40} color={"white"}className='bg-[#A9EFA0] rounded-full' onClick={()=>setYoga(!yoga)}/>
          }
        </div>
        <button className='bg-[#A0D8EF] rounded-full mt-[30px] px-14 py-3 font-medium' onClick={connectWallet}>
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
            {walletAddress ? (!userInfo ? CreateUserUI() : <div></div>) : ConnectUI()}
          </div>
        </div>
      </div>)
  }

  const renderConnectedContainer = () => {
    return (
      <div>
        <button className="mt-[150px] justify-start border-white border-[1px] w-fit p-2 rounded-md" onClick={Initialize}>
          Initialize
        </button>
        <button className="mt-[150px] justify-start border-white border-[1px] w-fit p-2 rounded-md" onClick={CreateUser}>
          Create User
        </button>
      </div>
    );
  }

  useEffect(() => {
    //checkIfWalletConnected()
  }, [])

  return (
    <div>
      {renderNotConnectedContainer()}
    </div>
  )
}
