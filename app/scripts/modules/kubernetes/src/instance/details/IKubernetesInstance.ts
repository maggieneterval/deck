import { IInstance, IMoniker } from '@spinnaker/core';

export interface IKubernetesInstance extends IInstance {
  kind: string;
  namespace: string;
  moniker: IMoniker;
}
