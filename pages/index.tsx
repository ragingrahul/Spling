
import { Inter, } from '@next/font/google'
import { GiGymBag } from 'react-icons/gi'
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
  const [userInfo, setUserInfo] = useState()
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
    console.log(userInfo)
  }

  const CreateUser = async () => {
    if (socialProtocol) {
      const user: User = await socialProtocol.createUser("Anoy", null, "God")
      console.log(user)
    }
  }

  const renderNotConnectedContainer = () => {
    return (
      <div className="bg-[#747474] h-screen flex justify-center items-center">
        <div className="flex flex-row  text-[#565656] w-[1280px] h-[720px] rounded-[150px] bg-black">
          <img src="./IMG_0166.JPG" alt='running' className='w-1/2 rounded-l-[150px]'/>
          <div className='flex flex-col  items-center w-1/2 bg-slate-200 rounded-r-[150px]'>
            <img src='./Logo.png' alt='Spling Gym' className='mb-[180px] mt-[180px]' />
            <h2 className='text-2xl '>Welcome to Spling Gym</h2>
            <button className='bg-[#A0D8EF] rounded-full mt-[40px] px-10 py-1 font-medium'>
              Connect
            </button>
            <p className='mt-[10px] w-[220px] text-center'>
              Connect your phantom wallet to continue
            </p>
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
