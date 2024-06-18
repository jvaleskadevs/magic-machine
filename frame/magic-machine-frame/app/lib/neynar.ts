export async function getUserByFID(fid: number): Promise<any> {
  const options = {
    method: 'GET',
    headers: {accept: 'application/json', api_key: process.env.NEYNAR_API_KEY ?? 'NEYNAR_ONCHAIN_KIT'}
  }
  const endpoint = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}&viewer_fid=3`;
  
  const response = await fetch(endpoint, options);
  const result = await response.json();
  console.log(result?.users?.[0]);
  
  return result?.users?.[0] ?? undefined;
}

export async function getHandleByFID(fid: number): Promise<string | undefined> {
  const options = {
    method: 'GET',
    headers: {accept: 'application/json', api_key: process.env.NEYNAR_API_KEY ?? 'NEYNAR_ONCHAIN_KIT'}
  }
  const endpoint = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}&viewer_fid=3`;
  
  const response = await fetch(endpoint, options);
  const result = await response.json();
  console.log(result?.users?.[0]);
  
  return result?.users?.[0]?.username ?? undefined;
}
