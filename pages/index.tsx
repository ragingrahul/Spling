
import { Inter, Solway } from '@next/font/google'
import { GiGymBag } from 'react-icons/gi'
import { AnchorProvider, Wallet } from '@project-serum/anchor'
import { SocialProtocol } from '@spling/social-protocol'
import { AnchorWallet, useAnchorWallet , useWallet} from '@solana/wallet-adapter-react'
import { clusterApiUrl, ConfirmOptions, Connection, Keypair, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { ProtocolOptions, User } from '@spling/social-protocol/dist/types'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Image from 'next/image'

declare global {
  interface Window {
     solana:any;
  }
}

const opts = {
  preFlightCommitment : "processed"
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
  const solWal = useWallet()
 
  const checkIfWalletConnected = async() => {
    try {
      const {solana} = window;
      if(solana){
        if(solana.isPhantom){
          console.log('Phantom Wallet Connected!')

          const response = await solana.connect({
            onlyIfTrusted: true
          })
          console.log('Connected to Public Key : ', response.publicKey.toString())
          setWalletAddress(response.publicKey.toString())
        }
      }else{
        console.log('Solana Object not found! Get a phantom Wallet!')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const connectWallet = async() => {
    const {solana} = window;
    const response = await solana.connect()
    console.log('Connected to Public Key : ', response.publicKey.toString())
    setWalletAddress(response.publicKey.toString())
  }

  const getProvider = () => {
    const connection = new Connection(network, 'processed')
    const provider = new AnchorProvider(connection, window.solana, opts)
    return provider;
 }  

  const Initialize = async() => {
    console.log(solWal)
      const provider = getProvider()
    
      const socialProtocol: SocialProtocol = await new SocialProtocol(solWal, null, options).init()
      setSocialProtocol(socialProtocol);
      const userInfo = await socialProtocol.getUserByPublicKey(provider.wallet.publicKey)
      console.log(userInfo)
  }

  const CreateUser = async() => {
    if(socialProtocol){
      const user: User = await socialProtocol.createUser( "Anoy",null,"God")
      console.log(user)
    }
  }

  const renderNotConnectedContainer = () => {
    return (<div className="bg-black h-screen flex justify-center items-center">
    <div className="flex flex-row">
      <Image src="/cycle.png" alt='bicep' className="w-1/3" width={100} height={100}/>
      <div className=" ml-4 w-2/3 ">
        <div className={`p-3 flex flex-col   rounded-xl h-60  w-full my-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500`}>
          <div className="flex relative flex-col w-full h-full text-white font-semibold">
            <div className='flex flex-row items-center'>
              <GiGymBag />
              <p className="ml-[3px]">Sling Gym</p>
            </div>
            {/* <button className="mt-[150px] justify-start border-white border-[1px] w-fit p-2 rounded-md" onClick={connectWallet}>
              Connect
            </button> */}
            <WalletMultiButton />
            <WalletDisconnectButton />

            <button className="mt-[150px] justify-start border-white border-[1px] w-fit p-2 rounded-md" onClick={Initialize}>
              Initialize
            </button>
            <button className="mt-[150px] justify-start border-white border-[1px] w-fit p-2 rounded-md" onClick={CreateUser}>
               Create User
            </button>
          </div>
        </div>
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

  useEffect(()=>{
    //checkIfWalletConnected()
  },[])

  return (
    <div>
      {(!walletAddress && renderNotConnectedContainer()) || renderConnectedContainer()}
    </div>
  )
}
