## @my-app/contracts

A minimalist, opinionated structure for managing smart contract ABIs and addresses.

[Read more about Application Binary Interfaces (ABIs) here](https://ethereum.stackexchange.com/questions/234/what-is-an-abi-and-why-is-it-needed-to-interact-with-contracts).

## Deployment

[https://rinkeby.etherscan.io/address/0xC5c7C45eEA8F11760d5e63d9CB7c7AE46B3de635](https://rinkeby.etherscan.io/address/0x61681514eA040d19dC4279301aDC10bf654D886A)

## Solidity contract

```
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Silo is ERC721, ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    address dai;

    struct Item {
        uint256 price;
        uint256 supply;
        address issuerAddress;
        string URI;
    }

    struct Issuer {
        string name;
        uint256 UID;
        address issuerAddress;
        string companyInfo;
        uint256 numItem;
        mapping(uint256 => Item) item;
    }

    uint256 numIssuer = 0;
    mapping(uint256 => Issuer) public issuer;

    event NewIssuer(
        string _name,
        uint256 _UID,
        address _issuerAddress,
        string _companyInfo
    );
    event Buy(
        address indexed _buyer,
        address indexed _holder,
        uint256 _tokenId,
        uint256 _price
    );
    event Sell(
        address indexed _from,
        address indexed _to,
        uint256 _tokenId,
        string _newURI
    );
    event Burn(address indexed _from, uint256 _tokenId);

    constructor(address _dai) ERC721("Silo", "SILO") {
        dai = _dai;
    }

    function addIssuer(string memory _name, string memory _companyInfo)
        public
        payable
    {
        bool verify = false;
        // to verify if the Issuer already exists

        for (uint256 i = 0; i < numIssuer; i++) {
            if (
                keccak256(abi.encodePacked(issuer[i].name)) ==
                keccak256(abi.encodePacked(_name))
            ) {
                verify = true;
            }
        }

        require(verify == false, "ISSUER_ALREADY_CREATED");

        issuer[numIssuer].name = _name;
        issuer[numIssuer].UID = numIssuer;
        issuer[numIssuer].issuerAddress = msg.sender;
        issuer[numIssuer].companyInfo = _companyInfo;
        issuer[numIssuer].numItem = 0;

        numIssuer++;

        emit NewIssuer(
            issuer[numIssuer].name,
            issuer[numIssuer].UID,
            issuer[numIssuer].issuerAddress,
            issuer[numIssuer].companyInfo
        );
    }

    function create(
        uint256 _UIDIssuer,
        uint256 _supply,
        uint256 _price,
        string calldata _URI
    ) public {
        require(
            issuer[_UIDIssuer].issuerAddress == msg.sender,
            "CALLER_MUST_BE_REGISTERED_ISSUER"
        );

        uint256 numberOfItemStart = issuer[_UIDIssuer].numItem;

        for (
            uint256 i = numberOfItemStart;
            i < (numberOfItemStart + _supply);
            i++
        ) {
            issuer[_UIDIssuer].item[i].price = _price;
            issuer[_UIDIssuer].item[i].issuerAddress = msg.sender;
            issuer[_UIDIssuer].item[i].supply = 1;
            issuer[_UIDIssuer].item[i].URI = _URI;
        }
        issuer[_UIDIssuer].numItem += _supply;
    }

    //ajouter partie URI
    function buy(uint256 _UIDIssuer) public payable {
        require(issuer[_UIDIssuer].numItem - 1 >= 0, "NFT_SOLD_OUT");

        uint256 numItem = issuer[_UIDIssuer].numItem - 1;
        uint256 value = issuer[_UIDIssuer].item[numItem].price * 10**18;

        require(issuer[_UIDIssuer].numItem > 0, "NO_NFT_FOR_SALE");

        require(
            IERC20(dai).balanceOf(msg.sender) >= value,
            "INSUFFICIENT_FUNDS"
        );

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        IERC20(dai).transferFrom(
            msg.sender,
            issuer[_UIDIssuer].issuerAddress,
            value
        );

        issuer[_UIDIssuer].numItem -= 1;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, issuer[_UIDIssuer].item[numItem].URI);

        emit Buy(msg.sender, issuer[_UIDIssuer].issuerAddress, tokenId, value);
    }

    function sell(
        uint256 tokenId,
        string calldata _nameIssuer,
        string memory _newURI
    ) public {
        require(balanceOf(msg.sender) > 0, "CALLER_MUST_HOLD_THE_NFT");

        uint256 issuerId = st2num(getIssuerId(_nameIssuer));
        _setTokenURI(tokenId, _newURI);
        safeTransferFrom(msg.sender, issuer[issuerId].issuerAddress, tokenId);

        emit Sell(msg.sender, issuer[issuerId].issuerAddress, tokenId, _newURI);
    }

    function redeem(uint256 tokenId) public {
        _burn(tokenId);

        emit Burn(msg.sender, tokenId);
    }

    //SETTER

    function changePrice(uint256 _UIDIssuer, uint256 _newPrice) public payable {
        require(
            issuer[_UIDIssuer].issuerAddress == msg.sender,
            "CALLER_CANNOT_CHANGE_PRICE"
        );

        for (uint256 i = 0; i < issuer[_UIDIssuer].numItem; i++) {
            issuer[_UIDIssuer].item[i].price = _newPrice;
        }
    }

    function changeCompanyInfo(uint256 _UIDIssuer, string memory _compagnyInfo)
        public
        payable
    {
        require(
            issuer[_UIDIssuer].issuerAddress == msg.sender,
            "CALLER_DOES_NOT_MATCH_COMPANY"
        );

        issuer[_UIDIssuer].companyInfo = _compagnyInfo;
    }

    //GETTER

    function getIssuerId(string calldata _name)
        internal
        view
        returns (string memory)
    {
        for (uint256 i = 0; i < numIssuer; i++) {
            if (
                keccak256(abi.encodePacked(issuer[i].name)) ==
                keccak256(abi.encodePacked(_name))
            ) {
                return Strings.toString(issuer[i].UID);
            }
        }
        return "WRONG_COMPANY_NAME";
    }

    //ajouter fonction verif adresse d'un wallet return TRUE ou FALSE !
    function isAddressExist (address _issuerAddress) public view returns (bool)
    {
        for (uint256 i = 0; i < numIssuer; i++){
            if (issuer[i].issuerAddress == _issuerAddress)
            {
                return true;
            }
        }

        return false;
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function st2num(string memory numString) internal pure returns (uint256) {
        uint256 val = 0;
        bytes memory stringBytes = bytes(numString);
        for (uint256 i = 0; i < stringBytes.length; i++) {
            uint256 exp = stringBytes.length - i;
            bytes1 ival = stringBytes[i];
            uint8 uval = uint8(ival);
            uint256 jval = uval - uint256(0x30);

            val += (uint256(jval) * (10**(exp - 1)));
        }
        return val;
    }

    //FOR HARDHAT TEST

    function getItem(uint256 _UIDIssuer) public view returns (Item memory) {
        uint256 numItem = issuer[_UIDIssuer].numItem - 1;

        return issuer[_UIDIssuer].item[numItem];
    }
}
```
