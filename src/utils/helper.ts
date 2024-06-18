export function handleError(name: string,message?: string,error?: unknown)
{
	console.group("Handle Error");
	console.log(name);
	console.log(message);
	console.error(error);
	console.groupEnd();
	return (err: unknown) =>
	{
		console.error(err);
		throw err;
	};
}
