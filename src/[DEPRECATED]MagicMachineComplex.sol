// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23; 

import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {ERC1155Holder} from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC165} from "@openzeppelin/contracts/interfaces/IERC165.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

///
/// @title Magic Machine
///
/// @notice Distributes random nfts (ERC-721 and/or ERC-1155) based on a vending machine
///         behaviour. Owner must deposit nfts and load the machine before distribution.
///
/// @author J. Valeska (https://github.com/jvaleskadevs/magicmachine).
/// 
contract MagicMachine is Ownable, ERC721Holder, ERC1155Holder {    
    /// @notice That amount of ether must be paid before every random distribution.
    ///
    /// @dev The `owner` may change that `price` with the `setPrice` function.
    uint256 public price = 0.000777 ether;

    /// @notice A wrapper struct for store nft data, address, ID and amounts for erc1155.
    struct NFT {
        /// @dev The contract address of the nft.
        address addr;
        /// @dev The tokenId of the nft.
        uint256 id;
        /// @dev The amount of that nft in the contract. Useful for erc1155 nfts.
        uint256 amount;
        /// @dev The amount of that nft in the machine. Useful for erc1155 nfts.
        uint256 amountInMachine;
    }
    
    /// @notice A mapping including all nfts deposited in the contract.
    mapping(uint256 => NFT) public nfts;
    /// @notice A mapping to track the mapping index of every nft address and id.
    mapping(address => mapping (uint256 => uint256)) public nftsToIdx;
    /// @notice The total count of nfts in the nfts mapping.
    uint256 public totalNfts;
    /// @notice The Index of the last item moved from the nfts mapping to the machine.
    uint256 public lastMappingIndex = 1;    
    /// @notice The list of items available for next random distribution aka the machine.
    uint256[69] public machine;
    /// @notice The total count of nfts loaded in the machine..
    uint256 public totalNftsMachine;
    
    /// @notice Thrown when calling `distributeRandomItem` with a wrong `price`.
    error Price();
    /// @notice Thrown on 'distributeRandomItem' when the machine is empty.
    error EmptyMachine();
    /// @notice Thrown on `deposit` and `withdraw` when the length of arrays is not the same.
    error ArraysMissmatch();
    /// @notice Thrown on 'withdraw' when the transfer call fails.
    error Withdrawal();
    /// @notice Thrown on 'withdraw' when the recipient is the Zero address.
    error ZeroAddress();
    
    /// @notice Emitted after successfully deposit or transfer an nft into the contract.
    event NewDeposit(address indexed nft, uint256 id);
    /// @notice Emitted after successfully distribution an nft from the machine.
    event NewDistribution(address indexed nft, uint indexed id, address indexed recipient, uint price);
    /// @notice Emitted after successfully withdraw an nft from the contract.
    event NewWithdrawal(address indexed nft, uint256 id);
    
    constructor() Ownable(msg.sender) {} /// TODO add initialOwner parameter

    /// @notice Deposits multiple NFTs into the Magic Machine contract.
    ///
    /// @dev Arrays must have the same length and every address index must match the ID index.
    ///      This function updates the nfts map.
    ///
    /// @param tokenAddresses     List of nfts addresses to be deposited.
    /// @param tokenIds           List of nfts IDs to be deposited.
    /// @param shouldLoadMachine  When `true`, calls the `loadMachine` function after deposit.
    function deposit(
        address[] calldata tokenAddresses, 
        uint256[] calldata tokenIds,
        bool shouldLoadMachine
    ) public onlyOwner {
        if (tokenAddresses.length != tokenIds.length) revert ArraysMissmatch();

        for (uint256 i = 0; i < tokenAddresses.length; i++) {
            address tokenAddress = tokenAddresses[i];
            uint256 tokenId = tokenIds[i];

            // Check whether the NFT is an ERC721 or an ERC1155, otherwise ignore it
            if (isERC1155(tokenAddress)) {
                uint256 nftIdx = nftsToIdx[tokenAddress][tokenId];
                // erc1155 supports semifungibility, checking current amount in contract
                if (nftIdx != 0) {
                    // the contract already holds that token, increasing the amount by 1
                    nfts[nftIdx].amount++;
                } else {
                    // new token in the contract, creating new entries in the mappings
                    nfts[++totalNfts] = NFT(tokenAddress, tokenId, 1, 0);
                    nftsToIdx[tokenAddress][tokenId] = totalNfts;               
                }
                // Transfer the NFT to the contract
                IERC1155(tokenAddress).safeTransferFrom(
                    msg.sender, 
                    address(this), 
                    tokenId, 
                    1, 
                    ""
                );
                // emit event after successful deposit
                emit NewDeposit(tokenAddress, tokenId);
            } else if (isERC721(tokenAddress)) {
                // new token in the contract, creating new entries in the mappings
                nfts[++totalNfts] = NFT(tokenAddress, tokenId, 1, 0);
                nftsToIdx[tokenAddress][tokenId] = totalNfts;
                // Transfer the NFT to the contract
                IERC721(tokenAddress).safeTransferFrom(msg.sender, address(this), tokenId);
                // emit event after successful deposit
                emit NewDeposit(tokenAddress, tokenId);
            }
        }
        
        if (shouldLoadMachine) {
            loadMachine();
        }
    }    

    /// @notice Load the Magic Machine with the nfts in the contract.
    ///
    /// @dev The machine has a total size of 69 slots. Empty slots contain the Zero value.
    function loadMachine() public onlyOwner {
        for (uint256 i = 0; i < 69; i++) {
            NFT storage nft = nfts[lastMappingIndex];
            if (machine[i] == 0 && nft.addr != address(0)) {
                machine[i] = lastMappingIndex;
                nft.amountInMachine++;
                if (nft.amountInMachine == nft.amount) {
                    lastMappingIndex++;    
                }
                totalNftsMachine++;
            }
        }
    }
    
    /*
    
            if (totalNftsMachine == 0) {
            // machine is empty
            for (uint256 i = 0; i < totalNfts; i++) {
                if (nfts[i].addr != address(0)) {
                    machine[totalNftsMachine] = i;
                    lastMappingIndex++; // (?) must reset before??
                    totalNftsMachine++;
                }
            }
        } else {
            // machine is not empty
            
    */
    
    /// @notice Prune or remove the selected indexes from the Magic Machine.
    ///
    /// @dev Useful after calling `emergencyRecovery` to clean failing transfers.
    ///
    /// @param machineIndexes  The list of indexes to remove from the machine array.
    function pruneMachine(uint256[] calldata machineIndexes) public onlyOwner {
        for (uint256 i = 0; i < machineIndexes.length; i++) {
            nfts[machine[machineIndexes[i]]].amountInMachine--;
            machine[machineIndexes[i]] = 0;
            totalNftsMachine--;
        }        
    }
    
    /// @notice Reset ALL indexes from the Magic Machine to the Zero value.
    ///
    /// @dev First, withdraw ALL nfts from the contract, then call this function.
    function resetMachine() public onlyOwner {
        totalNftsMachine = 0;    
        for (uint256 i = 0; i < 69; i++) {
            nfts[machine[i]].amountInMachine--;
            machine[i] = 0;
        }    
    }
    
    /// @notice Distributes a random item from the Magic Machine to the sender and 
    ///         reloads the machine with the next nft from the mapping.
    ///
    /// @dev When there is no more available nfts, the load will be safely ignored.
    function distributeRandomItem() public payable {
        if(msg.value != price) revert Price();
        if(totalNftsMachine == 0) revert EmptyMachine();
        
        uint256 randomIdx = _getRandomIndex();
        
        // Extract the nft from the random index
        NFT storage nft = nfts[machine[randomIdx]];
        
        if(nft.amount == 0 || nft.amountInMachine == 0) revert EmptyMachine(); /// TODO, new Error !!        
        nft.amount--;
        nft.amountInMachine--;
        if (nft.amount == 0) {
            //delete 
        }
        /*
        machine[randomIdx] = nfts[lastMappingIndex].addr != address(0)
            ? lastMappingIndex++ 
                : 0;       
        */
        // Load the machine with the next nft mapping index or zero 
        NFT storage nextNFT = nfts[lastMappingIndex];       
        if (nextNFT.addr != address(0)) {
            machine[randomIdx] = lastMappingIndex;
            nextNFT.amountInMachine++;
            if (nextNFT.amountInMachine == nextNFT.amount) {
                lastMappingIndex++;    
            }
        } else {
            machine[randomIdx] = 0;
            totalNftsMachine--;            
        }


        // Transfer the NFT from the contract to the new recipient
        if (isERC1155(nft.addr)) {
            // It is an erc155, distributing...
            IERC1155(nft.addr).safeTransferFrom(
                address(this), 
                msg.sender,
                nft.id, 
                1, 
                ""
            );
            
            // Transfer was a success, distribution completed!
            emit NewDistribution(nft.addr, nft.id, msg.sender, price);
        } else if (isERC721(nft.addr)) {
            // It is an erc721, distributing...
            IERC721(nft.addr).safeTransferFrom(address(this), msg.sender, nft.id);
            
            // Transfer was a success, distribution completed!
            emit NewDistribution(nft.addr, nft.id, msg.sender, price);
            
            delete nftsToIdx[nft.addr][nft.id];
        }
        
        /*
        // Transfer the NFT from the contract to the new recipient
        if (isERC1155(nft.addr)) {
            try IERC1155(nft.addr).safeTransferFrom(
                address(this), 
                msg.sender,
                nft.id, 
                1, 
                ""
            ) {
                // Transfer was a success, distribution completed!
                emit NewDistribution(nft.addr, nft.id, msg.sender, price);                
            } catch {
                // Error, call `pruneMachine` with the `machineIndex` from logs will solve it.
                revert MustPrune(randomIdx);
            }
        } else if (isERC721(nft.addr)) {
            try IERC721(nft.addr).safeTransferFrom(address(this), msg.sender, nft.id) {
                // Transfer was a success, distribution completed!
                emit NewDistribution(nft.addr, nft.id, msg.sender, price);                 
            } catch {
                // Error, call `pruneMachine` with the `machineIndex` from logs will solve it.
                revert MustPrune(randomIdx);
            }
        }
        */
    }
    
    function _getRandomIndex() internal view returns (uint256 randomIdx) {
        // Get a random index within the range of the machine length
        randomIdx = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender
                )
            )
        ) % totalNftsMachine;//machine.length;
        
        /*
        // If that position in the array is empty (0), add 1 until find non-zero value
        // the cost of that is lower than rerolling the randomization
        if (machine[randomIdx] == 0) {
            for (uint i = 0; i < 69; i++) {
                randomIdx = machine[i] == 0 ? ++randomIdx : i;
                if (machine[randomIdx] != 0) {
                    break;
                }
            }
        } 
        */      
    }
    
    /// @notice Sets the `price` that must be paid to call the `distributeRandomItem` function.
    /// 
    /// @param newPrice The amount of ether for setting as the `price`.
    function setPrice(uint256 newPrice) public onlyOwner {
        price = newPrice;
    }
    
    /// @notice Withdraw multiple NFTs, only for emergencies. Migration, locked nfts..
    // 
    /// @dev It cleans the nft from the machine but does not remove the nft from the nfts mapping,
    ///      the nft could be loaded into the machine and anyone could "win" it but the transaction
    ///      obv, will fail. Calling `pruneMachine` with the index from the error logs will solve it.
    function emergencyWithdraw(
        address[] calldata tokenAddresses, 
        uint256[] calldata tokenIds
    ) public onlyOwner {
        if (tokenAddresses.length != tokenIds.length) revert ArraysMissmatch();

        for (uint256 i = 0; i < tokenAddresses.length; i++) {
            address tokenAddress = tokenAddresses[i];
            uint256 tokenId = tokenIds[i];

            uint256 nftIdx = nftsToIdx[tokenAddress][tokenId];
            NFT storage nft = nfts[nftIdx];
            
            // Clean the nft from machine
            for (uint256 j = 0; j < 69; j++) {
                if (machine[j] == nftIdx) {
                    machine[j] = 0;
                    totalNftsMachine--;
                    //break;
                }
            }
/*
            for (uint256 j = 0; j < 69; j++) {
                NFT storage currentNft = nfts[machine[j]];
                if (currentNft.addr == tokenAddress && currentNft.id == tokenId && machine[j] != 0) {
                    currentNft.state = State.Empty;
                    machine[j] = 0;
                    totalNftsMachine--;
                }
            }
*/
            // Transfer the NFT from the contract
            if (isERC1155(tokenAddress)) {
                IERC1155(tokenAddress).safeTransferFrom(
                    address(this), 
                    msg.sender,
                    tokenId, 
                    nft.amount, 
                    ""
                );
                // Clean the nft from nfts mapping
                delete nfts[nftIdx];
                // Clean the nft from `nftsToIdx` mapping
                delete nftsToIdx[tokenAddress][tokenId];
            } else if (isERC721(tokenAddress)) {
                IERC721(tokenAddress).safeTransferFrom(address(this), msg.sender, tokenId);
                // Clean the nft from nfts mapping
                delete nfts[nftIdx];
                // Clean the nft from `nftsToIdx` mapping
                delete nftsToIdx[tokenAddress][tokenId];
            } else {
                IERC20 i20 = IERC20(tokenAddress);
                i20.transferFrom(address(this), msg.sender, i20.balanceOf(address(this)));
            }
            
            emit NewWithdrawal(tokenAddress, tokenId);
        }
    }
    
    /// @notice Withdraw all the ether from the contract. 
    ///
    /// @param to The address of the recipient.
    function withdraw(address to) public onlyOwner {
        if (to == address(0)) revert ZeroAddress();
        (bool success, ) = payable(to).call{value: address(this).balance}(""); 
        if (!success) revert Withdrawal();
    }
    
    // view functions
    
    /// @notice Checks if the token is an ERC1155
    ///
    /// @param tokenAddress The address of the token to check
    ///
    /// @return `True` when the token is an ERC1155, `False` otherwise
    function isERC1155(address tokenAddress) public view returns (bool) {
        // Check if ERC1155 interface is supported
        if (IERC165(tokenAddress).supportsInterface(type(IERC1155).interfaceId)) {
            return true;
        }
        return false;
    }
    
    /// @notice Checks if the token is an ERC721
    ///
    /// @param tokenAddress The address of the token to check
    ///
    /// @return `True` when the token is an ERC721, `False` otherwise
    function isERC721(address tokenAddress) public view returns (bool) {
        // Check if ERC721 interface is supported
        if (IERC165(tokenAddress).supportsInterface(type(IERC721).interfaceId)) {
            return true;
        }
        return false;
    }    

    /// @dev See {IERC721Receiver-onERC721Received}.
    ///      Always returns `IERC721Receiver.onERC721Received.selector`.
    function onERC721Received(
        address /*operator*/, 
        address /*from*/, 
        uint256 /*tokenId*/, 
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }
    
    /// @dev See {IERCReceiver-onERC721Received}.
    /// @dev See {IERC165-supportsInterface}.
    ///      Always returns `IERC721Receiver.onERC721Received.selector`.
    function onERC1155Received(
        address /*operator*/,
        address /*from*/,
        uint256 /*id*/,
        uint256 /*value*/,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155Received.selector;
    }
