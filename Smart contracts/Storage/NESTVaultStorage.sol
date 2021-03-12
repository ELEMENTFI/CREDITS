pragma solidity ^0.5.16;
import "../math/SafeMath.sol";
import "../Staking/IBEP20.sol";

contract NESTVaultAdminStorage {
    /**
    * @notice Administrator for this contract
    */
    address public admin;

    /**
    * @notice Pending administrator for this contract
    */
    address public pendingAdmin;

    /**
    * @notice Active brains of NEST Vault
    */
    address public nestVaultImplementation;

    /**
    * @notice Pending brains of NEST Vault
    */
    address public pendingNESTVaultImplementation;
}

contract NESTVaultStorage is NESTVaultAdminStorage {
    /// @notice The CREDIT TOKEN!
    IBEP20 public credit;

    /// @notice The NEST TOKEN!
    IBEP20 public nest;

    /// @notice Guard variable for re-entrancy checks
    bool internal _notEntered;

    /// @notice CREDIT balance of vault
    uint256 public creditBalance;

    /// @notice Accumulated CREDIT per share
    uint256 public accCREDITPerShare;

    //// pending rewards awaiting anyone to update
    uint256 public pendingRewards;

    /// @notice Info of each user.
    struct UserInfo {
        uint256 amount;
        uint256 rewardDebt;
    }

    // Info of each user that stakes tokens.
    mapping(address => UserInfo) public userInfo;
}