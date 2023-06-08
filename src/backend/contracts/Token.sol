// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IERC20 {

    // Renvoie le nombre de tokens existants.
    function totalSupply() external view returns (uint256);

    // Renvoie la quantité de jetons qu'un compte possède.
    function balanceOf(address account) external view returns (uint256);

   /* Effectue un transfert de jetons à un destinataire.
    Renvoie une valeur booléenne indiquant si l'opération a réussi.
    Émet un événement {Transfer}. */
    function transfer(address from, address to, uint256 amount) external returns (bool);

    /* Est émis lorsqu'un transfert de jetons est effectué.
   Notez que value peut être nul. */
    event Transfer(address indexed from, address indexed to, uint256 value);
}

// Contrat intelligent des jetons ERC20
contract ERC20 is IERC20 {

// Structures de données
    mapping(address => uint256) private _balances;
    
    // Variables
    uint256 private _totalSupply;
    string private _name;
    string private _symbol;
    address public owner;

    modifier onlyOwner(address _owner) {
        require(_owner == owner, "Vous netes pas owner");
        _;
    }

    /* / Définit la valeur du nom et du symbole du jeton.
   La valeur par défaut de {decimals} est de 18. Pour sélectionner une valeur différente pour
   {decimals} doit être remplacé. / */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        owner = msg.sender;
    }

    //  Renvoie le nom du jeton.
    function name() public view virtual returns (string memory) {
        return _name;
    }

// Renvoie le symbole du jeton, généralement une version abrégée du nom.
    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

   /* Renvoie le nombre de décimales utilisées pour obtenir sa représentation utilisateur.
   Par exemple, si decimals est égal à 2, un solde de 505 jetons devrait
   être affiché à l'utilisateur comme 5,05 (505 / 10 ** 2).
   Les jetons ont généralement une valeur de 18, imitant la relation entre
   Ether et Wei. C'est la valeur qu'utilise {ERC20}, sauf si cette fonction est
   annulée. */
    function decimals() public view virtual returns (uint8) {
        return 0;
    }

    // totalSupply
    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    // retourne la balance
    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }


    function transfer(address from,address to, uint256 amount) public virtual override returns (bool) {
        _transfer(from, to, amount);
        return true;
    }

    function mint(uint256 amount) public virtual onlyOwner(msg.sender) returns (bool) {
        _mint(msg.sender, amount);
        return true;
    }

    /*/* Déplacer  des jetons de l'expéditeur sender au destinataire recipient.
    Cette fonction interne est équivalente à {transfer}, et peut être utilisée pour
    par exemple, mettre en œuvre des frais automatiques de jetons, etc.
    Émet un événement {Transfer}.
    Exigences:
    
from et to ne peuvent pas être des adresses zéro.
from doit avoir un solde d'au moins amount. */ 
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
        }
        _balances[to] += amount;
        emit Transfer(from, to, amount);
    }

    /* Crée des jetons "amount" et les attribue à un "account", augmentant
    l'offre totale.
    Émet un événement {Transfer} avec "from" en tant qu'adresse zéro.
    Exigences:
    
account ne peut pas être l'adresse zéro. */
    function _mint(address account, uint256 amount) internal virtual{
        require(account != address(0), "ERC20: mint to the zero address");
        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }
}