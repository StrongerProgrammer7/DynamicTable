import { AxiosError } from "axios";

export interface IEntity
{
	child?: Array<IEntity>;
	equipmentCosts: number;
	estimatedProfit: number;
	id?: number;
	machineOperatorSalary?: number;
	mainCosts?: number;
	materials?: number;
	mimExploitation?: number;
	overheads: number;
	rowName: string;
	salary: number;
	supportCosts?: number;
	total?: number;
	parentId?: number | null;
	ind?: number;
	level?: number;
}

export interface IFormEntity
{
	id?: number;
	rowName: string;
	salary: number;
	equipmentCosts: number;
	estimatedProfit: number;
	overheads: number;
	ind?: number;
	level?: number;
}


export interface IAxiosReponse
{

	changed: IEntity[],
	current: IEntity;

}

export interface IAxiosException
{
	error?: AxiosError;
}
