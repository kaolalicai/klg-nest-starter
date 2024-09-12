import { Types } from 'mongoose'
export function ObjectId(id?: string): Types.ObjectId {
  return new Types.ObjectId(id)
}
