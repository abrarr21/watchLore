import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Typed version os useDispatch and useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
