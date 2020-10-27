import {add} from '../index'

test('Index add fun',()=>{
  const ret = add(1,2)
  expect(ret).toBe(3)
})