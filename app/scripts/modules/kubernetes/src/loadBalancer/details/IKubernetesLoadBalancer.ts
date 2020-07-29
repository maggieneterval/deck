import { ILoadBalancer } from '@spinnaker/core';

export interface IKubernetesLoadBalancer extends ILoadBalancer {
  kind: string;
  namespace: string;
}
