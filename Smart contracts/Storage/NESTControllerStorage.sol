pragma solidity ^0.5.16;

import "../Interface/ComptrollerInterface.sol";

contract NESTUnitrollerAdminStorage {
    /**
    * @notice Administrator for this contract
    */
    address public admin;

    /**
    * @notice Pending administrator for this contract
    */
    address public pendingAdmin;

    /**
    * @notice Active brains of Unitroller
    */
    address public nestControllerImplementation;

    /**
    * @notice Pending brains of Unitroller
    */
    address public pendingNESTControllerImplementation;
}

contract NESTControllerStorage is NESTUnitrollerAdminStorage {
    ComptrollerInterface public comptroller;

    struct CreditNESTState {
        /// @notice The last updated creditNESTMintIndex
        uint224 index;

        /// @notice The block number the index was last updated at
        uint32 block;
    }

    /// @notice The Credit NEST state
    CreditNESTState public creditNESTState;

    /// @notice The Credit NEST state initialized
    bool public isCreditNESTInitialized;

    /// @notice The Credit NEST minter index as of the last time they accrued XVS
    mapping(address => uint) public creditNESTMinterIndex;
}