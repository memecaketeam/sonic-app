import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';


export namespace SwapIDL {
  export interface CanisterSettings {
    'freezing_threshold': [] | [bigint],
    'controllers': [] | [Array<Principal>],
    'memory_allocation': [] | [bigint],
    'compute_allocation': [] | [bigint],
  }
  export interface CanisterStatus {
    'status': Status,
    'memory_size': bigint,
    'cycles': bigint,
    'settings': CanisterSettings,
    'module_hash': [] | [Uint8Array | number[]],
  }
  export interface CapDetails {
    'CapV2RootBucketId': [] | [string],
    'CapV1Status': boolean,
    'CapV2Status': boolean,
    'CapV1RootBucketId': [] | [string],
  }
  export interface DepositSubAccounts {
    'depositAId': string,
    'subaccount': Uint8Array | number[],
    'created_at': Time,
    'transactionOwner': Principal,
  }
  export type ICRC1SubAccountBalance = { 'ok': bigint } |
  { 'err': string };
  export type ICRCTxReceipt = { 'Ok': Uint8Array | number[] } |
  { 'Err': string };
  export interface MonitorMetrics {
    'tokenBalancesSize': bigint,
    'canisterStatus': CanisterStatus,
    'blocklistedUsersCount': bigint,
    'rewardTokensSize': bigint,
    'lptokensSize': bigint,
    'cycles': bigint,
    'tokenAllowanceSize': bigint,
    'rewardInfo': bigint,
    'lpTokenAllowanceSize': bigint,
    'rewardPairsSize': bigint,
    'tokenCount': bigint,
    'lpTokenBalancesSize': bigint,
    'pairsCount': bigint,
    'depositTransactionSize': bigint,
  }
  export interface PairInfoExt {
    'id': string,
    'price0CumulativeLast': bigint,
    'creator': Principal,
    'reserve0': bigint,
    'reserve1': bigint,
    'lptoken': string,
    'totalSupply': bigint,
    'token0': string,
    'token1': string,
    'price1CumulativeLast': bigint,
    'kLast': bigint,
    'blockTimestampLast': bigint,
  }
  export type Result = { 'ok': boolean } |
  { 'err': string };
  export type Result_1 = { 'ok': [bigint, bigint] } |
  { 'err': string };
  export interface RewardInfo { 'tokenId': string, 'amount': bigint }
  export type Status = { 'stopped': null } |
  { 'stopping': null } |
  { 'running': null };
  export interface SwapInfo {
    'owner': Principal,
    'cycles': bigint,
    'tokens': Array<TokenInfoExt>,
    'pairs': Array<PairInfoExt>,
    'commitId': string,
    'feeOn': boolean,
    'feeTo': Principal,
  }
  export interface SwapInfoExt {
    'owner': Principal,
    'txcounter': bigint,
    'depositCounter': bigint,
    'feeOn': boolean,
    'feeTo': Principal,
  }
  export type SwapLastTransaction = {
    'RemoveLiquidityOutAmount': [bigint, bigint]
  } |
  { 'SwapOutAmount': bigint } |
  { 'NotFound': boolean };
  export type Time = bigint;
  export interface TokenAnalyticsInfo {
    'fee': bigint,
    'decimals': number,
    'name': string,
    'totalSupply': bigint,
    'symbol': string,
  }
  export type TokenBlockType = { 'Full': boolean } |
  { 'None': boolean } |
  { 'Partial': boolean };
  export interface TokenInfoExt {
    'id': string,
    'fee': bigint,
    'decimals': number,
    'name': string,
    'totalSupply': bigint,
    'symbol': string,
  }
  export interface TokenInfoWithType {
    'id': string,
    'fee': bigint,
    'decimals': number,
    'name': string,
    'totalSupply': bigint,
    'blockStatus': string,
    'tokenType': string,
    'symbol': string,
  }
  export type TxReceipt = { 'ok': bigint } |
  { 'err': string };
  export interface UserInfo {
    'lpBalances': Array<[string, bigint]>,
    'balances': Array<[string, bigint]>,
  }
  export interface UserInfoPage {
    'lpBalances': [Array<[string, bigint]>, bigint],
    'balances': [Array<[string, bigint]>, bigint],
  }
  export type ValidateFunctionReturnType = { 'Ok': string } |
  { 'Err': string };
  export type WithdrawRefundReceipt = { 'Ok': boolean } |
  { 'Err': string };
  export interface WithdrawState {
    'tokenId': string,
    'refundStatus': boolean,
    'value': bigint,
    'userPId': Principal,
  }

