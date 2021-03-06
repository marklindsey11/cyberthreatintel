import { searchClient } from '../database/engine';
import { READ_DATA_INDICES } from '../database/utils';
import { DatabaseError } from '../config/errors';
import { logApp } from '../config/conf';

export const up = async (next) => {
  logApp.info('[MIGRATION] Starting 1651939301056-workflow_rename.js');
  await searchClient()
    .updateByQuery({
      index: READ_DATA_INDICES,
      refresh: true,
      conflicts: 'proceed',
      body: {
        script: {
          params: { from: 'status_id', to: 'x_opencti_workflow_id' },
          source: 'ctx._source[params.to] = ctx._source.remove(params.from);',
        },
        query: {
          bool: {
            must: [{ exists: { field: 'status_id' } }],
          },
        },
      },
    })
    .catch((err) => {
      throw DatabaseError('Error updating elastic', { error: err });
    });
  logApp.info('[MIGRATION] 1651939301056-workflow_rename.js finished');
  next();
};

export const down = async (next) => {
  next();
};
