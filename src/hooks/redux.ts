import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux'
import { IRootState, IDispatch } from '../store/store'

export const useTypedSelector: TypedUseSelectorHook<IRootState> = useSelector
export const useTypedDispatch: () => IDispatch = useDispatch