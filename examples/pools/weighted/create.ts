import { isSameAddress, PoolType } from '@/index';
import { forkSetup } from '@/test/lib/utils';
import { WeightedPoolFactory__factory } from '@balancer-labs/typechain';
import { Interface, LogDescription } from '@ethersproject/abi';
import { Log, TransactionReceipt } from '@ethersproject/providers';
import {
  alchemyRpcUrl,
  balancer,
  balances,
  blockNumber,
  factoryAddress,
  name,
  owner,
  provider,
  signer,
  slots,
  swapFee,
  symbol,
  tokenAddresses,
  weights,
} from './example-config';

async function createWeightedPool() {
  const weightedPoolFactory = balancer.pools.poolFactory.of(PoolType.Weighted);
  await forkSetup(
    signer,
    tokenAddresses,
    slots,
    balances,
    alchemyRpcUrl,
    blockNumber,
    false
  );
  const { to, data } = weightedPoolFactory.create({
    factoryAddress,
    name,
    symbol,
    tokenAddresses,
    weights,
    swapFee,
    owner,
  });
  const signerAddress = await signer.getAddress();
  const tx = await signer.sendTransaction({
    from: signerAddress,
    to,
    data,
    gasLimit: 30000000,
  });
  await tx.wait();
  const receipt: TransactionReceipt = await provider.getTransactionReceipt(
    tx.hash
  );

  const weightedPoolFactoryInterface = new Interface(
    WeightedPoolFactory__factory.abi
  );

  const poolCreationEvent: LogDescription | null | undefined = receipt.logs
    .filter((log: Log) => {
      return isSameAddress(log.address, factoryAddress);
    })
    .map((log) => {
      return weightedPoolFactoryInterface.parseLog(log);
    })
    .find((parsedLog) => parsedLog?.name === 'PoolCreated');
  if (!poolCreationEvent) return console.error("There's no event");
  console.log('poolAddress: ' + poolCreationEvent.args.pool);
  return poolCreationEvent.args.pool;
}

export default createWeightedPool();
