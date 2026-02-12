import { ethers } from "hardhat";

/**
 * チームメンバー向けベスティングスケジュール作成スクリプト
 *
 * 前提条件:
 *   - TokenVesting コントラクトがデプロイ済み
 *   - TokenVesting に TEAM_ALLOCATION (200,000,000 ENB) が入金済み
 *
 * 環境変数:
 *   VESTING_CONTRACT - TokenVesting のアドレス
 *   TEAM_MEMBERS     - チームメンバーアドレスのカンマ区切り
 *   TEAM_AMOUNTS     - 各メンバーの配分量 (ENB) のカンマ区切り
 */

async function main() {
  const [deployer] = await ethers.getSigners();

  const vestingAddress = process.env.VESTING_CONTRACT;
  if (!vestingAddress) {
    throw new Error("VESTING_CONTRACT environment variable is required");
  }

  const vesting = await ethers.getContractAt("TokenVesting", vestingAddress);

  // チームメンバー設定 (環境変数またはデフォルト)
  const membersStr = process.env.TEAM_MEMBERS || deployer.address;
  const amountsStr = process.env.TEAM_AMOUNTS || "200000000";

  const members = membersStr.split(",").map((m) => m.trim());
  const amounts = amountsStr
    .split(",")
    .map((a) => ethers.parseEther(a.trim()));

  if (members.length !== amounts.length) {
    throw new Error("TEAM_MEMBERS and TEAM_AMOUNTS must have the same length");
  }

  // ベスティングパラメータ
  const cliffDuration = 6 * 30 * 24 * 60 * 60; // 6ヶ月 (概算)
  const totalDuration = 2 * 365 * 24 * 60 * 60; // 2年
  const startTime = 0; // 0 = block.timestamp

  console.log("====================================");
  console.log("Team Vesting Schedule Setup");
  console.log("====================================");
  console.log(`Vesting contract: ${vestingAddress}`);
  console.log(`Cliff: 6 months`);
  console.log(`Total duration: 2 years`);
  console.log(`Revocable: Yes`);
  console.log("------------------------------------");

  for (let i = 0; i < members.length; i++) {
    console.log(
      `\nCreating schedule for ${members[i]} (${ethers.formatEther(amounts[i])} ENB)...`
    );

    const tx = await vesting.createVestingSchedule(
      members[i],
      amounts[i],
      startTime,
      cliffDuration,
      totalDuration,
      true // revocable
    );
    const receipt = await tx.wait();
    console.log(`  Tx: ${receipt?.hash}`);
  }

  console.log("\n====================================");
  console.log("Vesting schedules created successfully!");
  console.log("====================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Setup failed:", error);
    process.exit(1);
  });
