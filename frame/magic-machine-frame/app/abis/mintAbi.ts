import { Abi } from 'viem';
export const machineAbi: Abi = [{"type":"constructor","inputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"deposit","inputs":[{"name":"tokenAddresses","type":"address[]","internalType":"address[]"},{"name":"tokenIds","type":"uint256[]","internalType":"uint256[]"},{"name":"shouldLoadMachine","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"distributeRandomItem","inputs":[],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"emergencyWithdraw","inputs":[{"name":"tokenAddresses","type":"address[]","internalType":"address[]"},{"name":"tokenIds","type":"uint256[]","internalType":"uint256[]"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"isERC1155","inputs":[{"name":"tokenAddress","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"isERC721","inputs":[{"name":"tokenAddress","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"lastMappingIndex","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"loadMachine","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"machine","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"nfts","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"addr","type":"address","internalType":"address"},{"name":"id","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"onERC1155BatchReceived","inputs":[{"name":"","type":"address","internalType":"address"},{"name":"","type":"address","internalType":"address"},{"name":"","type":"uint256[]","internalType":"uint256[]"},{"name":"","type":"uint256[]","internalType":"uint256[]"},{"name":"","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"","type":"bytes4","internalType":"bytes4"}],"stateMutability":"nonpayable"},{"type":"function","name":"onERC1155Received","inputs":[{"name":"operator","type":"address","internalType":"address"},{"name":"from","type":"address","internalType":"address"},{"name":"id","type":"uint256","internalType":"uint256"},{"name":"value","type":"uint256","internalType":"uint256"},{"name":"","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"","type":"bytes4","internalType":"bytes4"}],"stateMutability":"nonpayable"},{"type":"function","name":"onERC721Received","inputs":[{"name":"operator","type":"address","internalType":"address"},{"name":"from","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"},{"name":"","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"","type":"bytes4","internalType":"bytes4"}],"stateMutability":"nonpayable"},{"type":"function","name":"owner","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"price","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"pruneMachine","inputs":[{"name":"machineIndexes","type":"uint256[]","internalType":"uint256[]"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"renounceOwnership","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"resetMachine","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setPrice","inputs":[{"name":"newPrice","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"supportsInterface","inputs":[{"name":"interfaceId","type":"bytes4","internalType":"bytes4"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"totalNfts","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"transferOwnership","inputs":[{"name":"newOwner","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"withdraw","inputs":[{"name":"to","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"event","name":"NewDeposit","inputs":[{"name":"nft","type":"address","indexed":true,"internalType":"address"},{"name":"id","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"NewDistribution","inputs":[{"name":"nft","type":"address","indexed":true,"internalType":"address"},{"name":"id","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"recipient","type":"address","indexed":true,"internalType":"address"},{"name":"price","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"NewWithdrawal","inputs":[{"name":"nft","type":"address","indexed":true,"internalType":"address"},{"name":"id","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"OwnershipTransferred","inputs":[{"name":"previousOwner","type":"address","indexed":true,"internalType":"address"},{"name":"newOwner","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"error","name":"ArraysMissmatch","inputs":[]},{"type":"error","name":"EmptyMachine","inputs":[]},{"type":"error","name":"MustPrune","inputs":[{"name":"machineIndex","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"OwnableInvalidOwner","inputs":[{"name":"owner","type":"address","internalType":"address"}]},{"type":"error","name":"OwnableUnauthorizedAccount","inputs":[{"name":"account","type":"address","internalType":"address"}]},{"type":"error","name":"Price","inputs":[]},{"type":"error","name":"Withdrawal","inputs":[]},{"type":"error","name":"ZeroAddress","inputs":[]}] as const;
