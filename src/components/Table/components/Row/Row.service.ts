import { IEntity } from "src/utils/interfaces";


export const getHeight = (child: Array<IEntity | null>): number =>
{
	const stack = [...child.filter((elem) => elem !== null)];
	let count = stack.length;

	while (stack.length > 0)
	{
		const row = stack.pop()!;
		if (stack.length === 0)
			break;
		if (!row.child)
			continue;

		for (let i = 0; i < row?.child.length; i++)
		{
			const elem = row.child[i];
			count++;
			stack.push(elem);
		}
	}
	return count;
};


export const getWidth = (level: number): number =>
{
	if (level === 0)
		return 10;
	if (level === 1)
		return 36;
	return 36 + 27 * (level - 1);
};

export function isSubmitData(indRow: number,indChooseRow?: number): boolean
{
	if (!indChooseRow)
		return false;
	return indRow === indChooseRow;
}
