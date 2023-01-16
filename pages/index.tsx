
import { Inter } from '@next/font/google'
import { GiGymBag } from 'react-icons/gi'
import { AnchorProvider, Wallet } from '@project-serum/anchor'
import { SocialProtocol } from '@spling/social-protocol'
import { AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react'
import { clusterApiUrl, ConfirmOptions, Connection, Keypair, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { ProtocolOptions } from '@spling/social-protocol/dist/types'
declare global {
  interface Window {
     solana:any;
  }
}

const opts = {
  preFlightCommitment : "processed"
} as ConfirmOptions

const options = {
  rpcUrl: "https://api.devnet.solana.com",
  useIndexer: true,
} as ProtocolOptions

const inter = Inter({ subsets: ['latin'] })
const network = clusterApiUrl('devnet')

export default function Home() {
  const [walletAddress, setWalletAddress] = useState()
  const wallet: AnchorWallet | undefined = useAnchorWallet()
  const payerWallet: Keypair = Keypair.generate()


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
    console.log('Called')
      const provider = getProvider()

      const socialProtocol = await new SocialProtocol(provider.wallet as Wallet, null, options).init()
      const userInfo = await socialProtocol.getUserByPublicKey(provider.wallet.publicKey)
      console.log(userInfo)
  }

  const renderNotConnectedContainer = () => {
    return (<div className="bg-black h-screen flex justify-center items-center">
    <div className="flex flex-row">
      <img src="/cycle.png" alt='bicep' className="w-1/3" />
      <div className=" ml-4 w-2/3 ">
        <div className={`p-3 flex flex-col   rounded-xl h-60  w-full my-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500`}>
          <div className="flex relative flex-col w-full h-full text-white font-semibold">
            <div className='flex flex-row items-center'>
              <GiGymBag />
              <p className="ml-[3px]">Sling Gym</p>
            </div>
            <button className="mt-[150px] justify-start border-white border-[1px] w-fit p-2 rounded-md" onClick={connectWallet}>
              Connect
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>)
  }

  const renderConnectedContainer = () => {
    return <button className="mt-[150px] justify-start border-white border-[1px] w-fit p-2 rounded-md" onClick={Initialize}>
      Initialize
    </button>
  }

  useEffect(()=>{
    checkIfWalletConnected()
  },[])

  return (
    <div>
      {(!walletAddress && renderNotConnectedContainer()) || renderConnectedContainer()}
    </div>
  )
}
