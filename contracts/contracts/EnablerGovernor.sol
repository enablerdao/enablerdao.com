// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Governor} from "@openzeppelin/contracts/governance/Governor.sol";
import {GovernorCountingSimple} from "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import {GovernorVotes} from "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import {GovernorVotesQuorumFraction} from "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import {GovernorTimelockControl} from "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import {GovernorSettings} from "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";

/**
 * @title EnablerGovernor
 * @author EnablerDAO
 * @notice EnablerDAOのガバナンスコントラクト。
 *         ENBトークン保有者による提案・投票・実行を管理する。
 * @dev OpenZeppelin Governor 5.x ベース。以下の拡張を使用:
 *      - GovernorSettings: 投票遅延・投票期間・提案閾値の設定
 *      - GovernorCountingSimple: 賛成/反対/棄権の単純集計
 *      - GovernorVotes: ERC20Votesトークンとの統合
 *      - GovernorVotesQuorumFraction: 定足数を総供給量の割合で指定
 *      - GovernorTimelockControl: Timelockを通じた安全な実行
 *
 * デフォルトパラメータ:
 *   - 投票遅延: 1日 (7200ブロック @ 12秒/ブロック)
 *   - 投票期間: 1週間 (50400ブロック)
 *   - 提案閾値: 総供給量の0.1% (1,000,000 ENB)
 *   - 定足数: 総供給量の4%
 */
contract EnablerGovernor is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    /**
     * @notice コントラクトの初期化
     * @param token ガバナンストークン (ENB)
     * @param timelock タイムロックコントローラー
     */
    constructor(
        IVotes token,
        TimelockController timelock
    )
        Governor("EnablerDAO Governor")
        GovernorSettings(
            7200,       // 投票遅延: 約1日 (7200ブロック)
            50400,      // 投票期間: 約1週間 (50400ブロック)
            1_000_000e18 // 提案閾値: 1,000,000 ENB
        )
        GovernorVotes(token)
        GovernorVotesQuorumFraction(4) // 定足数: 4%
        GovernorTimelockControl(timelock)
    {}

    // =========================================================================
    // オーバーライド (複数の継承元の競合解決)
    // =========================================================================

    /**
     * @notice 投票遅延ブロック数を返す
     * @return 投票遅延ブロック数
     */
    function votingDelay()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    /**
     * @notice 投票期間ブロック数を返す
     * @return 投票期間ブロック数
     */
    function votingPeriod()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    /**
     * @notice 特定のブロック時点での定足数を返す
     * @param blockNumber 参照ブロック番号
     * @return 定足数 (トークン量)
     */
    function quorum(
        uint256 blockNumber
    )
        public
        view
        override(Governor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    /**
     * @notice 提案の現在の状態を返す
     * @param proposalId 提案ID
     * @return 提案の状態
     */
    function state(
        uint256 proposalId
    )
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    /**
     * @notice 提案が実行のためにキューに入れられるべきかを返す
     * @param proposalId 提案ID
     * @return キューが必要かどうか
     */
    function proposalNeedsQueuing(
        uint256 proposalId
    )
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.proposalNeedsQueuing(proposalId);
    }

    /**
     * @notice 提案作成に必要な最低トークン保有量を返す
     * @return 提案閾値 (トークン量)
     */
    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    /// @inheritdoc Governor
    function _queueOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    )
        internal
        override(Governor, GovernorTimelockControl)
        returns (uint48)
    {
        return super._queueOperations(
            proposalId, targets, values, calldatas, descriptionHash
        );
    }

    /// @inheritdoc Governor
    function _executeOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._executeOperations(
            proposalId, targets, values, calldatas, descriptionHash
        );
    }

    /// @inheritdoc Governor
    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    )
        internal
        override(Governor, GovernorTimelockControl)
        returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    /// @inheritdoc Governor
    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }
}