/*    
    /// @dev See {IERC721Receiver-onERC721Received}.
    ///      Always returns `IERC721Receiver.onERC721Received.selector`.
    function onERC721Received(
        address operator, 
        address from, 
        uint256 tokenId, 
        bytes memory
    ) public virtual override returns (bytes4) {
        if (from != owner()) revert OwnableUnauthorizedAccount(from);
        nfts[totalNfts++] = NFT(operator, tokenId);
        emit NewDeposit(operator, tokenId);
        return this.onERC721Received.selector;
    }
    
    /// @dev See {IERC165-supportsInterface}.
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes memory
    ) public virtual override returns (bytes4) {
        if (from != owner()) revert OwnableUnauthorizedAccount(from);
        for (uint i = 0; i < value; i++) {
            nfts[totalNfts++] = NFT(operator, id);
        }
        emit NewDeposit(operator, id);
        return this.onERC1155Received.selector;
    }
    */
/* no tested, probably useless, uncomment in case of find one
    /// @dev See {IERC165-supportsInterface}.
    function onERC1155BatchReceived(
        address operator,
        address,
        uint256[] memory ids,
        uint256[] memory values,
        bytes memory
    ) public virtual override returns (bytes4) {
        for (uint i = 0; i < ids.length; i++) {
            for (uint j = 0; j < values[i]; j++) {
                nfts[totalNfts++] = NFT(operator, ids[i]);
            }
        }
        return this.onERC1155BatchReceived.selector;
    }
*/
} // 0x585077dEa6FBcDEbAA0D405756B7D3645b00e977
