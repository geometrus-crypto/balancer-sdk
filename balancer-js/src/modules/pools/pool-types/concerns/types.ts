/* eslint @typescript-eslint/no-explicit-any: ["error", { "ignoreRestArgs": true }] */
import { ExitPoolRequest, JoinPoolRequest, Pool } from '@/types';
import { BigNumber } from '@ethersproject/bignumber';

export interface LiquidityConcern {
  calcTotal: (...args: any[]) => string;
}

export interface SpotPriceConcern {
  calcPoolSpotPrice: (tokenIn: string, tokenOut: string, pool: Pool) => string;
}

export interface PriceImpactConcern {
  bptZeroPriceImpact: (pool: Pool, tokenAmounts: bigint[]) => bigint;
  calcPriceImpact: (
    pool: Pool,
    tokenAmounts: string[],
    bptAmount: string,
    isJoin: boolean
  ) => string;
}

export interface JoinConcern {
  buildJoin: ({
    joiner,
    pool,
    tokensIn,
    amountsIn,
    slippage,
    wrappedNativeAsset,
  }: JoinPoolParameters) => JoinPoolAttributes;
}

export interface ExitConcern {
  /**
   * Build exit pool transaction parameters with exact BPT in and minimum token amounts out based on slippage tolerance
   * @param exiter Account address exiting pool
   * @param pool Pool being exited
   * @param bptIn BPT provided for exiting pool
   * @param slippage Maximum slippage tolerance in percentage. i.e. 0.05 = 5%
   * @param shouldUnwrapNativeAsset Indicates whether wrapped native asset should be unwrapped after exit.
   * @param wrappedNativeAsset Wrapped native asset address for network being used. Required for exiting with native asset.
   * @param singleTokenMaxOut Optional: token address that if provided will exit to given token
   * @returns transaction request ready to send with signer.sendTransaction
   */
  buildExitExactBPTIn?: ({
    exiter,
    pool,
    bptIn,
    slippage,
    shouldUnwrapNativeAsset,
    wrappedNativeAsset,
    singleTokenMaxOut,
  }: ExitExactBPTInParameters) => ExitExactBPTInAttributes;

  /**
   * Build exit pool transaction parameters with exact tokens out and maximum BPT in based on slippage tolerance
   * @param exiter Account address exiting pool
   * @param pool Pool being exited
   * @param tokensOut Tokens provided for exiting pool
   * @param amountsOut Amounts provided for exiting pool
   * @param slippage Maximum slippage tolerance in percentage. i.e. 0.05 = 5%
   * @param wrappedNativeAsset Wrapped native asset address for network being used. Required for exiting with native asset.
   * @returns transaction request ready to send with signer.sendTransaction
   */
  buildExitExactTokensOut: ({
    exiter,
    pool,
    tokensOut,
    amountsOut,
    slippage,
    wrappedNativeAsset,
  }: ExitExactTokensOutParameters) => ExitExactTokensOutAttributes;
}

export interface JoinPool {
  poolId: string;
  sender: string;
  recipient: string;
  joinPoolRequest: JoinPoolRequest;
}

export interface JoinPoolAttributes {
  to: string;
  functionName: string;
  attributes: JoinPool;
  data: string;
  value?: BigNumber;
  minBPTOut: string;
}

export interface JoinPoolParameters {
  joiner: string;
  pool: Pool;
  tokensIn: string[];
  amountsIn: string[];
  slippage: string;
  wrappedNativeAsset: string;
}

export interface ExitPool {
  poolId: string;
  sender: string;
  recipient: string;
  exitPoolRequest: ExitPoolRequest;
}

interface ExitPoolAttributes {
  to: string;
  functionName: string;
  attributes: ExitPool;
  data: string;
}

/**
 * Exit exact BPT in transaction parameters
 * @param to Address that will execute the transaction (vault address)
 * @param functionName Function name to be called (exitPool)
 * @param attributes Transaction attributes ready to be encoded
 * @param data Encoded transaction data
 * @param expectedAmountsOut Expected amounts out of exit transaction
 * @param minAmountsOut Minimum amounts out of exit transaction considering slippage tolerance
 */
export interface ExitExactBPTInAttributes extends ExitPoolAttributes {
  expectedAmountsOut: string[];
  minAmountsOut: string[];
}

/**
 * Exit exact tokens out transaction parameters
 * @param to Address that will execute the transaction (vault address)
 * @param functionName Function name to be called (exitPool)
 * @param attributes Transaction attributes ready to be encoded
 * @param data Encoded transaction data
 * @param expectedBPTIn Expected BPT into exit transaction
 * @param maxBPTIn Max BPT into exit transaction considering slippage tolerance
 */
export interface ExitExactTokensOutAttributes extends ExitPoolAttributes {
  expectedBPTIn: string;
  maxBPTIn: string;
}

export interface ExitExactBPTInParameters {
  exiter: string;
  pool: Pool;
  bptIn: string;
  slippage: string;
  shouldUnwrapNativeAsset: boolean;
  wrappedNativeAsset: string;
  singleTokenMaxOut?: string;
}

export interface ExitExactBPTInSingleTokenOutParameters {
  exiter: string;
  pool: Pool;
  bptIn: string;
  slippage: string;
  shouldUnwrapNativeAsset: boolean;
  wrappedNativeAsset: string;
  singleTokenMaxOut: string;
}

export interface ExitExactTokensOutParameters {
  exiter: string;
  pool: Pool;
  tokensOut: string[];
  amountsOut: string[];
  slippage: string;
  wrappedNativeAsset: string;
}
