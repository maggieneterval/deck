import { IServerGroup } from '@spinnaker/core';

export interface IKubernetesServerGroup extends IServerGroup {
  kind: string;
  displayName: string;
  disabled: boolean;
  namespace: string;
}
