import { IEntity,IFormEntity } from '../../../../utils/interfaces';

export interface IRow
{
	data: IEntity;
	level: number;
	create?: (parentId: number,level: number) => void;
	deleted?: (id: number) => void;
	idRow?: number;
	edit: (data: IEntity) => void;
	formData: IFormEntity;
	handleChangeInput: (e: HTMLInputElement) => void;
	countChild: number;
	indRow: number;
	indChooseRow?: number;

}
