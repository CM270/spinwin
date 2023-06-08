// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Token.sol";

contract SpinWin is Ownable{

    event RouletteGame (
        uint NumberWin,
        bool result,
        uint tokensEarned
    );

    ERC20 private token;
    address public tokenAddress;

    function prixTokens(uint256 _numTokens) public pure returns (uint256){
        return _numTokens * (0.001 ether);
    }

    function tokenBalance(address _of) public view returns (uint256){
        return token.balanceOf(_of);
    }
    constructor(){
        token =  new ERC20("SpinWin", "SW");
        tokenAddress = address(token);
        token.mint(1000000);
    }

    // Balance en ether du Smart Contract
    function balanceEthersSC() public view returns (uint256){
        return address(this).balance / 10**18;
    }

    function getAdress() public view returns (address){
        return address(token);

    }

     function achatTokens(uint256 _numTokens) public payable{
        // Enregistrement de l'utilisateur
        // Détermination du coût des jetons à acheter
        // Évaluation de l'argent que le client paie pour les jetons
        require(msg.value >= prixTokens(_numTokens), "Achetez moins de jetons ou payez avec plus dethers.");
        // Création de nouveaux jetons en cas de manque d'approvisionnement suffisant
        if  (token.balanceOf(address(this)) < _numTokens){
            token.mint(_numTokens*100000);
        }
        //Retour d'argent excédentaire
        //Le contrat intelligent renvoie le montant restant.
        payable(msg.sender).transfer(msg.value - prixTokens(_numTokens));
        //Envoi des jetons au client/utilisateur.
        token.transfer(address(this), msg.sender, _numTokens);
    }

    // Remboursement de tokens au Smart Contract
    function retirerTokens(uint _numTokens) public payable {
      // Le nombre de tokens doit être supérieur à 0
        require(_numTokens > 0, "Vous devez renvoyer un nombre de jetons superieur a 0");
        // L'utilisateur doit prouver qu'il possède les tokens qu'il souhaite rembourser
        require(_numTokens <= token.balanceOf(msg.sender), "Vous n'avez pas les jetons que vous souhaitez retourner.");
        // L'utilisateur transfère les tokens au Smart Contract
        token.transfer(msg.sender, address(this), _numTokens);
      // Le Smart Contract envoie les ethers à l'utilisateur
        payable(msg.sender).transfer(prixTokens(_numTokens)); 
    }

    struct Bet {
        uint tokensBet;
        uint tokensEarned;
        string game;
    }

    struct RouleteResult {
        uint NumberWin;
        bool result;
        uint tokensEarned;
    }

    mapping(address => Bet []) historiquedesparis;

    function retirarEth(uint _numEther) public payable onlyOwner {
            // Le nombre de tokens doit être supérieur à 0
        require(_numEther > 0, "Il est necessaire de rendre un nombre de jetons superieur a 0.");
       // L'utilisateur doit prouver qu'il possède les tokens qu'il souhaite rembourser
        require(_numEther <= balanceEthersSC(), "Tu nas pas les jetons que tu souhaites retirer.");
        // Transfère les ethers demandés au propriétaire du smart contract
        payable(owner()).transfer(_numEther);
    }

    function tonhistorique(address _owner) public view returns(Bet [] memory){
        return historiquedesparis[_owner];
    }

    function jouerroulette(uint _start, uint _end, uint _tokensBet) public{
        require(_tokensBet <= token.balanceOf(msg.sender));
        require(_tokensBet > 0);
        uint random = uint(uint(keccak256(abi.encodePacked(block.timestamp))) % 14);
        uint tokensEarned = 0;
        bool win = false;
        token.transfer(msg.sender, address(this), _tokensBet);
        if ((random <= _end) && (random >= _start)) {
            win = true;
            if (random == 0) {
                tokensEarned = _tokensBet*14;
            } else {
                tokensEarned = _tokensBet * 2;
            }
            if  (token.balanceOf(address(this)) < tokensEarned){
            token.mint(tokensEarned*100000);
            }
            token.transfer( address(this), msg.sender, tokensEarned);
        }
            addHistorique("Roulete", _tokensBet, tokensEarned, msg.sender);
            emit RouletteGame(random, win, tokensEarned);
    }

    function addHistorique(string memory _game, uint _tokensBet,  uint _tokenEarned, address caller) internal{
        Bet memory pari = Bet(_tokensBet, _tokenEarned, _game);
        historiquedesparis[caller].push(pari);
    }

    }