  export interface Swap {

    'addAuth': ActorMethod<[Principal], boolean>,
    'addLiquidity': ActorMethod<
      [Principal, Principal, bigint, bigint, bigint, bigint, bigint],
      TxReceipt
    >,
    'addLiquidityForUser': ActorMethod<
      [Principal, Principal, Principal, bigint, bigint, boolean],
      TxReceipt
    >,
    'addLiquidityForUserTest': ActorMethod<
      [Principal, Principal, Principal, bigint, bigint],
      string
    >,
    'addNatLabsToken': ActorMethod<[string], boolean>,
    'addToken': ActorMethod<[Principal, string], TxReceipt>,
    'addTokenToBlocklist': ActorMethod<[Principal, TokenBlockType], boolean>,
    'addTokenToBlocklistValidate': ActorMethod<
      [Principal, TokenBlockType],
      ValidateFunctionReturnType
    >,
    'addTokenValidate': ActorMethod<
      [Principal, string],
      ValidateFunctionReturnType
    >,
    'addUserToBlocklist': ActorMethod<[Principal], boolean>,
    'allowance': ActorMethod<[string, Principal, Principal], bigint>,
    'approve': ActorMethod<[string, Principal, bigint], boolean>,
    'balanceOf': ActorMethod<[string, Principal], bigint>,
    'burn': ActorMethod<[string, bigint], boolean>,
    'createPair': ActorMethod<[Principal, Principal], TxReceipt>,
    'decimals': ActorMethod<[string], number>,
    'deposit': ActorMethod<[Principal, bigint], TxReceipt>,
    'depositTo': ActorMethod<[Principal, Principal, bigint], TxReceipt>,
    'executeFundRecoveryForUser': ActorMethod<[Principal], TxReceipt>,
    'exportBalances': ActorMethod<[string], [] | [Array<[Principal, bigint]>]>,
    'exportFaileWithdraws': ActorMethod<[], Array<[string, WithdrawState]>>,
    'exportLPTokens': ActorMethod<[], Array<TokenInfoExt>>,
    'exportPairs': ActorMethod<[], Array<PairInfoExt>>,
    'exportRewardInfo': ActorMethod<[], Array<[Principal, Array<RewardInfo>]>>,
    'exportRewardPairs': ActorMethod<[], Array<PairInfoExt>>,
    'exportSubAccounts': ActorMethod<[], Array<[Principal, DepositSubAccounts]>>,
    'exportSwapInfo': ActorMethod<[], SwapInfoExt>,
    'exportTokenTypes': ActorMethod<[], Array<[string, string]>>,
    'exportTokens': ActorMethod<[], Array<TokenInfoExt>>,
    'failedWithdrawRefund': ActorMethod<[string], WithdrawRefundReceipt>,
    'getAllPairs': ActorMethod<[], Array<PairInfoExt>>,
    'getAllRewardPairs': ActorMethod<[], Array<PairInfoExt>>,
    'getAuthList': ActorMethod<[], Array<[Principal, boolean]>>,
    'getBlockedTokens': ActorMethod<[], Array<[Principal, TokenBlockType]>>,
    'getBlocklistedUsers': ActorMethod<[], Array<[Principal, boolean]>>,
    'getCapDetails': ActorMethod<[], CapDetails>,
    'getHolders': ActorMethod<[string], bigint>,
    'getICRC1SubAccountBalance': ActorMethod<
      [Principal, string],
      ICRC1SubAccountBalance
    >,
    'getLPTokenId': ActorMethod<[Principal, Principal], string>,
    'getLastTransactionOutAmount': ActorMethod<[], SwapLastTransaction>,
    'getNatLabsToken': ActorMethod<[], Array<[string, boolean]>>,
    'getNumPairs': ActorMethod<[], bigint>,
    'getPair': ActorMethod<[Principal, Principal], [] | [PairInfoExt]>,
    'getPairs': ActorMethod<[bigint, bigint], [Array<PairInfoExt>, bigint]>,
    'getSupportedTokenList': ActorMethod<[], Array<TokenInfoWithType>>,
    'getSupportedTokenListByName': ActorMethod<
      [string, bigint, bigint],
      [Array<TokenInfoExt>, bigint]
    >,
    'getSupportedTokenListSome': ActorMethod<
      [bigint, bigint],
      [Array<TokenInfoExt>, bigint]
    >,
    'getSwapInfo': ActorMethod<[], SwapInfo>,
    'getTokenMetadata': ActorMethod<[string], TokenAnalyticsInfo>,
    'getUserBalances': ActorMethod<[Principal], Array<[string, bigint]>>,
    'getUserICRC1SubAccount': ActorMethod<[Principal], string>,
    'getUserInfo': ActorMethod<[Principal], UserInfo>,
    'getUserInfoAbove': ActorMethod<[Principal, bigint, bigint], UserInfo>,
    'getUserInfoByNamePageAbove': ActorMethod<
      [Principal, bigint, string, bigint, bigint, bigint, string, bigint, bigint],
      UserInfoPage
    >,
    'getUserLPBalances': ActorMethod<[Principal], Array<[string, bigint]>>,
    'getUserLPBalancesAbove': ActorMethod<
      [Principal, bigint],
      Array<[string, bigint]>
    >,
    'getUserReward': ActorMethod<[Principal, string, string], Result_1>,
    'historySize': ActorMethod<[], bigint>,
    'initiateICRC1Transfer': ActorMethod<[], Uint8Array | number[]>,
    'initiateICRC1TransferForUser': ActorMethod<[Principal], ICRCTxReceipt>,
    'monitorMetrics': ActorMethod<[], MonitorMetrics>,
    'name': ActorMethod<[string], string>,
    'registerFundRecoveryForUser': ActorMethod<
      [Principal, Principal, bigint],
      TxReceipt
    >,
    'removeAuth': ActorMethod<[Principal], boolean>,
    'removeLiquidity': ActorMethod<
      [Principal, Principal, bigint, bigint, bigint, Principal, bigint],
      TxReceipt
    >,
    'removeNatLabsToken': ActorMethod<[string], boolean>,
    'removeTokenFromBlocklist': ActorMethod<[Principal], boolean>,
    'removeTokenFromBlocklistValidate': ActorMethod<
      [Principal],
      ValidateFunctionReturnType
    >,
    'removeUserFromBlocklist': ActorMethod<[Principal], boolean>,
    'retryDeposit': ActorMethod<[Principal], TxReceipt>,
    'retryDepositTo': ActorMethod<[Principal, Principal, bigint], TxReceipt>,
    'setCapV1EnableStatus': ActorMethod<[boolean], boolean>,
    'setCapV2CanisterId': ActorMethod<[string], boolean>,
    'setCapV2EnableStatus': ActorMethod<[boolean], Result>,
    'setFeeForToken': ActorMethod<[string, bigint], boolean>,
    'setFeeOn': ActorMethod<[boolean], boolean>,
    'setFeeTo': ActorMethod<[Principal], boolean>,
    'setGlobalTokenFee': ActorMethod<[bigint], boolean>,
    'setMaxTokenValidate': ActorMethod<[bigint], ValidateFunctionReturnType>,
    'setMaxTokens': ActorMethod<[bigint], boolean>,
    'setOwner': ActorMethod<[Principal], boolean>,
    'swapExactTokensForTokens': ActorMethod<
      [bigint, bigint, Array<string>, Principal, bigint],
      TxReceipt
    >,
    'symbol': ActorMethod<[string], string>,
    'totalSupply': ActorMethod<[string], bigint>,
    'transferFrom': ActorMethod<[string, Principal, Principal, bigint], boolean>,
    'updateAllTokenMetadata': ActorMethod<[], boolean>,
    'updateTokenFees': ActorMethod<[], boolean>,
    'updateTokenMetadata': ActorMethod<[string], boolean>,
    'updateTokenType': ActorMethod<[Principal, string], boolean>,
    'updateTokenTypeValidate': ActorMethod<
      [Principal, string],
      ValidateFunctionReturnType
    >,
    'validateExecuteFundRecoveryForUser': ActorMethod<
      [Principal],
      ValidateFunctionReturnType
    >,
    'validateRegisterFundRecoveryForUser': ActorMethod<
      [Principal, Principal, bigint],
      ValidateFunctionReturnType
    >,
    'withdraw': ActorMethod<[Principal, bigint], TxReceipt>,
  };

