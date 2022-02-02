import { ENV } from '@/config';
import { TokenIDL } from '@/did';

import { CreateTransaction, MintWICP } from '../../models';

export const getMintWICPTransaction: CreateTransaction<MintWICP> = (
  options = {},
  onSuccess,
  onFail
) => {
  const { blockHeight, subaccount = [] } = options;

  return {
    canisterId: ENV.canistersPrincipalIDs.WICP,
    idl: TokenIDL.factory,
    methodName: 'mint',
    onSuccess: async (res: TokenIDL.Result) => {
      if ('Err' in res) throw new Error(JSON.stringify(Object.keys(res.Err)));
      if (onSuccess) onSuccess(res);
    },
    onFail,
    args: (prevResponses: any[]) => {
      const argBlockHeight = prevResponses?.[0]?.response;

      return [
        subaccount,
        (blockHeight && BigInt(blockHeight)) ?? argBlockHeight,
      ];
    },
  };
};
