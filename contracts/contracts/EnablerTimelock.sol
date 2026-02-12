// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";

/**
 * @title EnablerTimelock
 * @author EnablerDAO
 * @notice ガバナンス提案の実行を遅延させるタイムロックコントローラー。
 *         提案が可決された後、一定期間の遅延を経てから実行される。
 *         これにより、コミュニティが不正な提案に気づき対応する時間が確保される。
 * @dev OpenZeppelin TimelockController 5.x ベース。
 *
 * デフォルトパラメータ:
 *   - 最小遅延: 2日 (172800秒)
 *   - PROPOSER_ROLE: Governorコントラクトに付与
 *   - EXECUTOR_ROLE: Governorコントラクトに付与
 *   - CANCELLER_ROLE: 管理者に付与 (緊急時のキャンセル用)
 */
contract EnablerTimelock is TimelockController {
    /// @notice デフォルトの最小遅延時間 (2日)
    uint256 public constant DEFAULT_MIN_DELAY = 2 days;

    /**
     * @notice コントラクトの初期化
     * @param minDelay 提案実行までの最小遅延時間 (秒)
     * @param proposers 提案権限を持つアドレス (通常はGovernorコントラクト)
     * @param executors 実行権限を持つアドレス (通常はGovernorコントラクト)
     * @param admin 初期管理者アドレス (ロール管理に必要。セットアップ後に放棄推奨)
     */
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
}
