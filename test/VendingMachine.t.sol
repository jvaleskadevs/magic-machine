// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {NFT} from "../src/utils/NFT.sol";
import {NFT1155} from "../src/utils/NFT1155.sol";
import {MagicMachine} from "../src/MagicMachine.sol";
import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {ERC1155Holder} from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract MagicMachineTest is Test, ERC721Holder, ERC1155Holder {
    MagicMachine public mm;
    NFT public nft;
    NFT public nft1;
    NFT public nft2;
    
    NFT1155 public nft3;

    function setUp() public {
        mm = new MagicMachine();
        
        nft = new NFT(address(this));
        nft.safeMint(address(this), "");
        nft.safeMint(address(this), "");
        nft.safeMint(address(this), "");
        
        nft1 = new NFT(address(this));
        nft1.safeMint(address(this), "");
        nft1.safeMint(address(this), "");
        nft1.safeMint(address(this), "");
        
        nft2 = new NFT(address(this));
        nft2.safeMint(address(this), "");
        
        nft2.safeMint(address(this), "");
        nft2.safeMint(address(this), "");
        
        nft3 = new NFT1155(address(this));
        nft3.mint(address(this), 0, 1, "");
    }

    function test_DepositDistribute() public {
        address[] memory addresses = new address[](8);
        uint256[] memory tokenIds = new uint256[](8);
        
        addresses[0] = address(nft);
        addresses[1] = address(nft);
        addresses[2] = address(nft);
        addresses[3] = address(nft1);
        addresses[4] = address(nft1);
        addresses[5] = address(nft1);
        addresses[6] = address(nft2);
        
        addresses[7] = address(nft3);
        
        tokenIds[0] = uint(0);
        tokenIds[1] = uint(1);
        tokenIds[2] = uint(2);
        tokenIds[3] = uint(0);
        tokenIds[4] = uint(1);
        tokenIds[5] = uint(2);
        tokenIds[6] = uint(0);
        
        tokenIds[7] = uint(0);
    
        nft.approve(address(mm), 0);
        nft.approve(address(mm), 1);
        nft.approve(address(mm), 2);
        nft1.approve(address(mm), 0);
        nft1.approve(address(mm), 1);
        nft1.approve(address(mm), 2);
        nft2.approve(address(mm), 0);
        
        nft3.setApprovalForAll(address(mm), true);
        
        mm.deposit(addresses, tokenIds, true);
        assertEq(mm.totalNfts(), 8);
        
        //mm.loadMachine(true);
        assertEq(mm.machine(1), 1);
        
        mm.distributeRandomItem{value: 0.01 ether}();
        
        assertEq(mm.lastMappingIndex(), 8);
        
        mm.withdraw(address(0x420));
        assertEq(address(0x420).balance, 0.01 ether);
    }
    
    function test_DepositDistributeDepositReloadTrue() public {
        address[] memory addresses = new address[](8);
        uint256[] memory tokenIds = new uint256[](8);
        
        addresses[0] = address(nft);
        addresses[1] = address(nft);
        addresses[2] = address(nft);
        addresses[3] = address(nft1);
        addresses[4] = address(nft1);
        addresses[5] = address(nft1);
        addresses[6] = address(nft2);
        
        addresses[7] = address(nft3);
        
        tokenIds[0] = uint(0);
        tokenIds[1] = uint(1);
        tokenIds[2] = uint(2);
        tokenIds[3] = uint(0);
        tokenIds[4] = uint(1);
        tokenIds[5] = uint(2);
        tokenIds[6] = uint(0);
        
        tokenIds[7] = uint(0);
    
        nft.approve(address(mm), 0);
        nft.approve(address(mm), 1);
        nft.approve(address(mm), 2);
        nft1.approve(address(mm), 0);
        nft1.approve(address(mm), 1);
        nft1.approve(address(mm), 2);
        nft2.approve(address(mm), 0);
        
        nft3.setApprovalForAll(address(mm), true);
        
        
        mm.deposit(addresses, tokenIds, true);
        assertEq(mm.totalNfts(), 8);
        
        //mm.loadMachine(true);
        assertEq(mm.machine(1), 1);
        
        mm.distributeRandomItem{value: 0.01 ether}();
        
        ////////////////////////////////////
        
        address[] memory addresses1 = new address[](2);
        uint256[] memory tokenIds1 = new uint256[](2);
        addresses1[0] = address(nft2);
        addresses1[1] = address(nft2);        
        tokenIds1[0] = uint(1);
        tokenIds1[1] = uint(2);
        nft2.approve(address(mm), 1);
        nft2.approve(address(mm), 2);
        
        mm.deposit(addresses1, tokenIds1, true);
        mm.distributeRandomItem{value: 0.01 ether}();
                
        assertEq(mm.lastMappingIndex(), 10);
    }    
    
    function test_DepositDistributeDepositReloadFalse() public {
        address[] memory addresses = new address[](8);
        uint256[] memory tokenIds = new uint256[](8);
        
        addresses[0] = address(nft);
        addresses[1] = address(nft);
        addresses[2] = address(nft);
        addresses[3] = address(nft1);
        addresses[4] = address(nft1);
        addresses[5] = address(nft1);
        addresses[6] = address(nft2);
        
        addresses[7] = address(nft3);
        
        tokenIds[0] = uint(0);
        tokenIds[1] = uint(1);
        tokenIds[2] = uint(2);
        tokenIds[3] = uint(0);
        tokenIds[4] = uint(1);
        tokenIds[5] = uint(2);
        tokenIds[6] = uint(0);
        
        tokenIds[7] = uint(0);
    
        nft.approve(address(mm), 0);
        nft.approve(address(mm), 1);
        nft.approve(address(mm), 2);
        nft1.approve(address(mm), 0);
        nft1.approve(address(mm), 1);
        nft1.approve(address(mm), 2);
        nft2.approve(address(mm), 0);
        
        nft3.setApprovalForAll(address(mm), true);
        
        
        mm.deposit(addresses, tokenIds, true);
        assertEq(mm.totalNfts(), 8);
        
        //mm.loadMachine(true);
        assertEq(mm.machine(1), 1);
        
        mm.distributeRandomItem{value: 0.01 ether}();
        
        ////////////////////////////////////
        
        address[] memory addresses1 = new address[](2);
        uint256[] memory tokenIds1 = new uint256[](2);
        addresses1[0] = address(nft2);
        addresses1[1] = address(nft2);        
        tokenIds1[0] = uint(1);
        tokenIds1[1] = uint(2);
        nft2.approve(address(mm), 1);
        nft2.approve(address(mm), 2);
        
        mm.deposit(addresses1, tokenIds1, false);
        mm.distributeRandomItem{value: 0.01 ether}();
                
        assertEq(mm.lastMappingIndex(), 9);
    } 
    
    function test_DepositEmergencyWithdraw() public {
        address[] memory addresses = new address[](8);
        uint256[] memory tokenIds = new uint256[](8);
        
        addresses[0] = address(nft);
        addresses[1] = address(nft);
        addresses[2] = address(nft);
        addresses[3] = address(nft1);
        addresses[4] = address(nft1);
        addresses[5] = address(nft1);
        addresses[6] = address(nft2);
        
        addresses[7] = address(nft3);
        
        tokenIds[0] = uint(0);
        tokenIds[1] = uint(1);
        tokenIds[2] = uint(2);
        tokenIds[3] = uint(0);
        tokenIds[4] = uint(1);
        tokenIds[5] = uint(2);
        tokenIds[6] = uint(0);
        
        tokenIds[7] = uint(0);
    
        nft.approve(address(mm), 0);
        nft.approve(address(mm), 1);
        nft.approve(address(mm), 2);
        nft1.approve(address(mm), 0);
        nft1.approve(address(mm), 1);
        nft1.approve(address(mm), 2);
        nft2.approve(address(mm), 0);
        
        nft3.setApprovalForAll(address(mm), true);
        
        mm.deposit(addresses, tokenIds, true);
        assertEq(mm.totalNfts(), 8);
        
        //mm.loadMachine(true);
        assertEq(mm.machine(1), 1);
        
        //mm.distributeRandomItem{value: 0.01 ether}();
        
        assertEq(mm.lastMappingIndex(), 8);
        
        mm.emergencyWithdraw(addresses, tokenIds);
        assertEq(nft.balanceOf(address(this)), 3);
    }
    
    
    
    function test_TransferDistribute() public {
        address[] memory addresses = new address[](8);
        uint256[] memory tokenIds = new uint256[](8);
        
        addresses[0] = address(nft);
        addresses[1] = address(nft);
        addresses[2] = address(nft);
        addresses[3] = address(nft1);
        addresses[4] = address(nft1);
        addresses[5] = address(nft1);
        addresses[6] = address(nft2);
        
        addresses[7] = address(nft3);
        
        tokenIds[0] = uint(0);
        tokenIds[1] = uint(1);
        tokenIds[2] = uint(2);
        tokenIds[3] = uint(0);
        tokenIds[4] = uint(1);
        tokenIds[5] = uint(2);
        tokenIds[6] = uint(0);
        
        tokenIds[7] = uint(0);
    
        nft.safeTransferFrom(address(this), address(mm), 0);
        nft.safeTransferFrom(address(this), address(mm), 1);
        nft.safeTransferFrom(address(this), address(mm), 2);
        nft1.safeTransferFrom(address(this), address(mm), 0);
        nft1.safeTransferFrom(address(this), address(mm), 1);
        nft1.safeTransferFrom(address(this), address(mm), 2);
        nft2.safeTransferFrom(address(this), address(mm), 0);
        
        nft3.safeTransferFrom(address(this), address(mm), 0, 1, "");
        
        //mm.deposit(addresses, tokenIds, true, true);
        assertEq(mm.totalNfts(), 8);
        
        mm.loadMachine();
        assertEq(mm.machine(1), 1);
        
        mm.distributeRandomItem{value: 0.01 ether}();
        
        assertEq(mm.lastMappingIndex(), 8);
        
        mm.withdraw(address(0x420));
        assertEq(address(0x420).balance, 0.01 ether);
    }
}
