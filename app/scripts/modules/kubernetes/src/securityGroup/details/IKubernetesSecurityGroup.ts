import { IMoniker, ISecurityGroupDetail } from '@spinnaker/core';

export interface IKubernetesSecurityGroup extends ISecurityGroupDetail {
  account: string;
  kind: string;
  moniker: IMoniker;
  namespace: string;
}
