import { AxiosError } from "axios";
import { getDataAxios } from "src/http/request";
import { EID } from "src/utils/consts";
import { handleError } from "src/utils/helper";
import { IAxiosException,IAxiosReponse,IEntity } from "src/utils/interfaces";


export async function getList(): Promise<IEntity[] | IAxiosException>
{
	try 
	{
		return (await getDataAxios(`/v1/outlay-rows/entity/${EID}/row/list`)).data as IEntity[];
	}
	catch (error) 
	{
		handleError('getList','Error with get data',error);
		return {
			error: error as AxiosError
		};
	}
}


export function addLevelToData(data: IEntity[]): IEntity[]
{
	const stack: { level: number,row: IEntity; }[] = data.map((elem) => ({ level: 0,row: elem }));

	let ind = 0;

	while (stack.length > 0)
	{
		const { level,row } = stack.pop() as { level: number,row: IEntity; };

		row.ind = ind;
		row.level = level;
		ind++;

		if (!row.child)
			continue;
		stack.push(...row.child.map((elem) => ({ level: level + 1,row: elem })));
	}

	return data;
}
