import axios,{ AxiosRequestConfig,InternalAxiosRequestConfig } from "axios";

import { BASE_URL } from "../utils/consts";

const api = axios.create(
	{
		baseURL: BASE_URL
	}
);


export async function getDataAxios(url: string)
{
	try
	{
		return await api.get(url);
	}
	catch (error)
	{
		throw ({
			message: "Error with get data axios",
			error
		});
	}
}

export async function postDataAxios(url: string,data: object,config: AxiosRequestConfig<object> = {})
{
	try
	{
		return await api.post(url,data,config);
	}
	catch (error)
	{
		throw ({
			message: "Error with post data axios",
			error
		});
	}
}

export async function deleteDataAxios(url: string)
{
	try
	{
		return await api.delete(url);
	}
	catch (error)
	{
		throw ({
			message: "Error with delete data axios",
			error
		});
	}
}


export default api;
