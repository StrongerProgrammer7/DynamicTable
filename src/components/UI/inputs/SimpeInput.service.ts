
export function isDigitKeyDow(key: string,value: string)
{
	const allowedKeys = ['0','1','2','3','4','5','6','7','8','9','.',','];
	const controlKeys = ['Backspace','Tab','ArrowLeft','ArrowRight','Delete','Enter','Escape'];

	if (!allowedKeys.includes(key) && !controlKeys.includes(key))
		return false;

	const isnum = /^\d*([.,]?\d*)?$/.test(value + key);
	if (!isnum && !controlKeys.includes(key))
		return false;
	return true;
}
