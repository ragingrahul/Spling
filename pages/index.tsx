
import { Inter } from '@next/font/google'
import { GiGymBag } from 'react-icons/gi'
import { Wallet } from '@project-serum/anchor'
import { SocialProtocol } from '@spling/social-protocol'
import { AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react'
import { Keypair, PublicKey } from '@solana/web3.js'
import { useEffect } from 'react'
import { ProtocolOptions } from '@spling/social-protocol/dist/types'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const wallet: AnchorWallet | undefined = useAnchorWallet()
  const payerWallet: Keypair = Keypair.generate()



  useEffect(() => {
    ; (async () => {
      if (wallet?.publicKey) {
        const options = {
          rpcUrl: "https://api.devnet.solana.com",
          useIndexer: true,
        } as ProtocolOptions

        const socialProtocol = await new SocialProtocol(wallet as Wallet, null, options).init()

        const userInfo = await socialProtocol.getUserByPublicKey(wallet.publicKey)
        
        console.log(wallet.publicKey)
      }
    })()
  },[wallet?.publicKey])
  return (
    <div className="bg-black h-screen flex justify-center items-center">
      <div className="flex flex-row">
        <img src="/cycle.png" alt='bicep' className="w-1/3" />
        <div className=" ml-4 w-2/3 ">
          <div className={`p-3 flex flex-col   rounded-xl h-60  w-full my-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500`}>
            <div className="flex relative flex-col w-full h-full text-white font-semibold">
              <div className='flex flex-row items-center'>
                <GiGymBag />
                <p className="ml-[3px]">Sling Gym</p>
              </div>

              <button className="mt-[150px] justify-start border-white border-[1px] w-fit p-2 rounded-md">
                Connect
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
