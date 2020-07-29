import { IInstance, IMoniker } from '@spinnaker/core';

export interface IKubernetesInstance extends IInstance {
  kind: string;
  name: string;
  humanReadableName: string;
  namespace: string;
  moniker: IMoniker;
}
