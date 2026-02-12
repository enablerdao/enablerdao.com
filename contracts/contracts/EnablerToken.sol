// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title EnablerToken (ENB)
 * @author EnablerDAO
 * @notice EnablerDAOのガバナンストークン。ERC-20 Votes拡張により、
 *         オンチェーン投票権のデリゲーションをサポートする。
 * @dev OpenZeppelin Contracts 5.x ベース。
 *      - ERC20Votes: ガバナンス投票権のスナップショット機能
 *      - ERC20Permit: ガスレス承認 (EIP-2612)
 *      - ERC20Burnable: トークンバーン機能
 *      - AccessControl: ロールベースのアクセス制御
 *
 * 総供給量: 1,000,000,000 ENB (10億トークン)
 * 配分:
 *   - コミュニティ報酬:  40% (400,000,000 ENB)
 *   - 開発チーム:        20% (200,000,000 ENB) ※2年ベスティング
 *   - トレジャリー:      25% (250,000,000 ENB)
 *   - エコシステム助成:  15% (150,000,000 ENB)
 */
contract EnablerToken is
    ERC20,
    ERC20Burnable,
    ERC20Permit,
    ERC20Votes,
    AccessControl
{
    /// @notice ミンター権限を持つロール
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice 総供給量の上限 (10億 ENB)
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;

    /// @notice コミュニティ配分 (40%)
    uint256 public constant COMMUNITY_ALLOCATION = 400_000_000 * 10 ** 18;

    /// @notice 開発チーム配分 (20%)
    uint256 public constant TEAM_ALLOCATION = 200_000_000 * 10 ** 18;

    /// @notice トレジャリー配分 (25%)
    uint256 public constant TREASURY_ALLOCATION = 250_000_000 * 10 ** 18;

    /// @notice エコシステム助成配分 (15%)
    uint256 public constant ECOSYSTEM_ALLOCATION = 150_000_000 * 10 ** 18;

    /// @notice 初期ミントが完了したかどうかのフラグ
    bool public initialMintDone;

    /// @dev 総供給量の上限を超えてミントしようとした場合のエラー
    error MaxSupplyExceeded(uint256 requested, uint256 available);

    /// @dev 初期ミントが既に完了している場合のエラー
    error InitialMintAlreadyDone();

    /**
     * @notice コントラクトの初期化
     * @param admin デフォルト管理者アドレス (DEFAULT_ADMIN_ROLE)
     */
    constructor(address admin)
        ERC20("ENABLER", "ENB")
        ERC20Permit("ENABLER")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    /**
     * @notice 初期配分のミントを実行する。1回のみ実行可能。
     * @param communityWallet コミュニティ報酬用ウォレット
     * @param vestingContract 開発チーム用ベスティングコントラクト
     * @param treasury トレジャリーコントラクト
     * @param ecosystemWallet エコシステム助成用ウォレット
     */
    function mintInitialAllocation(
        address communityWallet,
        address vestingContract,
        address treasury,
        address ecosystemWallet
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (initialMintDone) revert InitialMintAlreadyDone();
        initialMintDone = true;

        _mint(communityWallet, COMMUNITY_ALLOCATION);
        _mint(vestingContract, TEAM_ALLOCATION);
        _mint(treasury, TREASURY_ALLOCATION);
        _mint(ecosystemWallet, ECOSYSTEM_ALLOCATION);
    }

    /**
     * @notice 追加ミント (ガバナンス決議が必要な場合に使用)
     * @dev MAX_SUPPLYを超えるミントは不可
     * @param to ミント先アドレス
     * @param amount ミント量
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        if (totalSupply() + amount > MAX_SUPPLY) {
            revert MaxSupplyExceeded(amount, MAX_SUPPLY - totalSupply());
        }
        _mint(to, amount);
    }

    // =========================================================================
    // オーバーライド (ERC20 / ERC20Votes / Nonces の競合解決)
    // =========================================================================

    /// @inheritdoc ERC20
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Votes) {
        super._update(from, to, value);
    }

    /// @inheritdoc Nonces
    function nonces(
        address owner
    ) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}
