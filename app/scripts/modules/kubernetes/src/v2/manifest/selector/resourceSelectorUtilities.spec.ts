import { Application, ApplicationModelBuilder } from '@spinnaker/core';

import { getFilteredClusterNames, parseSpinnakerName } from 'kubernetes/v2/manifest/selector/resourceSelectorUtilities';

describe('Resource Selector Utilities', () => {
  describe('parseSpinnakerName', () => {
    it('parses spinnaker name into `kind` and `name', () => {
      expect(parseSpinnakerName('replicaSet myApp-v000')).toEqual({
        kind: 'replicaSet',
        name: 'myApp-v000',
      });
    });
    it('handles empty input', () => {
      [null, undefined, ''].forEach(input => {
        expect(parseSpinnakerName(input)).toEqual({
          kind: null,
          name: null,
        });
      });
    });
  });
  describe('getFilteredClusterNames', () => {
    it('returns clusters that match selected account, namespace, and kind', () => {
      const application = getApplication();
      expect(getFilteredClusterNames([application], 'my-account-1', 'replicaSet', 'namespace-2', null)).toEqual([
        'replicaSet myRs',
      ]);
    });
    it('excludes Deployment-managed ReplicaSets when includeSpinnakerKinds contains only `serverGroups', () => {});
  });
});
// todo: fix these tests
function getApplication(): Application {
  const app = ApplicationModelBuilder.createApplicationForTests('myapp', {
    key: 'serverGroups',
    lazy: true,
  });
  app.serverGroups.data = [
    {
      account: 'my-account-1',
      name: 'replicaSet myRs',
      region: 'namespace-1',
    },
    {
      account: 'my-account-1',
      name: 'replicaSet myRs',
      region: 'namespace-2',
    },
    {
      account: 'my-account-1',
      name: 'wrongKind myRs',
      region: 'namespace-2',
    },
    {
      account: 'my-account-2',
      cluster: 'replicaSet myDeploymentRs',
      region: 'namespace-2',
      serverGroupManagers: ['deployment myDep'],
    },
    {
      account: 'my-account-2',
      name: 'replicaSet myOtherRs',
      region: 'namespace-1',
    },
  ];
  return app;
}
