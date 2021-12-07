// import { ApiCaller } from '@/js/api/api-caller'
import { ApiCaller, WalletsManager, Wallet } from '@tokend/js-sdk'
import ipfsApi from 'ipfs-http-client'

export const api = new ApiCaller()
export const walletsManager = new WalletsManager()
const wallet = new Wallet('', 'SAMJKTZVW5UOHCDK5INYJNORF2HRKYI72M5XSZCBYAHQHR34FFR4Z6G4', 'GBA4EX43M25UPV4WIE6RRMQOFTWXZZRIPFAI5VPY6Z2ZVVXVWZ6NEOOB')

export async function initApi () {
  api.useBaseURL('http://localhost:8000/_/api')

  const { data: networkDetails } = await api.getRaw('/')
  api.useNetworkDetails(networkDetails)
  api.useWallet(wallet)
  walletsManager.useApi(api)
}

const IPFS_HOST = 'ipfs.infura.io'
const IPFS_PORT = '5001'
const IPFS_PROTOCOL = 'https'
const TOKEN_URI_HOST = 'gateway.ipfs.io/ipfs/'

export const ipfs = ipfsApi({
  host: IPFS_HOST,
  port: IPFS_PORT,
  protocol: IPFS_PROTOCOL,
})

export const IPFS_URL = IPFS_PROTOCOL + '://' + TOKEN_URI_HOST
