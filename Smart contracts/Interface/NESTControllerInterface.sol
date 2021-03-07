pragma solidity ^0.5.16;

contract NESTControllerInterface {
    function getNESTAddress() public view returns (address);
    function getMintableNEST(address minter) public view returns (uint, uint);
    function mintNEST(address minter, uint mintNESTAmount) external returns (uint);
    function repayNEST(address repayer, uint repayNESTAmount) external returns (uint);

    function _initializeCreditNESTState(uint blockNumber) external returns (uint);
    function updateCreditNESTMintIndex() external returns (uint);
    function calcDistributeNESTMinterCredit(address vaiMinter) external returns(uint, uint, uint, uint);
}
