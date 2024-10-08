import { makeMediaTokenMetadata } from '@zoralabs/protocol-sdk'
import { pinFileWithPinata, pinJsonWithPinata } from './pinata'

type MakeImageTokenMetadataProps = {
  imageFile: File
  thumbnailFile: File
}

export type ContractMetadataJson = {
  name?: string
  description?: string
  image?: string
}

export type TokenMetadataJson = {
  name: string
  description?: string
  /** Primary image file */
  image?: string
  animation_url?: string | null
  content?: {
    mime: string
    uri: string
  } | null
  attributes?: {
    trait_type: string
    value: string
  }
}
/**
 * Copy Paste from Zora Docs
 * {@link https://docs.zora.co/protocol-sdk/metadata/token-metadata#building-token-metadata-using-sdk-helper-methods}
 *
 * Make a token metadata json for a media file and pin it to Pinata
 *
 * @param props
 * @returns
 */
export async function makeImageTokenMetadata({
  imageFile,
  thumbnailFile,
}: MakeImageTokenMetadataProps) {
  // upload image and thumbnail to Pinata
  const mediaFileIpfsUrl = await pinFileWithPinata(imageFile)
  const thumbnailFileIpfsUrl = await pinFileWithPinata(thumbnailFile)

  // build token metadata json from the text and thumbnail file
  // ipfs urls
  const metadataJson = makeMediaTokenMetadata({
    mediaUrl: mediaFileIpfsUrl,
    thumbnailUrl: thumbnailFileIpfsUrl,
    name: imageFile.name,
  })
  // upload token metadata json to Pinata and get ipfs uri
  const jsonMetadataUri = await pinJsonWithPinata(metadataJson)

  return jsonMetadataUri
}

type MakeContractMetadataProps = {
  imageFile: File
  name: string
  description?: string
}

/**
 * Make a contract metadata json and pin it to Pinata
 * Copy Paste from Zora Docs
 * {@link https://docs.zora.co/protocol-sdk/metadata/contract-metadata#building-contract-metadata}
 * @param props
 * @returns
 */
export async function makeContractMetadata({
  imageFile,
  name,
  description,
}: MakeContractMetadataProps) {
  // upload image to Pinata
  const imageFileIpfsUrl = await pinFileWithPinata(imageFile)

  // build contract metadata json
  const metadataJson: ContractMetadataJson = {
    description,
    image: imageFileIpfsUrl,
    name,
  }

  // upload token metadata json to Pinata and get ipfs uri
  const contractMetadataJsonUri = await pinJsonWithPinata(metadataJson)

  return contractMetadataJsonUri
}
