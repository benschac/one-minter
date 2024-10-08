import { http, createWalletClient, type Chain } from 'viem'

export const walletClient = (chain: Chain) =>
  createWalletClient({
    chain: chain,
    transport: http(),
  })
