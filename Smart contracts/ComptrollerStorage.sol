pragma solidity ^0.5.16;

import "./CToken.sol";
import "./PriceOracle/PriceOracle.sol";
import "./Interface/NESTControllerInterface.sol";

contract UnitrollerAdminStorage {
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
    address public comptrollerImplementation;

    /**
    * @notice Pending brains of Unitroller
    */
    address public pendingComptrollerImplementation;
}

contract ComptrollerC1Storage is UnitrollerAdminStorage {

    /**
     * @notice Oracle which gives the price of any given asset
     */
    PriceOracle public oracle;

    /**
     * @notice Multiplier used to calculate the maximum repayAmount when liquidating a borrow
     */
    uint public closeFactorMantissa;

    /**
     * @notice Multiplier representing the discount on collateral that a liquidator receives
     */
    uint public liquidationIncentiveMantissa;

    /**
     * @notice Max number of assets a single account can participate in (borrow or use as collateral)
     */
    uint public maxAssets;

    /**
     * @notice Per-account mapping of "assets you are in", capped by maxAssets
     */
    mapping(address => CToken[]) public accountAssets;

    struct Market {
        /// @notice Whether or not this market is listed
        bool isListed;

        /**
         * @notice Multiplier representing the most one can borrow against their collateral in this market.
         *  For instance, 0.9 to allow borrowing 90% of collateral value.
         *  Must be between 0 and 1, and stored as a mantissa.
         */
        uint collateralFactorMantissa;

        /// @notice Per-market mapping of "accounts in this asset"
        mapping(address => bool) accountMembership;

        /// @notice Whether or not this market receives CREDIT
        bool isCredit;
    }

    /**
     * @notice Official mapping of cTokens -> Market metadata
     * @dev Used e.g. to determine if a market is supported
     */
    mapping(address => Market) public markets;

    /**
     * @notice The Pause Guardian can pause certain actions as a safety mechanism.
     *  Actions which allow users to remove their own assets cannot be paused.
     *  Liquidation / seizing / transfer can only be paused globally, not by market.
     */
    address public pauseGuardian;
    bool public _mintGuardianPaused;
    bool public _borrowGuardianPaused;
    bool public transferGuardianPaused;
    bool public seizeGuardianPaused;
    mapping(address => bool) public mintGuardianPaused;
    mapping(address => bool) public borrowGuardianPaused;

    struct VenusMarketState {
        /// @notice The market's last updated creditBorrowIndex or creditSupplyIndex
        uint224 index;

        /// @notice The block number the index was last updated at
        uint32 block;
    }

    /// @notice A list of all markets
    CToken[] public allMarkets;

    /// @notice The rate at which the flywheel distributes CREDIT, per block
    uint public creditRate;

    /// @notice The portion of creditRate that each market currently receives
    mapping(address => uint) public creditSpeeds;

    /// @notice The Venus market supply state for each market
    mapping(address => VenusMarketState) public creditSupplyState;

    /// @notice The Venus market borrow state for each market
    mapping(address => VenusMarketState) public creditBorrowState;

    /// @notice The Venus supply index for each market for each supplier as of the last time they accrued CREDIT
    mapping(address => mapping(address => uint)) public creditSupplierIndex;

    /// @notice The Venus borrow index for each market for each borrower as of the last time they accrued CREDIT
    mapping(address => mapping(address => uint)) public creditBorrowerIndex;

    /// @notice The CREDIT accrued but not yet transferred to each user
    mapping(address => uint) public creditAccrued;

    /// @notice The Address of NESTController
    NESTControllerInterface public vaiController;

    /// @notice The minted NEST amount to each user
    mapping(address => uint) public mintedNESTs;

    /// @notice NEST Mint Rate as a percentage
    uint public vaiMintRate;

    /**
     * @notice The Pause Guardian can pause certain actions as a safety mechanism.
     */
    bool public mintNESTGuardianPaused;
    bool public repayNESTGuardianPaused;

    /**
     * @notice Pause/Unpause whole protocol actions
     */
    bool public protocolPaused;

    /// @notice The rate at which the flywheel distributes CREDIT to NEST Minters, per block
    uint public creditNESTRate;
}

contract ComptrollerC2Storage is ComptrollerC1Storage {
    /// @notice The rate at which the flywheel distributes CREDIT to NEST Vault, per block
    uint public creditNESTVaultRate;

    // address of NEST Vault
    address public vaiVaultAddress;

    // start block of release to NEST Vault
    uint256 public releaseStartBlock;

    // minimum release amount to NEST Vault
    uint256 public minReleaseAmount;
}

contract ComptrollerC3Storage is ComptrollerC2Storage {
    /// @notice The borrowCapGuardian can set borrowCaps to any number for any market. Lowering the borrow cap could disable borrowing on the given market.
    address public borrowCapGuardian;

    /// @notice Borrow caps enforced by borrowAllowed for each cToken address. Defaults to zero which corresponds to unlimited borrowing.
    mapping(address => uint) public borrowCaps;
}
