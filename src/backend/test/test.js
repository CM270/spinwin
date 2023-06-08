const { expect } = require("chai");
describe("SpinWin", function () {
  let spinWin;
  let token;
  let user;
  let owner;
  let ethers;

  beforeEach(async function () {
    const SpinWin = await ethers.getContractFactory("SpinWin");
    const Token = await ethers.getContractFactory("Token");

    token = await Token.deploy("SpinWin", "SW");
    spinWin = await SpinWin.deploy();
    await spinWin.deployed();

    await token.mint(spinWin.address, ethers.utils.parseEther("1000000"));
    await spinWin.setTokenAddress(token.address);

    [owner, user] = await ethers.getSigners();

  });



  it("should set the correct token address", async function () {
    expect(await spinWin.getTokenAddress()).to.equal(token.address);
  });

  it("should return the correct token balance of an address", async function () {
    const balance = await token.balanceOf(spinWin.address);
    expect(await spinWin.tokenBalance(spinWin.address)).to.equal(balance);
  });

  it("should calculate the correct token price", async function () {
    const numTokens = 100;
    const price = await spinWin.prixTokens(numTokens);
    const expectedPrice = ethers.utils.parseEther("0.1");
    expect(price).to.equal(expectedPrice);
  });

  it("should allow users to purchase tokens", async function () {
    const numTokens = 100;
    const price = await spinWin.prixTokens(numTokens);
    const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);

    await spinWin.achatTokens(numTokens, { value: price });

    const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
    const userTokenBalance = await token.balanceOf(user.address);
    const contractTokenBalance = await token.balanceOf(spinWin.address);

    expect(ownerBalanceAfter).to.be.above(ownerBalanceBefore);
    expect(userTokenBalance).to.equal(numTokens);
    expect(contractTokenBalance).to.be.above(0);
  });

  it("should allow users to withdraw tokens", async function () {
    const numTokens = 100;
    const price = await spinWin.prixTokens(numTokens);
    const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
    const userTokenBalanceBefore = await token.balanceOf(user.address);

    await spinWin.achatTokens(numTokens, { value: price });
    await spinWin.retirerTokens(numTokens);

    const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
    const userTokenBalanceAfter = await token.balanceOf(user.address);
    const contractTokenBalance = await token.balanceOf(spinWin.address);

    expect(ownerBalanceAfter).to.be.above(ownerBalanceBefore);
    expect(userTokenBalanceAfter).to.equal(userTokenBalanceBefore);
    expect(contractTokenBalance).to.equal(0);
  });

  it("should allow the owner to withdraw ethers", async function () {
    const numEthers = ethers.utils.parseEther("1");
    const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);

    await spinWin.retirarEth(numEthers);

    const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);

    expect(ownerBalanceAfter).to.be.above(ownerBalanceBefore);
  });

  it("should allow users to play roulette and earn tokens", async function () {
    const numTokens = 100;
    const numEthers = ethers.utils.parseEther("1");

    await spinWin.achatTokens(numTokens, { value: numEthers });

    const userTokenBalanceBefore = await token.balanceOf(user.address);
    await spinWin.jouerroulette(0, 14, numTokens);

    const userTokenBalanceAfter = await token.balanceOf(user.address);
    const contractTokenBalance = await token.balanceOf(spinWin.address);
    const events = await spinWin.queryFilter("RouletteGame");
    
    expect(userTokenBalanceAfter).to.be.above(userTokenBalanceBefore);
    expect(contractTokenBalance).to.be.above(0);
    expect(events.length).to.equal(1);
    
    const event = events[0];
    expect(event.args.NumberWin).to.be.within(0, 14);
    expect(event.args.result).to.be.a("boolean");
    expect(event.args.tokensEarned).to.be.a("number");});
    

    it("should add the game to the user's history", async function () {
        const numTokens = 100;
        const numEthers = ethers.utils.parseEther("1");

        await spinWin.achatTokens(numTokens, { value: numEthers });

const userTokenBalanceBefore = await token.balanceOf(user.address);

await spinWin.jouerroulette(0, 14, numTokens);

const userTokenBalanceAfter = await token.balanceOf(user.address);
const history = await spinWin.tonhistorique(user.address);

expect(userTokenBalanceAfter).to.be.above(userTokenBalanceBefore);
expect(history.length).to.equal(1);

const game = history[0];
expect(game.tokensBet).to.equal(numTokens);
expect(game.tokensEarned).to.be.a("number");
expect(game.game).to.equal("Roulete");
});
});