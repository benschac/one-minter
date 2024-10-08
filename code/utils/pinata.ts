/**
 * Pin a file to Pinata
 *
 * {@link https://docs.pinata.cloud/api-pinning/pin-file-to-ipfs}
 *
 * @param file File to pin
 * @returns
 */
export async function pinFileWithPinata(file: File) {
  const data = new FormData()
  data.append('file', file)

  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
    },
    body: data,
  })

  const result = (await res.json()) as { IpfsHash: string }

  return `ipfs://${result.IpfsHash}`
}

export async function pinJsonWithPinata(json: object) {
  const data = JSON.stringify({
    pinataContent: json,
    pinataMetadata: {
      name: 'metadata.json',
    },
  })

  const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
    },
    body: data,
  })

  const result = (await res.json()) as { IpfsHash: string }

  return `ipfs://${result.IpfsHash}`
}