  export type Factory = Swap;

  export const factory: IDL.InterfaceFactory = ({ IDL }) => {
    const TxReceipt = IDL.Variant({ 'ok': IDL.Nat, 'err': IDL.Text });
    const TokenBlockType = IDL.Variant({
      'Full': IDL.Bool,
      'None': IDL.Bool,
      'Partial': IDL.Bool,
    });
    const ValidateFunctionReturnType = IDL.Variant({
      'Ok': IDL.Text,
      'Err': IDL.Text,
    });
    const WithdrawState = IDL.Record({
      'tokenId': IDL.Text,
      'refundStatus': IDL.Bool,
      'value': IDL.Nat,
      'userPId': IDL.Principal,
    });
    const TokenInfoExt = IDL.Record({
      'id': IDL.Text,
      'fee': IDL.Nat,
      'decimals': IDL.Nat8,
      'name': IDL.Text,
      'totalSupply': IDL.Nat,
      'symbol': IDL.Text,
    });
    const PairInfoExt = IDL.Record({
      'id': IDL.Text,
      'price0CumulativeLast': IDL.Nat,
      'creator': IDL.Principal,
      'reserve0': IDL.Nat,
      'reserve1': IDL.Nat,
      'lptoken': IDL.Text,
      'totalSupply': IDL.Nat,
      'token0': IDL.Text,
      'token1': IDL.Text,
      'price1CumulativeLast': IDL.Nat,
      'kLast': IDL.Nat,
      'blockTimestampLast': IDL.Int,
    });
    const RewardInfo = IDL.Record({ 'tokenId': IDL.Text, 'amount': IDL.Nat });
    const Time = IDL.Int;
    const DepositSubAccounts = IDL.Record({
      'depositAId': IDL.Text,
      'subaccount': IDL.Vec(IDL.Nat8),
      'created_at': Time,
      'transactionOwner': IDL.Principal,
    });
    const SwapInfoExt = IDL.Record({
      'owner': IDL.Principal,
      'txcounter': IDL.Nat,
      'depositCounter': IDL.Nat,
      'feeOn': IDL.Bool,
      'feeTo': IDL.Principal,
    });
    const WithdrawRefundReceipt = IDL.Variant({
      'Ok': IDL.Bool,
      'Err': IDL.Text,
    });
    const CapDetails = IDL.Record({
      'CapV2RootBucketId': IDL.Opt(IDL.Text),
      'CapV1Status': IDL.Bool,
      'CapV2Status': IDL.Bool,
      'CapV1RootBucketId': IDL.Opt(IDL.Text),
    });
    const ICRC1SubAccountBalance = IDL.Variant({
      'ok': IDL.Nat,
      'err': IDL.Text,
    });
    const SwapLastTransaction = IDL.Variant({
      'RemoveLiquidityOutAmount': IDL.Tuple(IDL.Nat, IDL.Nat),
      'SwapOutAmount': IDL.Nat,
      'NotFound': IDL.Bool,
    });
    const TokenInfoWithType = IDL.Record({
      'id': IDL.Text,
      'fee': IDL.Nat,
      'decimals': IDL.Nat8,
      'name': IDL.Text,
      'totalSupply': IDL.Nat,
      'blockStatus': IDL.Text,
      'tokenType': IDL.Text,
      'symbol': IDL.Text,
    });
    const SwapInfo = IDL.Record({
      'owner': IDL.Principal,
      'cycles': IDL.Nat,
      'tokens': IDL.Vec(TokenInfoExt),
      'pairs': IDL.Vec(PairInfoExt),
      'commitId': IDL.Text,
      'feeOn': IDL.Bool,
      'feeTo': IDL.Principal,
    });
    const TokenAnalyticsInfo = IDL.Record({
      'fee': IDL.Nat,
      'decimals': IDL.Nat8,
      'name': IDL.Text,
      'totalSupply': IDL.Nat,
      'symbol': IDL.Text,
    });
    const UserInfo = IDL.Record({
      'lpBalances': IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)),
      'balances': IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)),
    });
    const UserInfoPage = IDL.Record({
      'lpBalances': IDL.Tuple(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)), IDL.Nat),
      'balances': IDL.Tuple(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)), IDL.Nat),
    });
    const Result_1 = IDL.Variant({
      'ok': IDL.Tuple(IDL.Nat, IDL.Nat),
      'err': IDL.Text,
    });
    const ICRCTxReceipt = IDL.Variant({
      'Ok': IDL.Vec(IDL.Nat8),
      'Err': IDL.Text,
    });
    const Status = IDL.Variant({
      'stopped': IDL.Null,
      'stopping': IDL.Null,
      'running': IDL.Null,
    });
    const CanisterSettings = IDL.Record({
      'freezing_threshold': IDL.Opt(IDL.Nat),
      'controllers': IDL.Opt(IDL.Vec(IDL.Principal)),
      'memory_allocation': IDL.Opt(IDL.Nat),
      'compute_allocation': IDL.Opt(IDL.Nat),
    });
    const CanisterStatus = IDL.Record({
      'status': Status,
      'memory_size': IDL.Nat,
      'cycles': IDL.Nat,
      'settings': CanisterSettings,
      'module_hash': IDL.Opt(IDL.Vec(IDL.Nat8)),
    });
    const MonitorMetrics = IDL.Record({
      'tokenBalancesSize': IDL.Nat,
      'canisterStatus': CanisterStatus,
      'blocklistedUsersCount': IDL.Nat,
      'rewardTokensSize': IDL.Nat,
      'lptokensSize': IDL.Nat,
      'cycles': IDL.Nat,
      'tokenAllowanceSize': IDL.Nat,
      'rewardInfo': IDL.Nat,
      'lpTokenAllowanceSize': IDL.Nat,
      'rewardPairsSize': IDL.Nat,
      'tokenCount': IDL.Nat,
      'lpTokenBalancesSize': IDL.Nat,
      'pairsCount': IDL.Nat,
      'depositTransactionSize': IDL.Nat,
    });
    const Result = IDL.Variant({ 'ok': IDL.Bool, 'err': IDL.Text });
    return IDL.Service({
      'addAuth': IDL.Func([IDL.Principal], [IDL.Bool], []),
      'addLiquidity': IDL.Func(
        [
          IDL.Principal,
          IDL.Principal,
          IDL.Nat,
          IDL.Nat,
          IDL.Nat,
          IDL.Nat,
          IDL.Int,
        ],
        [TxReceipt],
        [],
      ),
      'addLiquidityForUser': IDL.Func(
        [
          IDL.Principal,
          IDL.Principal,
          IDL.Principal,
          IDL.Nat,
          IDL.Nat,
          IDL.Bool,
        ],
        [TxReceipt],
        [],
      ),
      'addLiquidityForUserTest': IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Principal, IDL.Nat, IDL.Nat],
        [IDL.Text],
        [],
      ),
      'addNatLabsToken': IDL.Func([IDL.Text], [IDL.Bool], []),
      'addToken': IDL.Func([IDL.Principal, IDL.Text], [TxReceipt], []),
      'addTokenToBlocklist': IDL.Func(
        [IDL.Principal, TokenBlockType],
        [IDL.Bool],
        [],
      ),
      'addTokenToBlocklistValidate': IDL.Func(
        [IDL.Principal, TokenBlockType],
        [ValidateFunctionReturnType],
        [],
      ),
      'addTokenValidate': IDL.Func(
        [IDL.Principal, IDL.Text],
        [ValidateFunctionReturnType],
        [],
      ),
      'addUserToBlocklist': IDL.Func([IDL.Principal], [IDL.Bool], []),
      'allowance': IDL.Func(
        [IDL.Text, IDL.Principal, IDL.Principal],
        [IDL.Nat],
        ['query'],
      ),
      'approve': IDL.Func([IDL.Text, IDL.Principal, IDL.Nat], [IDL.Bool], []),
      'balanceOf': IDL.Func([IDL.Text, IDL.Principal], [IDL.Nat], ['query']),
      'burn': IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
      'createPair': IDL.Func([IDL.Principal, IDL.Principal], [TxReceipt], []),
      'decimals': IDL.Func([IDL.Text], [IDL.Nat8], ['query']),
      'deposit': IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
      'depositTo': IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [TxReceipt],
        [],
      ),
      'executeFundRecoveryForUser': IDL.Func([IDL.Principal], [TxReceipt], []),
      'exportBalances': IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat)))],
        ['query'],
      ),
      'exportFaileWithdraws': IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, WithdrawState))],
        ['query'],
      ),
      'exportLPTokens': IDL.Func([], [IDL.Vec(TokenInfoExt)], ['query']),
      'exportPairs': IDL.Func([], [IDL.Vec(PairInfoExt)], ['query']),
      'exportRewardInfo': IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(RewardInfo)))],
        ['query'],
      ),
      'exportRewardPairs': IDL.Func([], [IDL.Vec(PairInfoExt)], ['query']),
      'exportSubAccounts': IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, DepositSubAccounts))],
        ['query'],
      ),
      'exportSwapInfo': IDL.Func([], [SwapInfoExt], ['query']),
      'exportTokenTypes': IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
        ['query'],
      ),
      'exportTokens': IDL.Func([], [IDL.Vec(TokenInfoExt)], ['query']),
      'failedWithdrawRefund': IDL.Func([IDL.Text], [WithdrawRefundReceipt], []),
      'getAllPairs': IDL.Func([], [IDL.Vec(PairInfoExt)], ['query']),
      'getAllRewardPairs': IDL.Func([], [IDL.Vec(PairInfoExt)], ['query']),
      'getAuthList': IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Bool))],
        ['query'],
      ),
      'getBlockedTokens': IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, TokenBlockType))],
        [],
      ),
      'getBlocklistedUsers': IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Bool))],
        [],
      ),
      'getCapDetails': IDL.Func([], [CapDetails], ['query']),
      'getHolders': IDL.Func([IDL.Text], [IDL.Nat], ['query']),
      'getICRC1SubAccountBalance': IDL.Func(
        [IDL.Principal, IDL.Text],
        [ICRC1SubAccountBalance],
        [],
      ),
      'getLPTokenId': IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Text],
        ['query'],
      ),
      'getLastTransactionOutAmount': IDL.Func(
        [],
        [SwapLastTransaction],
        ['query'],
      ),
      'getNatLabsToken': IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Bool))],
        [],
      ),
      'getNumPairs': IDL.Func([], [IDL.Nat], ['query']),
      'getPair': IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Opt(PairInfoExt)],
        ['query'],
      ),
      'getPairs': IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Vec(PairInfoExt), IDL.Nat],
        ['query'],
      ),
      'getSupportedTokenList': IDL.Func(
        [],
        [IDL.Vec(TokenInfoWithType)],
        ['query'],
      ),
      'getSupportedTokenListByName': IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat],
        [IDL.Vec(TokenInfoExt), IDL.Nat],
        ['query'],
      ),
      'getSupportedTokenListSome': IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Vec(TokenInfoExt), IDL.Nat],
        ['query'],
      ),
      'getSwapInfo': IDL.Func([], [SwapInfo], ['query']),
      'getTokenMetadata': IDL.Func([IDL.Text], [TokenAnalyticsInfo], ['query']),
      'getUserBalances': IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
      'getUserICRC1SubAccount': IDL.Func([IDL.Principal], [IDL.Text], []),
      'getUserInfo': IDL.Func([IDL.Principal], [UserInfo], ['query']),
      'getUserInfoAbove': IDL.Func(
        [IDL.Principal, IDL.Nat, IDL.Nat],
        [UserInfo],
        ['query'],
      ),
      'getUserInfoByNamePageAbove': IDL.Func(
        [
          IDL.Principal,
          IDL.Int,
          IDL.Text,
          IDL.Nat,
          IDL.Nat,
          IDL.Int,
          IDL.Text,
          IDL.Nat,
          IDL.Nat,
        ],
        [UserInfoPage],
        ['query'],
      ),
      'getUserLPBalances': IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
      'getUserLPBalancesAbove': IDL.Func(
        [IDL.Principal, IDL.Nat],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
      'getUserReward': IDL.Func(
        [IDL.Principal, IDL.Text, IDL.Text],
        [Result_1],
        ['query'],
      ),
      'historySize': IDL.Func([], [IDL.Nat], ['query']),
      'initiateICRC1Transfer': IDL.Func([], [IDL.Vec(IDL.Nat8)], []),
      'initiateICRC1TransferForUser': IDL.Func(
        [IDL.Principal],
        [ICRCTxReceipt],
        [],
      ),
      'monitorMetrics': IDL.Func([], [MonitorMetrics], []),
      'name': IDL.Func([IDL.Text], [IDL.Text], ['query']),
      'registerFundRecoveryForUser': IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [TxReceipt],
        [],
      ),
      'removeAuth': IDL.Func([IDL.Principal], [IDL.Bool], []),
      'removeLiquidity': IDL.Func(
        [
          IDL.Principal,
          IDL.Principal,
          IDL.Nat,
          IDL.Nat,
          IDL.Nat,
          IDL.Principal,
          IDL.Int,
        ],
        [TxReceipt],
        [],
      ),
      'removeNatLabsToken': IDL.Func([IDL.Text], [IDL.Bool], []),
      'removeTokenFromBlocklist': IDL.Func([IDL.Principal], [IDL.Bool], []),
      'removeTokenFromBlocklistValidate': IDL.Func(
        [IDL.Principal],
        [ValidateFunctionReturnType],
        [],
      ),
      'removeUserFromBlocklist': IDL.Func([IDL.Principal], [IDL.Bool], []),
      'retryDeposit': IDL.Func([IDL.Principal], [TxReceipt], []),
      'retryDepositTo': IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [TxReceipt],
        [],
      ),
      'setCapV1EnableStatus': IDL.Func([IDL.Bool], [IDL.Bool], []),
      'setCapV2CanisterId': IDL.Func([IDL.Text], [IDL.Bool], []),
      'setCapV2EnableStatus': IDL.Func([IDL.Bool], [Result], []),
      'setFeeForToken': IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
      'setFeeOn': IDL.Func([IDL.Bool], [IDL.Bool], []),
      'setFeeTo': IDL.Func([IDL.Principal], [IDL.Bool], []),
      'setGlobalTokenFee': IDL.Func([IDL.Nat], [IDL.Bool], []),
      'setMaxTokenValidate': IDL.Func(
        [IDL.Nat],
        [ValidateFunctionReturnType],
        [],
      ),
      'setMaxTokens': IDL.Func([IDL.Nat], [IDL.Bool], []),
      'setOwner': IDL.Func([IDL.Principal], [IDL.Bool], []),
      'swapExactTokensForTokens': IDL.Func(
        [IDL.Nat, IDL.Nat, IDL.Vec(IDL.Text), IDL.Principal, IDL.Int],
        [TxReceipt],
        [],
      ),
      'symbol': IDL.Func([IDL.Text], [IDL.Text], ['query']),
      'totalSupply': IDL.Func([IDL.Text], [IDL.Nat], ['query']),
      'transferFrom': IDL.Func(
        [IDL.Text, IDL.Principal, IDL.Principal, IDL.Nat],
        [IDL.Bool],
        [],
      ),
      'updateAllTokenMetadata': IDL.Func([], [IDL.Bool], []),
      'updateTokenFees': IDL.Func([], [IDL.Bool], []),
      'updateTokenMetadata': IDL.Func([IDL.Text], [IDL.Bool], []),
      'updateTokenType': IDL.Func([IDL.Principal, IDL.Text], [IDL.Bool], []),
      'updateTokenTypeValidate': IDL.Func(
        [IDL.Principal, IDL.Text],
        [ValidateFunctionReturnType],
        [],
      ),
      'validateExecuteFundRecoveryForUser': IDL.Func(
        [IDL.Principal],
        [ValidateFunctionReturnType],
        [],
      ),
      'validateRegisterFundRecoveryForUser': IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [ValidateFunctionReturnType],
        [],
      ),
      'withdraw': IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    });
  };
}
