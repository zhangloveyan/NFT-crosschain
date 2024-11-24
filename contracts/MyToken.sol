// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    ERC721Burnable,
    Ownable
{
    uint256 private _nextTokenId;
    // metadata 正常是 文件夹 先临时这么干
    mapping(uint256 => string) public tokenUrlMap;

    constructor(
        string memory tokenName,
        string memory tokenSymbol
    ) ERC721(tokenName, tokenSymbol) Ownable(msg.sender) {
        tokenUrlMap[
            0
        ] = "ipfs://QmfBB5JTLrAE8JZkvsCJzGJfuHzqUoejhDhb4HYC8B7cR9";
        tokenUrlMap[
            1
        ] = "ipfs://QmYcNZtM4WbJ4ScvFaAwR4bauJFAWmhwd4K7Ri3R3q3DKX";
        tokenUrlMap[
            2
        ] = "ipfs://QmR3VhGp2BvZ4Y2PaLmhhUvKm6oU51H2eLmyLi4mbEuBbu";
        tokenUrlMap[
            3
        ] = "ipfs://QmemJbbodJt1LWUpAVGFSfFq8giNP2aPubTYWTUTbhMd3F";
        tokenUrlMap[
            4
        ] = "ipfs://Qmbrp8h4fEeD1guEkwf2bdrs69RV1CnmmGnRHSnhkEHL89";
        tokenUrlMap[
            5
        ] = "ipfs://QmaHusnzksrgKY8MpbJGbbVt2VVtQAwCiSsQHSsS395fMP";
    }

    function safeMint(address to) public {
        // tokenId = ++ 之前的值  然后在 _nextTokenId++
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenUrlMap[tokenId]);
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
