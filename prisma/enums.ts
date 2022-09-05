export enum UserType {
  /** basically no perms */
  student,
  /** can create and manage personal boards */
  teacher,
  /** can create and manage (only self-made) templates */
  designer,
  /** can change user types below admin, can manage all templates*/
  admin,
  /** can manage everything */
  owner,
}

export enum FilePermission {
  none,
  read,
  write,
}
