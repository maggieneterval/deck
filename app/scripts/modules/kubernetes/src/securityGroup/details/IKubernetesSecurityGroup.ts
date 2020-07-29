import { IMoniker, ISecurityGroupDetail } from '@spinnaker/core';

export interface IKubernetesSecurityGroup extends ISecurityGroupDetail {
  account: string;
  kind: string;
  displayName: string;
  moniker: IMoniker;
  namespace: string;
}
