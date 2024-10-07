import { create } from 'zustand'
import { zoraSepolia } from 'viem/chains'
import {
  http,
  createPublicClient,
  type Address,
  type Chain,
  type SimulateContractReturnType,
  type PublicClient as ViemPublicClient,
} from 'viem'
import {
  type CollectorClient,
  createCollectorClient,
} from '@zoralabs/protocol-sdk'

/**
 * from @zoralabs/protocol-sdk, not exported
 */
type GenericTokenIdTypes = number | bigint | string
const minterAccount = '0xCb8454D64AFeB46455cB4847C53279F6cdCbFb5e'
const tokenContract = '0x1234567890123456789012345678901234567890'
const mintToAddress = '0x71907e8Ae7aeFb58ceC8eb46DAf4fc78c29E5173'
const tokenId = 1n
const quantityToMint = 1
const publicClient = createPublicClient({
  // this will determine which chain to interact with
  chain: zoraSepolia,
  transport: http(),
})
type PublicClient = typeof publicClient

/**
 * Interface representing the Zora store state and actions
 */
interface ZoraStore {
  /** The collector client instance for interacting with the Zora protocol */
  collectorClient: CollectorClient
  /** The public client instance for interacting with the blockchain */
  setCollectorClient: () => void
  /** The public client instance for interacting with the blockchain */
  // TODO: instantiate public client type is different than type coming from viem
  publicClient: PublicClient
  /** Function to set the public client configuration */
  setPublicClientConfig: () => void
  /** The quantity of tokens to mint */
  quantityToMint: number
  /** Function to set the quantity of tokens to mint */
  setQuantityToMint: (quantity: number) => void
  /** The address of the account minting the tokens */
  minterAccount: Address
  /** Function to set the minter account address */
  setMinterAccount: (account: Address) => void
  /** The address to which the minted tokens will be sent */
  mintToAddress: Address
  /** Function to set the address to which the minted tokens will be sent */
  setMintToAddress: (address: Address) => void
  /** The ID of the token to be minted */
  tokenId: GenericTokenIdTypes
  /** Function to set the token ID */
  setTokenId: (tokenId: GenericTokenIdTypes) => void
  /** The blockchain chain object */
  chain: Chain
  /** Function to set the blockchain chain */
  setChain: (chain: Chain) => void
  /** Function to mint tokens */
  mint: () => Promise<SimulateContractReturnType>
  /** The contract address of the token to be minted */
  tokenContract: Address
  /** Function to set the contract address of the token to be minted */
  setTokenContract: (contract: Address) => void
}

const collectorClient = createCollectorClient({
  chainId: zoraSepolia.id,
  // @ts-expect-error copy pasta from zora docs: https://docs.zora.co/protocol-sdk/introduction
  publicClient,
})

export const createZoraStore = create<ZoraStore>((set, get) => ({
  quantityToMint,
  setQuantityToMint: (quantityToMint: number) => {
    set({ quantityToMint })
  },
  publicClient,
  setPublicClientConfig: () => {
    const chain = get().chain
    set({
      publicClient: createPublicClient({
        chain,
        transport: http(),
      }) as PublicClient,
    })
  },
  collectorClient,
  setCollectorClient: () => {
    const { chain, publicClient } = get()
    set({
      collectorClient: createCollectorClient({
        chainId: chain.id,
        // TODO: look into type issues to avoid casting
        publicClient: publicClient as ViemPublicClient,
      }),
    })
  },
  minterAccount,
  setMinterAccount: (account: Address) => {
    set({ minterAccount: account })
  },
  mintToAddress,
  setMintToAddress: (address: Address) => {
    set({ mintToAddress: address })
  },
  tokenId,
  setTokenId: (tokenId: GenericTokenIdTypes) => {
    set({ tokenId })
  },
  chain: zoraSepolia,
  setChain: (chain: Chain) => {
    set({ chain })
    get().setPublicClientConfig()
  },
  tokenContract,
  setTokenContract: (contract: Address) => {
    set({ tokenContract: contract })
  },
  mint: async (): Promise<SimulateContractReturnType> => {
    const {
      tokenContract,
      tokenId,
      minterAccount,
      mintToAddress,
      quantityToMint,
    } = get()
    const { parameters } = await get().collectorClient.mint({
      // hard coding to 1155 for now
      mintType: '1155',
      tokenContract,
      tokenId,
      mintRecipient: mintToAddress,
      quantityToMint,
      minterAccount,
    })
    const { result, request } = await get().publicClient.simulateContract(
      parameters
    )
    return { result, request }
  },
}))
