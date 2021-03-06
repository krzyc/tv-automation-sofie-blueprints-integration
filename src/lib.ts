export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface ObjId {
	_id: string
}
export type OmitId<T> = Omit<T & ObjId, '_id'>
