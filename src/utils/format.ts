import { Pair, toBigNumber } from '@sonicdex/sonic-js';
import BigNumber from 'bignumber.js';

import { AppTokenMetadata } from '@/models';



export type BigNumberish = BigNumber | bigint | string | number;

BigNumber.config({ EXPONENTIAL_AT: 99 });

export const parseAmount = (val: string, decimals: string | number): bigint => {
  try {
    const fixedVal = new BigNumber(val).toFixed(Number(decimals)); // Fix for scientific notation string
    // const str = parseUnits(fixedVal, decimals).toString();
    const str = ((Number(fixedVal)) * (10 ** (Number(decimals)))).toString();
    //console.log(fixedVal,decimals, str , ((Number(fixedVal)) * (10**(Number(decimals)))).toString() );
    return BigInt(str);
  } catch (err) {
    return BigInt(0);
  }
};

export const roundBigInt = (val: BigInt, actualDecimals: string | number, roundOfdecimals: number): bigint => {
  try {
    var ad: number = parseInt(actualDecimals.toString());
    var roundedNumber = (Math.floor((Number(val) / 10 ** ad) * (10 ** roundOfdecimals)) / (10 ** roundOfdecimals)).toString();
    var tmp: number = parseFloat(roundedNumber) * (10 ** ad);
    tmp = Number(tmp.toFixed(0))
    return BigInt(tmp);
  } catch (err) {
    return BigInt(0);
  }
}

export const formatValue = (val: BigInt | number | string, decimals: number): string => {
  try {
    const valueAsBigNumber = typeof val === 'string' ? BigInt(val) : BigInt(val.toString());

    const integerPart = (valueAsBigNumber / BigInt(10 ** decimals)).toString();
    const fractionalPart = valueAsBigNumber.toString().padStart(decimals + integerPart.length, '0').slice(-decimals);

    return integerPart + (decimals > 0 ? '.' + fractionalPart : '');
  } catch (err) {
    return '0';
  }
};


export type GetValueWithoutFeesOptions = {
  value: string;
  fee: bigint;
  decimals: number;
  numberOfFees?: number;
};

export const getValueWithoutFees = ({
  value,
  fee,
  decimals,
  numberOfFees = 1,
}: GetValueWithoutFeesOptions) => {
  const _value = new BigNumber(value);
  const _feesAmount = toBigNumber(numberOfFees * Number(fee)).applyDecimals(
    decimals
  );

  return _value.minus(_feesAmount);
};

export const getMaxValue = (token?: AppTokenMetadata, balance?: number | bigint, isTransfer: boolean = false): BigNumber => {
  if (!token || !balance) return new BigNumber(0);
  var times = 1;
  if (token.tokenType == 'ICRC1' || token.tokenType == 'DIP20') {
    times = 2;
  }
  if (isTransfer) { times = 1; }

  const value = toBigNumber(Number(balance)).minus(Number(token.fee) * times);

  if (value.isNegative() || value.isZero()) {
    return new BigNumber(0);
  }

  return value.applyDecimals(token.decimals);
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getPairIdsFromPairList = (pairList: Pair.List): string[] => {
  const idsSet = new Set<string>();
  Object.values(pairList).forEach((paired) => {
    Object.values(paired).forEach((pair) => {
      idsSet.add(pair.id);
    });
  });
  return Array.from(idsSet);
};

export const getUserPailListFromPairList = (pairList: Pair.List, principalId?: any): string[] => {
  const idsSet = new Set<string>();
  Object.values(pairList).forEach(paired => {
    Object.values(paired).forEach(pair => {
      if (pair?.creator.toString() == principalId) idsSet.add(pair.id);
    })
  })
  return Array.from(idsSet);
}

