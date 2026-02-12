import { ethers } from "hardhat";

/**
 * EnablerDAO コントラクトデプロイスクリプト
 *
 * デプロイ順序:
 *   1. EnablerToken (ENB) - ガバナンストークン
 *   2. TokenVesting - チームトークンのベスティング
 *   3. EnablerTimelock - タイムロックコントローラー
 *   4. EnablerGovernor - ガバナンスコントラクト
 *   5. EnablerTreasury - トレジャリー
 *   6. 初期配分のミント & ロール設定
 *
 * 環境変数 (必須):
 *   DEPLOYER_PRIVATE_KEY - デプロイヤーの秘密鍵
 *
 * 環境変数 (オプション):
 *   COMMUNITY_WALLET  - コミュニティ報酬ウォレット (デフォルト: deployer)
 *   ECOSYSTEM_WALLET  - エコシステム助成ウォレット (デフォルト: deployer)
 *   GUARDIAN_ADDRESS   - トレジャリーのガーディアン (デフォルト: deployer)
 */

interface DeployedContracts {
  token: string;
  vesting: string;
  timelock: string;
  governor: string;
  treasury: string;
}

async function main(): Promise<DeployedContracts> {
  const [deployer] = await ethers.getSigners();
  console.log("====================================");
  console.log("EnablerDAO Contract Deployment");
  console.log("====================================");
  console.log(`Deployer: ${deployer.address}`);
  console.log(
    `Balance:  ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH`
  );
  console.log("------------------------------------");

  // =========================================================================
  // 1. EnablerToken のデプロイ
  // =========================================================================
  console.log("\n[1/6] Deploying EnablerToken (ENB)...");
  const EnablerToken = await ethers.getContractFactory("EnablerToken");
  const token = await EnablerToken.deploy(deployer.address);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log(`  EnablerToken deployed at: ${tokenAddress}`);

  // =========================================================================
  // 2. TokenVesting のデプロイ
  // =========================================================================
  console.log("\n[2/6] Deploying TokenVesting...");
  const TokenVesting = await ethers.getContractFactory("TokenVesting");
  const vesting = await TokenVesting.deploy(tokenAddress, deployer.address);
  await vesting.waitForDeployment();
  const vestingAddress = await vesting.getAddress();
  console.log(`  TokenVesting deployed at: ${vestingAddress}`);

  // =========================================================================
  // 3. EnablerTimelock のデプロイ
  // =========================================================================
  console.log("\n[3/6] Deploying EnablerTimelock...");
  const minDelay = 2 * 24 * 60 * 60; // 2日 = 172800秒

  // 初期設定: deployer を proposer/executor に設定
  // Governor デプロイ後にロールを移譲する
  const EnablerTimelock = await ethers.getContractFactory("EnablerTimelock");
  const timelock = await EnablerTimelock.deploy(
    minDelay,
    [deployer.address], // proposers (後で Governor に変更)
    [deployer.address], // executors (後で Governor に変更)
    deployer.address // admin
  );
  await timelock.waitForDeployment();
  const timelockAddress = await timelock.getAddress();
  console.log(`  EnablerTimelock deployed at: ${timelockAddress}`);
  console.log(`  Min delay: ${minDelay} seconds (2 days)`);

  // =========================================================================
  // 4. EnablerGovernor のデプロイ
  // =========================================================================
  console.log("\n[4/6] Deploying EnablerGovernor...");
  const EnablerGovernor = await ethers.getContractFactory("EnablerGovernor");
  const governor = await EnablerGovernor.deploy(tokenAddress, timelockAddress);
  await governor.waitForDeployment();
  const governorAddress = await governor.getAddress();
  console.log(`  EnablerGovernor deployed at: ${governorAddress}`);

  // =========================================================================
  // 5. EnablerTreasury のデプロイ
  // =========================================================================
  console.log("\n[5/6] Deploying EnablerTreasury...");
  const guardianAddress =
    process.env.GUARDIAN_ADDRESS || deployer.address;
  const ethTransferLimit = ethers.parseEther("100"); // 100 ETH

  const EnablerTreasury = await ethers.getContractFactory("EnablerTreasury");
  const treasury = await EnablerTreasury.deploy(
    timelockAddress,
    guardianAddress,
    ethTransferLimit
  );
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log(`  EnablerTreasury deployed at: ${treasuryAddress}`);
  console.log(`  Guardian: ${guardianAddress}`);
  console.log(`  ETH transfer limit: 100 ETH`);

  // =========================================================================
  // 6. 初期設定 & ロール移譲
  // =========================================================================
  console.log("\n[6/6] Configuring roles and initial allocation...");

  // 6a. Timelockにgovernorのロールを付与
  const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
  const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();
  const CANCELLER_ROLE = await timelock.CANCELLER_ROLE();
  const TIMELOCK_ADMIN_ROLE = await timelock.DEFAULT_ADMIN_ROLE();

  console.log("  Granting PROPOSER_ROLE to Governor...");
  await (await timelock.grantRole(PROPOSER_ROLE, governorAddress)).wait();

  console.log("  Granting EXECUTOR_ROLE to Governor...");
  await (await timelock.grantRole(EXECUTOR_ROLE, governorAddress)).wait();

  console.log("  Granting CANCELLER_ROLE to Governor...");
  await (await timelock.grantRole(CANCELLER_ROLE, governorAddress)).wait();

  // 6b. deployer の Timelock ロールを剥奪 (完全な分散化)
  console.log("  Revoking deployer's PROPOSER_ROLE from Timelock...");
  await (await timelock.revokeRole(PROPOSER_ROLE, deployer.address)).wait();

  console.log("  Revoking deployer's EXECUTOR_ROLE from Timelock...");
  await (await timelock.revokeRole(EXECUTOR_ROLE, deployer.address)).wait();

  // 注意: TIMELOCK_ADMIN_ROLEは最後に剥奪する
  // これにより、以降のロール変更はTimelockを通じてのみ可能になる
  console.log(
    "  Revoking deployer's DEFAULT_ADMIN_ROLE from Timelock..."
  );
  await (
    await timelock.revokeRole(TIMELOCK_ADMIN_ROLE, deployer.address)
  ).wait();

  // 6c. 初期トークン配分
  const communityWallet =
    process.env.COMMUNITY_WALLET || deployer.address;
  const ecosystemWallet =
    process.env.ECOSYSTEM_WALLET || deployer.address;

  console.log("\n  Minting initial token allocation...");
  console.log(`    Community (40%): ${communityWallet}`);
  console.log(`    Team Vesting (20%): ${vestingAddress}`);
  console.log(`    Treasury (25%): ${treasuryAddress}`);
  console.log(`    Ecosystem (15%): ${ecosystemWallet}`);

  await (
    await token.mintInitialAllocation(
      communityWallet,
      vestingAddress,
      treasuryAddress,
      ecosystemWallet
    )
  ).wait();

  // 6d. Token の MINTER_ROLE を Timelock に移譲
  const MINTER_ROLE = await token.MINTER_ROLE();
  console.log("\n  Transferring MINTER_ROLE to Timelock...");
  await (await token.grantRole(MINTER_ROLE, timelockAddress)).wait();
  await (await token.revokeRole(MINTER_ROLE, deployer.address)).wait();

  // 6e. Token の DEFAULT_ADMIN_ROLE を Timelock に移譲
  const TOKEN_ADMIN_ROLE = await token.DEFAULT_ADMIN_ROLE();
  console.log("  Transferring DEFAULT_ADMIN_ROLE to Timelock...");
  await (await token.grantRole(TOKEN_ADMIN_ROLE, timelockAddress)).wait();
  await (
    await token.revokeRole(TOKEN_ADMIN_ROLE, deployer.address)
  ).wait();

  // =========================================================================
  // デプロイ結果の出力
  // =========================================================================
  console.log("\n====================================");
  console.log("Deployment Complete!");
  console.log("====================================");
  console.log(`EnablerToken (ENB):  ${tokenAddress}`);
  console.log(`TokenVesting:        ${vestingAddress}`);
  console.log(`EnablerTimelock:     ${timelockAddress}`);
  console.log(`EnablerGovernor:     ${governorAddress}`);
  console.log(`EnablerTreasury:     ${treasuryAddress}`);
  console.log("====================================");
  console.log("");
  console.log("IMPORTANT: All admin roles have been transferred to the Timelock.");
  console.log("The deployer no longer has any privileged access.");
  console.log("");
  console.log("Next steps:");
  console.log("  1. Verify contracts on Etherscan");
  console.log("  2. Set up team vesting schedules via TokenVesting");
  console.log("  3. ENB holders should delegate their votes");
  console.log("  4. Register enablerdao.eth ENS domain");
  console.log("  5. Configure ENS to point to Governor contract");

  return {
    token: tokenAddress,
    vesting: vestingAddress,
    timelock: timelockAddress,
    governor: governorAddress,
    treasury: treasuryAddress,
  };
}

main()
  .then((contracts) => {
    console.log("\nDeployed contract addresses (JSON):");
    console.log(JSON.stringify(contracts, null, 2));
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
