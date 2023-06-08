import { ethers } from "ethers";
import CasinoAbi from "../backend/contractsData/SpinWin.json";
import CasinoAddress from "../backend/contractsData/SpinWin-address.json";

    let casino = null;

    const loadContracts = async(signer) => {
        casino = new ethers.Contract(CasinoAddress.address, CasinoAbi.abi, signer);
    }

    const tokenBalance = async(acc) =>{
        const balance = await casino.tokenBalance(acc);
        return parseInt(balance._hex);
    }

    const buyTokens = async(tokenNum, price) =>{
        await (await casino.achatTokens(tokenNum, {value: ethers.utils.parseEther(price.toString())})).wait();
    }

    const withdrawTokens = async(tokenNum) =>{
        await (await casino.retirerTokens(tokenNum)).wait();
    }

    const playRoulette = async(start, end, tokensBet) =>{
        const game = await (await casino.jouerroulette(start.toString(), end.toString(), tokensBet.toString())).wait();
        let result
        try{
            result = {
                numberWon : parseInt(game.events[1].args[0]._hex),
                result: game.events[1].args[1],
                tokensEarned: parseInt(game.events[1].args[2]._hex)
            }
        }catch(error){
            result = {
                numberWon : parseInt(game.events[2].args[0]._hex),
                result: game.events[2].args[1],
                tokensEarned: parseInt(game.events[2].args[2]._hex)
            }
        }
        return result
    }

    const tokenPrice = async() =>{
        const price = await casino.prixTokens(1)
        return ethers.utils.formatEther(price._hex)
    }

    const historique = async(account) =>{
        const historique = await casino.tonHistorique(account)
        let historiqueParsed = []
        historique.map((game) => (
            historiqueParsed.push([game[2], parseInt(game[0]), parseInt(game[1])])
          ))
        return historiqueParsed
    }


    export default {loadContracts, tokenBalance, buyTokens, tokenPrice, historique, playRoulette, withdrawTokens};





