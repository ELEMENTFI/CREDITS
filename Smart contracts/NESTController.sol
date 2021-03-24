pragma solidity ^0.5.16;

import "./CToken.sol";
import "./TestingPriceOracle/PriceOracle.sol";
import "./math/ErrorReporter.sol";
import "./math/Exponential.sol";
import "./Storage/NESTControllerStorage.sol";
import "./NESTUnitroller.sol";
import "./Tokens/NEST.sol";

interface ComptrollerLensInterface {
    function protocolPaused() external view returns (bool);
    function mintedNESTs(address account) external view returns (uint);
    function nestMintRate() external view returns (uint);
    function creditNESTRate() external view returns (uint);
    function creditAccrued(address account) external view returns(uint);
    function getAssetsIn(address account) external view returns (CToken[] memory);
    function oracle() external view returns (PriceOracle);

    function distributeNESTMinterCredit(address nestMinter, bool distributeAll) external;
}

/**
 * @title Credit's NEST Comptroller Contract
 */
contract NESTController is NESTControllerStorage, NESTControllerErrorReporter, Exponential {

    /// @notice Emitted when Comptroller is changed
    event NewComptroller(ComptrollerInterface oldComptroller, ComptrollerInterface newComptroller);

    /**
     * @notice Event emitted when NEST is minted
     */
    event MintNEST(address minter, uint mintNESTAmount);

    /**
     * @notice Event emitted when NEST is repaid
     */
    event RepayNEST(address repayer, uint repayNESTAmount);

    /// @notice The initial Credit index for a market
    uint224 public constant creditInitialIndex = 1e36;

    /*** Main Actions ***/

    function mintNEST(uint mintNESTAmount) external returns (uint) {
        if(address(comptroller) != address(0)) {
            require(!ComptrollerLensInterface(address(comptroller)).protocolPaused(), "protocol is paused");

            address minter = msg.sender;

            // Keep the flywheel moving
            updateCreditNESTMintIndex();
            ComptrollerLensInterface(address(comptroller)).distributeNESTMinterCredit(minter, false);

            uint oErr;
            MathError mErr;
            uint accountMintNESTNew;
            uint accountMintableNEST;

            (oErr, accountMintableNEST) = getMintableNEST(minter);
            if (oErr != uint(Error.NO_ERROR)) {
                return uint(Error.REJECTION);
            }

            // check that user have sufficient mintableNEST balance
            if (mintNESTAmount > accountMintableNEST) {
                return fail(Error.REJECTION, FailureInfo.NEST_MINT_REJECTION);
            }

            (mErr, accountMintNESTNew) = addUInt(ComptrollerLensInterface(address(comptroller)).mintedNESTs(minter), mintNESTAmount);
            require(mErr == MathError.NO_ERROR, "NEST_MINT_AMOUNT_CALCULATION_FAILED");
            uint error = comptroller.setMintedNESTOf(minter, accountMintNESTNew);
            if (error != 0 ) {
                return error;
            }

            NEST(getNESTAddress()).mint(minter, mintNESTAmount);
            emit MintNEST(minter, mintNESTAmount);

            return uint(Error.NO_ERROR);
        }
    }

    /**
     * @notice Repay NEST
     */
    function repayNEST(uint repayNESTAmount) external returns (uint) {
        if(address(comptroller) != address(0)) {
            require(!ComptrollerLensInterface(address(comptroller)).protocolPaused(), "protocol is paused");

            address repayer = msg.sender;

            updateCreditNESTMintIndex();
            ComptrollerLensInterface(address(comptroller)).distributeNESTMinterCredit(repayer, false);

            uint actualBurnAmount;

            uint nestBalance = ComptrollerLensInterface(address(comptroller)).mintedNESTs(repayer);

            if(nestBalance > repayNESTAmount) {
                actualBurnAmount = repayNESTAmount;
            } else {
                actualBurnAmount = nestBalance;
            }

            uint error = comptroller.setMintedNESTOf(repayer, nestBalance - actualBurnAmount);
            if (error != 0) {
                return error;
            }

            NEST(getNESTAddress()).burn(repayer, actualBurnAmount);
            emit RepayNEST(repayer, actualBurnAmount);

            return uint(Error.NO_ERROR);
        }
    }

    /**
     * @notice Initialize the CreditNESTState
     */
    function _initializeCreditNESTState(uint blockNumber) external returns (uint) {
        // Check caller is admin
        if (msg.sender != admin) {
            return fail(Error.UNAUTHORIZED, FailureInfo.SET_COMPTROLLER_OWNER_CHECK);
        }

        if (isCreditNESTInitialized == false) {
            isCreditNESTInitialized = true;
            uint nestBlockNumber = blockNumber == 0 ? getBlockNumber() : blockNumber;
            creditNESTState = CreditNESTState({
                index: creditInitialIndex,
                block: safe32(nestBlockNumber, "block number overflows")
            });
        }
    }

    /**
     * @notice Accrue CREDIT to by updating the NEST minter index
     */
    function updateCreditNESTMintIndex() public returns (uint) {
        uint nestMinterSpeed = ComptrollerLensInterface(address(comptroller)).creditNESTRate();
        uint blockNumber = getBlockNumber();
        uint deltaBlocks = sub_(blockNumber, uint(creditNESTState.block));
        if (deltaBlocks > 0 && nestMinterSpeed > 0) {
            uint nestAmount = NEST(getNESTAddress()).totalSupply();
            uint creditAccrued = mul_(deltaBlocks, nestMinterSpeed);
            Double memory ratio = nestAmount > 0 ? fraction(creditAccrued, nestAmount) : Double({mantissa: 0});
            Double memory index = add_(Double({mantissa: creditNESTState.index}), ratio);
            creditNESTState = CreditNESTState({
                index: safe224(index.mantissa, "new index overflows"),
                block: safe32(blockNumber, "block number overflows")
            });
        } else if (deltaBlocks > 0) {
            creditNESTState.block = safe32(blockNumber, "block number overflows");
        }
    }

    /**
     * @notice Calculate CREDIT accrued by a NEST minter
     * @param nestMinter The address of the NEST minter to distribute CREDIT to
     */
    function calcDistributeNESTMinterCredit(address nestMinter) public returns(uint, uint, uint, uint) {
        // Check caller is comptroller
        if (msg.sender != address(comptroller)) {
            return (fail(Error.UNAUTHORIZED, FailureInfo.SET_COMPTROLLER_OWNER_CHECK), 0, 0, 0);
        }

        Double memory nestMintIndex = Double({mantissa: creditNESTState.index});
        Double memory nestMinterIndex = Double({mantissa: creditNESTMinterIndex[nestMinter]});
        creditNESTMinterIndex[nestMinter] = nestMintIndex.mantissa;

        if (nestMinterIndex.mantissa == 0 && nestMintIndex.mantissa > 0) {
            nestMinterIndex.mantissa = creditInitialIndex;
        }

        Double memory deltaIndex = sub_(nestMintIndex, nestMinterIndex);
        uint nestMinterAmount = ComptrollerLensInterface(address(comptroller)).mintedNESTs(nestMinter);
        uint nestMinterDelta = mul_(nestMinterAmount, deltaIndex);
        uint nestMinterAccrued = add_(ComptrollerLensInterface(address(comptroller)).creditAccrued(nestMinter), nestMinterDelta);
        return (uint(Error.NO_ERROR), nestMinterAccrued, nestMinterDelta, nestMintIndex.mantissa);
    }

    /*** Admin Functions ***/

    /**
      * @notice Sets a new comptroller
      * @dev Admin function to set a new comptroller
      * @return uint 0=success, otherwise a failure (see ErrorReporter.sol for details)
      */
    function _setComptroller(ComptrollerInterface comptroller_) public returns (uint) {
        // Check caller is admin
        if (msg.sender != admin) {
            return fail(Error.UNAUTHORIZED, FailureInfo.SET_COMPTROLLER_OWNER_CHECK);
        }

        ComptrollerInterface oldComptroller = comptroller;
        comptroller = comptroller_;
        emit NewComptroller(oldComptroller, comptroller_);

        return uint(Error.NO_ERROR);
    }

    function _become(NESTUnitroller unitroller) public {
        require(msg.sender == unitroller.admin(), "only unitroller admin can change brains");
        require(unitroller._acceptImplementation() == 0, "change not authorized");
    }

    /**
     * @dev Local vars for avoiding stack-depth limits in calculating account total supply balance.
     *  Note that `cTokenBalance` is the number of cTokens the account owns in the market,
     *  whereas `borrowBalance` is the amount of underlying that the account has borrowed.
     */
    struct AccountAmountLocalVars {
        uint totalSupplyAmount;
        uint sumSupply;
        uint sumBorrowPlusEffects;
        uint cTokenBalance;
        uint borrowBalance;
        uint exchangeRateMantissa;
        uint oraclePriceMantissa;
        Exp collateralFactor;
        Exp exchangeRate;
        Exp oraclePrice;
        Exp tokensToDenom;
    }

    function getMintableNEST(address minter) public view returns (uint, uint) {
        PriceOracle oracle = ComptrollerLensInterface(address(comptroller)).oracle();
        CToken[] memory enteredMarkets = ComptrollerLensInterface(address(comptroller)).getAssetsIn(minter);

        AccountAmountLocalVars memory vars; // Holds all our calculation results

        uint oErr;
        MathError mErr;

        uint accountMintableNEST;
        uint i;

        /**
         * We use this formula to calculate mintable NEST amount.
         * totalSupplyAmount * NESTMintRate - (totalBorrowAmount + mintedNESTOf)
         */
        for (i = 0; i < enteredMarkets.length; i++) {
            (oErr, vars.cTokenBalance, vars.borrowBalance, vars.exchangeRateMantissa) = enteredMarkets[i].getAccountSnapshot(minter);
            if (oErr != 0) { // semi-opaque error code, we assume NO_ERROR == 0 is invariant between upgrades
                return (uint(Error.SNAPSHOT_ERROR), 0);
            }
            vars.exchangeRate = Exp({mantissa: vars.exchangeRateMantissa});

            // Get the normalized price of the asset
            vars.oraclePriceMantissa = oracle.getUnderlyingPrice(enteredMarkets[i]);
            if (vars.oraclePriceMantissa == 0) {
                return (uint(Error.PRICE_ERROR), 0);
            }
            vars.oraclePrice = Exp({mantissa: vars.oraclePriceMantissa});

            (mErr, vars.tokensToDenom) = mulExp(vars.exchangeRate, vars.oraclePrice);
            if (mErr != MathError.NO_ERROR) {
                return (uint(Error.MATH_ERROR), 0);
            }

            // sumSupply += tokensToDenom * cTokenBalance
            (mErr, vars.sumSupply) = mulScalarTruncateAddUInt(vars.tokensToDenom, vars.cTokenBalance, vars.sumSupply);
            if (mErr != MathError.NO_ERROR) {
                return (uint(Error.MATH_ERROR), 0);
            }

            // sumBorrowPlusEffects += oraclePrice * borrowBalance
            (mErr, vars.sumBorrowPlusEffects) = mulScalarTruncateAddUInt(vars.oraclePrice, vars.borrowBalance, vars.sumBorrowPlusEffects);
            if (mErr != MathError.NO_ERROR) {
                return (uint(Error.MATH_ERROR), 0);
            }
        }

        (mErr, vars.sumBorrowPlusEffects) = addUInt(vars.sumBorrowPlusEffects, ComptrollerLensInterface(address(comptroller)).mintedNESTs(minter));
        if (mErr != MathError.NO_ERROR) {
            return (uint(Error.MATH_ERROR), 0);
        }

        (mErr, accountMintableNEST) = mulUInt(vars.sumSupply, ComptrollerLensInterface(address(comptroller)).nestMintRate());
        require(mErr == MathError.NO_ERROR, "NEST_MINT_AMOUNT_CALCULATION_FAILED");

        (mErr, accountMintableNEST) = divUInt(accountMintableNEST, 10000);
        require(mErr == MathError.NO_ERROR, "NEST_MINT_AMOUNT_CALCULATION_FAILED");


        (mErr, accountMintableNEST) = subUInt(accountMintableNEST, vars.sumBorrowPlusEffects);
        if (mErr != MathError.NO_ERROR) {
            return (uint(Error.REJECTION), 0);
        }

        return (uint(Error.NO_ERROR), accountMintableNEST);
    }

    function getBlockNumber() public view returns (uint) {
        return block.number;
    }

    /**
     * @notice Return the address of the NEST token
     * @return The address of NEST
     */
    function getNESTAddress() public view returns (address) {
        return 0x4BD17003473389A42DAF6a0a729f6Fdb328BbBd7;
    }
}