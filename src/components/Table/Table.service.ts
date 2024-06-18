import { AxiosError } from "axios";
import { deleteDataAxios,postDataAxios } from "src/http/request";
import { EID } from "src/utils/consts";
import { handleError } from "src/utils/helper";
import { IAxiosException,IAxiosReponse,IEntity } from "src/utils/interfaces";

function replaceOrDelete(data: IEntity[],ind: number,newData?: IEntity)
{
	if (newData)
		data.splice(ind,1,newData);
	else
		data.splice(ind,1);
}

function updateOldData(tableData: IEntity[],data: { newData?: IEntity,id: number | undefined; })
{
	let prev = [...tableData];

	const ind = prev.findIndex((elem) => elem.id === data.id);
	if (ind > -1)
	{
		replaceOrDelete(prev,ind,data.newData);
		return prev;
	}

	const stack = [...tableData];

	while (stack.length > 0)
	{
		let row = stack.pop() as IEntity;
		if (!row.child)
			continue;

		const childInd = row.child.findIndex((elem) => elem.id === data.id);
		if (childInd > - 1)
		{
			replaceOrDelete(row.child,childInd,data.newData);
			return prev;
		}
		stack.push(...row.child);
	}

	return prev;
}

function addEmptyElemToData(tableData: IEntity[],elem: IEntity): IEntity[]
{
	if (!elem.parentId)
	{
		tableData.unshift(elem);
		return tableData;
	}
	const stack = [...tableData];

	while (stack.length > 0)
	{
		const row = stack.pop() as IEntity;

		if (row.id && row.id === elem.parentId)
		{
			if (row.child)
				row.child.unshift(elem);
			else
				row.child = [elem];
			return tableData;
		}
		if (!row.child)
			continue;
		stack.push(...row.child);
	}
	return tableData;
}

export function updateIndRowsAndAddElemToData(tableData: IEntity[],elem: IEntity): { tableData: IEntity[],indNewElem: number; }
{
	let ind = 0;
	const data = addEmptyElemToData(tableData,elem);

	const stack = [...data];

	let indNewElem = -1;

	while (stack.length > 0)
	{
		const row = stack.pop() as IEntity;

		if (row.ind === -1)
			indNewElem = ind;
		row.ind = ind;
		ind++;

		if (!row.child)
			continue;
		stack.push(...row.child);
	}
	return { tableData: data,indNewElem };
}

function updateObject(target: IEntity,source: IEntity)
{
	Object.assign(target,source);
}

function updateChildren(target: IEntity[],source: IEntity): boolean
{
	const child = target.find((elem) => elem.id === source.id);
	if (child)
	{
		updateObject(child,source);
		return true;
	}
	return false;
}
function updateChanged(prev: IEntity[],changed: IEntity[],data?: IEntity)
{
	const stack = [...prev];

	while (stack.length > 0)
	{
		const row = stack.pop() as IEntity;

		if (data && row.id === data.id)
		{
			updateObject(row,data);
			continue;
		}

		const changedEntity = changed.find((elem) => elem.id === row.id);
		if (changedEntity)
			updateObject(row,changedEntity);

		if (!row.child)
			continue;
		if (data && updateChildren(row.child,data))
			return prev;
		for (let i = 0; i < row.child.length; i++)
		{
			const child = row.child[i];

			const changedEntity = changed.find((elem) => elem.id === child.id);

			if (changedEntity)
				updateObject(child,changedEntity);

			stack.push(child);
		}
	}

	return prev;
}

function updateCurrentData(tableData: IEntity[],data: IEntity,changed: IEntity[]): IEntity[]
{
	if (!data.id)
		return tableData;

	return updateChanged(tableData,changed,data);
};

function deleteChildById(tableData: IEntity[],id: number,changed: IEntity[]): IEntity[]
{
	return updateChanged(updateOldData(tableData,{ id }),changed);
};

function getOldData(oldData: IEntity[]): IEntity[]
{
	if (oldData.length === 0)
		return [];
	return updateOldData(oldData,{ id: undefined });
}

function updateNewRowInData(tableData: IEntity[],data: IEntity)
{
	if (!data.level)
	{
		const ind = tableData.findIndex((elem) => !elem.level);
		if (ind > -1)
		{
			tableData.splice(ind,1,data);
			return tableData;
		}
	}
	const stack = [...tableData];
	while (stack.length > 0)
	{
		const row = stack.pop() as IEntity;
		if (!row.child)
			continue;
		stack.push(...row.child);
		if (row.id !== data.parentId)
			continue;
		const childInd = row.child.findIndex((elem) => !elem.id);
		if (childInd > - 1)
		{
			row.child.splice(childInd,1,data);
			return tableData;
		}

	}
	return tableData;
}

function addNewData(tableData: IEntity[],changed: IEntity[],data: IEntity): IEntity[]
{

	const stack = [...updateNewRowInData(tableData,data)];
	const newData = updateChanged(stack,changed);
	return newData;
};

async function postRequestEntity(url: string,data: IEntity): Promise<IAxiosReponse | IAxiosException>
{
	try 
	{
		const result = (await postDataAxios(url,data));
		return await result.data as IAxiosReponse;
	}
	catch (error) 
	{
		handleError('requestEntity','Error with edit data' + data.id,error);
		return {
			error: error as AxiosError
		};
	}
}
async function createEntityRowRequest(data: IEntity): Promise<IAxiosReponse | IAxiosException>
{
	const sendData: IEntity = {
		equipmentCosts: parseFloat(data.equipmentCosts.toString()),
		estimatedProfit: parseFloat(data.estimatedProfit.toString()),
		salary: parseFloat(data.salary.toString()),
		rowName: data.rowName,
		overheads: parseFloat(data.overheads.toString()),
		machineOperatorSalary: 0,
		mainCosts: 0,
		materials: 0,
		mimExploitation: 0,
		supportCosts: 0,
		total: 0,
		parentId: data.id ? data.id : null
	};

	return await postRequestEntity(`/v1/outlay-rows/entity/${EID}/row/create`,sendData);
}



async function updateEntityRequest(data: IEntity): Promise<IAxiosReponse | IAxiosException>
{
	const sendData: IEntity = {
		equipmentCosts: parseFloat(data.equipmentCosts.toString()),
		estimatedProfit: parseFloat(data.estimatedProfit.toString()),
		salary: parseFloat(data.salary.toString()),
		rowName: data.rowName,
		overheads: parseFloat(data.overheads.toString()),
		machineOperatorSalary: 0,
		mainCosts: 0,
		materials: 0,
		mimExploitation: 0,
		supportCosts: 0,
		total: 0
	};
	return await postRequestEntity(`/v1/outlay-rows/entity/${EID}/row/${data.id}/update`,sendData);
}

async function deleteEntityRequest(id: number): Promise<IAxiosReponse | IAxiosException>
{
	try
	{

		return (await deleteDataAxios(`/v1/outlay-rows/entity/${EID}/row/${id}/delete`)).data as IAxiosReponse;
	}
	catch (error)
	{
		handleError('deleteEntityRequest','Error with delete data ' + id,error);
		return {
			error: error as AxiosError
		};

	}
}


export function isFieldShouldBeNum(name: string)
{
	return name === 'salary' || name === 'equipmentCosts' || name === 'overheads' || name === 'estimatedProfit';
}
export { addNewData,updateCurrentData,deleteChildById,getOldData,updateEntityRequest,deleteEntityRequest,createEntityRowRequest };
