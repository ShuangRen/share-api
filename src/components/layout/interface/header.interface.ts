import { ICommonStore } from '@/store/interface/common.interface';
import { RouterProps } from 'react-router';
export interface IProps extends RouterProps {
  common: ICommonStore
}