// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MagicMachine} from "../src/MagicMachine.sol";

contract PruneMachineScript is Script {
    function setUp() public {
    
    }

    function run() public {
        //address machineAddress = address(0xf42d8aa36a328ef5a44D37ae9B035Aa5BE47764a); // baseSepolia
        address machineAddress = address(0xCaCd62a501991E50b8806a89fB993164b8501212); // zoraSepolia
        //address deployer = address(0xA9fD03e154e1B3Cbe88F1b515E7EbDAb2d640b60);
    
        MagicMachine mm = MagicMachine(machineAddress);
    
        uint256[] memory indexes = new uint256[](1);
        indexes[0] = 1;
    
        vm.startBroadcast(vm.envUint("PK"));
        
        mm.transferOwnership(address(0x2D0A6C67dc678E852483924225660ad5a4349335));
        //mm.pruneMachine(indexes);
        //mm.withdraw();
        //mm.distributeRandomItem{value: mm.price()}();
        //mm.distributeRandomItem{value: mm.price()}();
        //mm.distributeRandomItem{value: mm.price()}();
        /*
        for (uint i = 0; i < 69; i++) {
            console.log(mm.machine(i));
        }
        */
    }
}
