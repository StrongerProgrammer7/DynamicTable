import scss from './Content.style.module.scss';
import { Table } from '../../../components/Table/index';
import { useEffect,useMemo,useState } from 'react';
import { IEntity } from 'src/utils/interfaces';
import CircularProgress from '@mui/material/CircularProgress/CircularProgress';
import { addLevelToData,getList } from './Content.service';
import SimpleModal from 'src/components/Popus/SimpleModal';

const Content = () =>
{
	const [data,setData] = useState<IEntity[] | undefined>();
	const [message,setMessage] = useState<string>("");
	const ths = useMemo(() =>
		(['Уровень','Наименование работ','Основная з/п','Оборудование','Накладные расходы','Сметная прибыль']),[]);

	const handleClearMessage = () => setMessage("");
	useEffect(() =>
	{
		const loadData = async (): Promise<void> =>
		{
			const result = await getList();

			if ('error' in result)
			{
				console.log('error',result.error);
				setMessage(result.error?.message || 'Unkown error, please look console(f12)');
				setData([]);
			} else
				setData(addLevelToData(result as IEntity[]));
		};
		loadData();
	},[]);
	return (
		<section className={scss.content}>
			{
				data && <Table ths={ths} entities={data} />
			}
			{
				!data && <div className={scss.loader_wrapper}><CircularProgress color="inherit" className='loader' /></div>
			}
			<SimpleModal
				title='Message for you'
				message={message}
				clearMessageAfterClose={handleClearMessage} />

		</section>
	);
};

export default Content;
