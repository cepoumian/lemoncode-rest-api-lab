import { ObjectId } from 'mongodb';
import { Role } from '#core/models/role.model.js';

export interface User {
  _id: ObjectId;
  email: string;
  password: string; // hash
  role: Role;
}
