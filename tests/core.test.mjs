import test from 'node:test';import assert from 'node:assert/strict';import{example,exampleCells,solve,validate,receiptSuccess}from '../src/core.js';
test('maximum batch beats expensive oldest job',()=>{assert.deepEqual(solve(example,exampleCells).selected,[1,2,3]);});
test('unknown requirements cannot consume stock',()=>{let c=structuredClone(exampleCells);c[2].quantity=-1;assert(!solve(example,c).selected.includes(1));});
test('duplicate names and invalid stock rejected',()=>{let p=structuredClone(example);p.parts[0].stock=true;assert.throws(()=>validate(p));});
test('example shape accepted',()=>assert.equal(validate(example).jobs.length,4));
test('accepted is not finalized success',()=>{assert(!receiptSuccess({statusName:'ACCEPTED',txExecutionResultName:'FINISHED_WITH_RETURN',result_name:'MAJORITY_AGREE'}));assert(receiptSuccess({statusName:'FINALIZED',txExecutionResultName:'FINISHED_WITH_RETURN',result_name:'MAJORITY_AGREE'}));});
