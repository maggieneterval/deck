import { IQService, IPromise } from 'angular';

import { ISecurityGroup } from '@spinnaker/core';

export class KubernetesSecurityGroupTransformer {
  public static $inject = ['$q'];
  constructor(private $q: IQService) {}

  public normalizeSecurityGroup(securityGroup: ISecurityGroup): IPromise<ISecurityGroup> {
    return this.$q.resolve(securityGroup);
  }
}
