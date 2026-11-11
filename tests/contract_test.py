import unittest, sys, types, json, importlib.util
from pathlib import Path
fake=types.ModuleType('genlayer')
fake.gl=types.SimpleNamespace(Contract=object,public=types.SimpleNamespace(write=lambda f:f,view=lambda f:f),message=types.SimpleNamespace(sender_address='0xaaa'))
fake.TreeMap=dict
sys.modules['genlayer']=fake
spec=importlib.util.spec_from_file_location('contract',Path(__file__).parents[1]/'contracts/sparebatch.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
p={'title':'Repairs','parts':[{'name':'button','stock':2},{'name':'pull','stock':1}],'jobs':[{'name':str(i)+' item','note':'This note has sufficient length.'} for i in range(4)]}
def cells(q):return [{'quantity':x,'quote':'This note'} for x in q]
class Checks(unittest.TestCase):
 def test_optimizer_avoids_greedy(self):self.assertEqual(m.solve(p,cells([2,0,1,0,1,0,0,1]))['selected'],[1,2,3])
 def test_tie_is_oldest(self):self.assertEqual(m.solve(p,cells([1,0,1,0,1,0,0,1]))['selected'],[0,1,3])
 def test_unknown_excluded(self):self.assertNotIn(1,m.solve(p,cells([2,0,-1,0,1,0,0,1]))['selected'])
 def test_bad_grounding(self):
  with self.assertRaises(AssertionError):m.validate_cells(p,[{'quantity':1,'quote':'invented'}]*8)
 def test_bool_is_not_quantity(self):
  with self.assertRaises(AssertionError):m.validate_cells(p,[{'quantity':True,'quote':'This note'}]*8)
 def test_state_inventory_conservation(self):
  c=m.SpareBatch();c.records={};c.open_session('abc',m.encode(p));key='0xaaa:abc';r=json.loads(c.records[key]);r.update(state='PLANNED',plan=m.solve(p,cells([2,0,1,0,1,0,0,1])),plan_digest='sealed');c.records[key]=m.encode(r)
  with self.assertRaises(AssertionError):c.reserve('abc','different')
  c.reserve('abc','sealed');c.finish_job('abc',1,True);c.finish_job('abc',2,False);c.finish_job('abc',3,True);r=json.loads(c.records[key]);self.assertEqual(r['state'],'CLOSED');self.assertEqual(r['available'],[1,0]);self.assertEqual(r['consumed'],[1,1])
  with self.assertRaises(AssertionError):c.finish_job('abc',1,True)
 def test_owner_namespace(self):
  c=m.SpareBatch();c.records={};c.open_session('abc',m.encode(p));fake.gl.message.sender_address='0xbbb'
  with self.assertRaises(KeyError):c.reserve('abc','x')
  fake.gl.message.sender_address='0xaaa'
if __name__=='__main__':unittest.main()
