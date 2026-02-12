// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TokenVesting
 * @author EnablerDAO
 * @notice 開発チーム向けトークンベスティングコントラクト。
 *         指定された期間にわたってトークンを段階的にリリースする。
 * @dev 機能:
 *      - 複数の受益者を管理可能
 *      - クリフ (初期凍結期間) をサポート
 *      - 線形ベスティング (クリフ後)
 *      - ガバナンスによる取消可能 (revocable) オプション
 *      - ReentrancyGuard による再入攻撃防止
 *
 * デフォルト設定 (開発チーム用):
 *   - クリフ: 6ヶ月
 *   - ベスティング期間: 2年 (クリフ含む)
 */
contract TokenVesting is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /// @notice ベスティングスケジュール情報
    struct VestingSchedule {
        /// @dev 受益者アドレス
        address beneficiary;
        /// @dev ベスティング開始タイムスタンプ
        uint256 start;
        /// @dev クリフ期間 (秒)
        uint256 cliffDuration;
        /// @dev 総ベスティング期間 (秒)
        uint256 duration;
        /// @dev 付与トークン総量
        uint256 totalAmount;
        /// @dev 既にリリース済みの量
        uint256 released;
        /// @dev 取消可能かどうか
        bool revocable;
        /// @dev 取消済みかどうか
        bool revoked;
    }

    /// @notice ベスティングに使用するトークン
    IERC20 public immutable token;

    /// @notice スケジュールIDからスケジュールへのマッピング
    mapping(bytes32 scheduleId => VestingSchedule) public schedules;

    /// @notice 受益者が持つスケジュールIDの配列
    mapping(address beneficiary => bytes32[]) public beneficiarySchedules;

    /// @notice 作成されたスケジュールの総数
    uint256 public scheduleCount;

    /// @notice ベスティングに割り当て済みの総トークン量
    uint256 public totalAllocated;

    // =========================================================================
    // イベント
    // =========================================================================

    /// @notice 新しいベスティングスケジュールが作成された時
    event VestingScheduleCreated(
        bytes32 indexed scheduleId,
        address indexed beneficiary,
        uint256 totalAmount,
        uint256 start,
        uint256 cliffDuration,
        uint256 duration
    );

    /// @notice トークンがリリースされた時
    event TokensReleased(
        bytes32 indexed scheduleId,
        address indexed beneficiary,
        uint256 amount
    );

    /// @notice ベスティングが取消された時
    event VestingRevoked(bytes32 indexed scheduleId, uint256 refundAmount);

    // =========================================================================
    // カスタムエラー
    // =========================================================================

    error ZeroAddress();
    error ZeroAmount();
    error InvalidDuration();
    error CliffExceedsDuration();
    error InsufficientTokens(uint256 requested, uint256 available);
    error ScheduleNotFound(bytes32 scheduleId);
    error NotBeneficiary();
    error NotRevocable();
    error AlreadyRevoked();
    error NothingToRelease();

    // =========================================================================
    // コンストラクタ
    // =========================================================================

    /**
     * @notice コントラクトの初期化
     * @param tokenAddress ベスティング対象のトークンアドレス
     * @param admin 管理者アドレス (Ownable)
     */
    constructor(address tokenAddress, address admin) Ownable(admin) {
        if (tokenAddress == address(0)) revert ZeroAddress();
        token = IERC20(tokenAddress);
    }

    // =========================================================================
    // スケジュール管理
    // =========================================================================

    /**
     * @notice 新しいベスティングスケジュールを作成する
     * @dev 事前にこのコントラクトにトークンを送付しておく必要がある
     * @param beneficiary 受益者アドレス
     * @param totalAmount 付与トークン総量
     * @param start ベスティング開始タイムスタンプ (0 = block.timestamp)
     * @param cliffDuration クリフ期間 (秒)
     * @param duration 総ベスティング期間 (秒)
     * @param revocable 管理者による取消が可能かどうか
     * @return scheduleId 作成されたスケジュールのID
     */
    function createVestingSchedule(
        address beneficiary,
        uint256 totalAmount,
        uint256 start,
        uint256 cliffDuration,
        uint256 duration,
        bool revocable
    ) external onlyOwner returns (bytes32 scheduleId) {
        if (beneficiary == address(0)) revert ZeroAddress();
        if (totalAmount == 0) revert ZeroAmount();
        if (duration == 0) revert InvalidDuration();
        if (cliffDuration > duration) revert CliffExceedsDuration();

        uint256 available = token.balanceOf(address(this)) - totalAllocated;
        if (totalAmount > available) {
            revert InsufficientTokens(totalAmount, available);
        }

        if (start == 0) {
            start = block.timestamp;
        }

        scheduleId = _computeScheduleId(beneficiary, scheduleCount);
        scheduleCount++;
        totalAllocated += totalAmount;

        schedules[scheduleId] = VestingSchedule({
            beneficiary: beneficiary,
            start: start,
            cliffDuration: cliffDuration,
            duration: duration,
            totalAmount: totalAmount,
            released: 0,
            revocable: revocable,
            revoked: false
        });

        beneficiarySchedules[beneficiary].push(scheduleId);

        emit VestingScheduleCreated(
            scheduleId,
            beneficiary,
            totalAmount,
            start,
            cliffDuration,
            duration
        );
    }

    /**
     * @notice ベスト済みトークンをリリースする
     * @dev 受益者またはオーナーが実行可能
     * @param scheduleId スケジュールID
     */
    function release(bytes32 scheduleId) external nonReentrant {
        VestingSchedule storage schedule = schedules[scheduleId];
        if (schedule.beneficiary == address(0)) {
            revert ScheduleNotFound(scheduleId);
        }

        uint256 releasable = _computeReleasableAmount(schedule);
        if (releasable == 0) revert NothingToRelease();

        schedule.released += releasable;
        totalAllocated -= releasable;

        emit TokensReleased(scheduleId, schedule.beneficiary, releasable);

        token.safeTransfer(schedule.beneficiary, releasable);
    }

    /**
     * @notice ベスティングスケジュールを取消し、未ベスト分を回収する
     * @dev オーナーのみ実行可能。取消可能フラグが設定されたスケジュールのみ対象。
     * @param scheduleId スケジュールID
     */
    function revoke(bytes32 scheduleId) external onlyOwner nonReentrant {
        VestingSchedule storage schedule = schedules[scheduleId];
        if (schedule.beneficiary == address(0)) {
            revert ScheduleNotFound(scheduleId);
        }
        if (!schedule.revocable) revert NotRevocable();
        if (schedule.revoked) revert AlreadyRevoked();

        // まずベスト済み分をリリース
        uint256 releasable = _computeReleasableAmount(schedule);
        if (releasable > 0) {
            schedule.released += releasable;
            token.safeTransfer(schedule.beneficiary, releasable);
            emit TokensReleased(scheduleId, schedule.beneficiary, releasable);
        }

        // 未ベスト分を回収
        uint256 refundAmount = schedule.totalAmount - schedule.released;
        schedule.revoked = true;
        totalAllocated -= refundAmount;

        emit VestingRevoked(scheduleId, refundAmount);

        if (refundAmount > 0) {
            token.safeTransfer(owner(), refundAmount);
        }
    }

    // =========================================================================
    // ビュー関数
    // =========================================================================

    /**
     * @notice 現時点でリリース可能なトークン量を返す
     * @param scheduleId スケジュールID
     * @return リリース可能なトークン量
     */
    function computeReleasableAmount(
        bytes32 scheduleId
    ) external view returns (uint256) {
        VestingSchedule storage schedule = schedules[scheduleId];
        if (schedule.beneficiary == address(0)) {
            revert ScheduleNotFound(scheduleId);
        }
        return _computeReleasableAmount(schedule);
    }

    /**
     * @notice 特定時点でのベスト済みトークン量を返す
     * @param scheduleId スケジュールID
     * @param timestamp 参照タイムスタンプ
     * @return ベスト済みトークン量
     */
    function computeVestedAmount(
        bytes32 scheduleId,
        uint256 timestamp
    ) external view returns (uint256) {
        VestingSchedule storage schedule = schedules[scheduleId];
        if (schedule.beneficiary == address(0)) {
            revert ScheduleNotFound(scheduleId);
        }
        return _computeVestedAmount(schedule, timestamp);
    }

    /**
     * @notice 受益者のスケジュールID一覧を返す
     * @param beneficiary 受益者アドレス
     * @return スケジュールIDの配列
     */
    function getScheduleIds(
        address beneficiary
    ) external view returns (bytes32[] memory) {
        return beneficiarySchedules[beneficiary];
    }

    // =========================================================================
    // 内部関数
    // =========================================================================

    /**
     * @dev リリース可能量を計算する (ベスト済み - リリース済み)
     */
    function _computeReleasableAmount(
        VestingSchedule storage schedule
    ) internal view returns (uint256) {
        if (schedule.revoked) return 0;
        return
            _computeVestedAmount(schedule, block.timestamp) -
            schedule.released;
    }

    /**
     * @dev 特定時点でのベスト済み量を計算する
     *      - クリフ前: 0
     *      - ベスティング期間中: 線形比例
     *      - ベスティング完了後: 全量
     */
    function _computeVestedAmount(
        VestingSchedule storage schedule,
        uint256 timestamp
    ) internal view returns (uint256) {
        if (timestamp < schedule.start + schedule.cliffDuration) {
            return 0;
        }

        uint256 elapsed = timestamp - schedule.start;

        if (elapsed >= schedule.duration) {
            return schedule.totalAmount;
        }

        return (schedule.totalAmount * elapsed) / schedule.duration;
    }

    /**
     * @dev スケジュールIDを計算する
     */
    function _computeScheduleId(
        address beneficiary,
        uint256 index
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(beneficiary, index));
    }
}
