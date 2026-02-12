// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title EnablerTreasury
 * @author EnablerDAO
 * @notice EnablerDAOのトレジャリー (金庫) コントラクト。
 *         DAO所有の資金 (ETHおよびERC-20トークン) を安全に管理し、
 *         ガバナンス決議に基づいて資金の移動を実行する。
 * @dev セキュリティ機能:
 *      - AccessControl: ロールベースのアクセス制御
 *      - ReentrancyGuard: 再入攻撃防止
 *      - Pausable: 緊急時の一時停止機能
 *      - SafeERC20: 安全なトークン操作
 *
 * ロール構成:
 *   - DEFAULT_ADMIN_ROLE: ロール管理 (タイムロックに付与)
 *   - GOVERNOR_ROLE: 資金移動の実行権限 (タイムロック経由で実行)
 *   - GUARDIAN_ROLE: 緊急時の一時停止権限
 */
contract EnablerTreasury is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    /// @notice ガバナンス実行権限ロール
    bytes32 public constant GOVERNOR_ROLE = keccak256("GOVERNOR_ROLE");

    /// @notice 緊急停止権限ロール (ガーディアン)
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");

    /// @notice 単一トランザクションでのETH送金上限 (デフォルト: 100 ETH)
    uint256 public ethTransferLimit;

    /// @notice トークンごとの単一トランザクション送金上限
    mapping(address token => uint256 limit) public tokenTransferLimits;

    // =========================================================================
    // イベント
    // =========================================================================

    /// @notice ETHが入金された時に発行
    event EthReceived(address indexed sender, uint256 amount);

    /// @notice ETHが送金された時に発行
    event EthTransferred(address indexed to, uint256 amount);

    /// @notice ERC-20トークンが送金された時に発行
    event TokenTransferred(
        address indexed token,
        address indexed to,
        uint256 amount
    );

    /// @notice ETH送金上限が変更された時に発行
    event EthTransferLimitUpdated(uint256 oldLimit, uint256 newLimit);

    /// @notice トークン送金上限が変更された時に発行
    event TokenTransferLimitUpdated(
        address indexed token,
        uint256 oldLimit,
        uint256 newLimit
    );

    // =========================================================================
    // カスタムエラー
    // =========================================================================

    /// @dev ゼロアドレスへの送金を防止
    error ZeroAddress();

    /// @dev ゼロ額の送金を防止
    error ZeroAmount();

    /// @dev ETH送金上限を超えた場合
    error EthTransferLimitExceeded(uint256 amount, uint256 limit);

    /// @dev トークン送金上限を超えた場合
    error TokenTransferLimitExceeded(uint256 amount, uint256 limit);

    /// @dev ETH送金に失敗した場合
    error EthTransferFailed();

    /// @dev 残高不足の場合
    error InsufficientBalance(uint256 requested, uint256 available);

    // =========================================================================
    // コンストラクタ
    // =========================================================================

    /**
     * @notice コントラクトの初期化
     * @param timelock タイムロックコントラクトアドレス (DEFAULT_ADMIN_ROLE & GOVERNOR_ROLE)
     * @param guardian 緊急停止用のガーディアンアドレス
     * @param initialEthLimit 初期ETH送金上限 (wei単位)
     */
    constructor(
        address timelock,
        address guardian,
        uint256 initialEthLimit
    ) {
        if (timelock == address(0)) revert ZeroAddress();
        if (guardian == address(0)) revert ZeroAddress();

        _grantRole(DEFAULT_ADMIN_ROLE, timelock);
        _grantRole(GOVERNOR_ROLE, timelock);
        _grantRole(GUARDIAN_ROLE, guardian);

        ethTransferLimit = initialEthLimit;
    }

    // =========================================================================
    // ETH受取
    // =========================================================================

    /// @notice ETHの直接受取を許可
    receive() external payable {
        emit EthReceived(msg.sender, msg.value);
    }

    // =========================================================================
    // 資金移動
    // =========================================================================

    /**
     * @notice ETHを指定アドレスに送金する
     * @dev GOVERNOR_ROLEのみ実行可能。再入攻撃防止、一時停止時は実行不可。
     * @param to 送金先アドレス
     * @param amount 送金額 (wei)
     */
    function transferEth(
        address payable to,
        uint256 amount
    ) external onlyRole(GOVERNOR_ROLE) nonReentrant whenNotPaused {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        if (amount > ethTransferLimit) {
            revert EthTransferLimitExceeded(amount, ethTransferLimit);
        }
        if (amount > address(this).balance) {
            revert InsufficientBalance(amount, address(this).balance);
        }

        emit EthTransferred(to, amount);

        (bool success, ) = to.call{value: amount}("");
        if (!success) revert EthTransferFailed();
    }

    /**
     * @notice ERC-20トークンを指定アドレスに送金する
     * @dev GOVERNOR_ROLEのみ実行可能。再入攻撃防止、一時停止時は実行不可。
     * @param token トークンコントラクトアドレス
     * @param to 送金先アドレス
     * @param amount 送金額
     */
    function transferToken(
        address token,
        address to,
        uint256 amount
    ) external onlyRole(GOVERNOR_ROLE) nonReentrant whenNotPaused {
        if (token == address(0)) revert ZeroAddress();
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        uint256 limit = tokenTransferLimits[token];
        if (limit > 0 && amount > limit) {
            revert TokenTransferLimitExceeded(amount, limit);
        }

        emit TokenTransferred(token, to, amount);

        IERC20(token).safeTransfer(to, amount);
    }

    // =========================================================================
    // 設定変更 (ガバナンス経由)
    // =========================================================================

    /**
     * @notice ETH送金上限を更新する
     * @param newLimit 新しいETH送金上限 (wei)
     */
    function setEthTransferLimit(
        uint256 newLimit
    ) external onlyRole(GOVERNOR_ROLE) {
        uint256 oldLimit = ethTransferLimit;
        ethTransferLimit = newLimit;
        emit EthTransferLimitUpdated(oldLimit, newLimit);
    }

    /**
     * @notice 特定トークンの送金上限を更新する
     * @param token トークンコントラクトアドレス
     * @param newLimit 新しい送金上限 (0 = 無制限)
     */
    function setTokenTransferLimit(
        address token,
        uint256 newLimit
    ) external onlyRole(GOVERNOR_ROLE) {
        if (token == address(0)) revert ZeroAddress();
        uint256 oldLimit = tokenTransferLimits[token];
        tokenTransferLimits[token] = newLimit;
        emit TokenTransferLimitUpdated(token, oldLimit, newLimit);
    }

    // =========================================================================
    // 緊急停止 (ガーディアン)
    // =========================================================================

    /**
     * @notice コントラクトを一時停止する (緊急時)
     * @dev GUARDIAN_ROLEのみ実行可能
     */
    function pause() external onlyRole(GUARDIAN_ROLE) {
        _pause();
    }

    /**
     * @notice 一時停止を解除する
     * @dev GOVERNOR_ROLEのみ実行可能 (ガバナンス決議が必要)
     */
    function unpause() external onlyRole(GOVERNOR_ROLE) {
        _unpause();
    }

    // =========================================================================
    // ビュー関数
    // =========================================================================

    /**
     * @notice トレジャリーのETH残高を返す
     * @return ETH残高 (wei)
     */
    function ethBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice トレジャリーの特定トークン残高を返す
     * @param token トークンコントラクトアドレス
     * @return トークン残高
     */
    function tokenBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
}
