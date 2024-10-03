import { createContext } from 'react';
import { DrawerContext as DrawerContextType } from './types';

export const DrawerContext = createContext<DrawerContextType | null>(null);
