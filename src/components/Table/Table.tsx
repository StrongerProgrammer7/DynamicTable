import { FC,FormEvent,useEffect,useState,useRef,useCallback } from 'react';
import scss from './Table.style.module.scss';
import { Row } from './components/Row/index';
import { IAxiosReponse,IEntity,IFormEntity } from 'src/utils/interfaces';
import { createEntityRowRequest,deleteChildById,deleteEntityRequest,getOldData,addNewData,updateCurrentData,updateEntityRequest,updateIndRowsAndAddElemToData,isFieldShouldBeNum } from './Table.service';
import useDebounce from 'src/hooks/useDebounce';
import SimpleModal from '../Popus/SimpleModal';

interface ITable 
{
	ths: string[];
	entities: IEntity[];
}

const Table: FC<ITable> = ({ ths,entities }) =>
{
	const [tableData,setTableData] = useState<IEntity[]>(entities);
	const [oldTableData,setOldTableData] = useState<IEntity[]>([]);
	const [isCreateMod,setIsCreateMod] = useState<boolean>(false);
	const [formData,setFormData] = useState<IFormEntity>({ id: -1,equipmentCosts: 0,estimatedProfit: 0,overheads: 0,rowName: '',salary: 0 });
	const [idRow,setIdRow] = useState<number | undefined>();
	const [indChosenRow,setIndChosenRow] = useState<number | undefined>();
	const [dataChosenRow,setDataChosenRow] = useState<IEntity | undefined>();
	const [message,setMessage] = useState<string>("");
	const tableRef = useRef<HTMLTableElement>(null);

	const clearMessage = () => setMessage("");
	useEffect(() =>
	{
		const handleKeyDown = (e: KeyboardEvent) =>
		{
			if (e.key === 'Escape')
			{
				if (isCreateMod)
					cancelCreate(oldTableData);

				setIsCreateMod(false);
				setIdRow(undefined);
				setDataChosenRow(undefined);
			}
		};

		const handleClickOutsideTable = (e: MouseEvent) =>
		{
			if (tableRef.current && !tableRef.current.contains(e.target as Node))
			{
				if (isCreateMod)
					cancelCreate(oldTableData);

				setIsCreateMod(false);
				setIdRow(undefined);
				setDataChosenRow(undefined);
			}
		};

		document.addEventListener('keydown',handleKeyDown);
		document.addEventListener('mousedown',handleClickOutsideTable);
		return () =>
		{
			document.removeEventListener('keydown',handleKeyDown);
			document.removeEventListener('mousedown',handleClickOutsideTable);
		};
	},[oldTableData]);

	const sendData = async (e: FormEvent) =>
	{
		e.preventDefault();
		setIndChosenRow(formData.ind);
		if (dataChosenRow && dataChosenRow.id)
		{
			console.log("EDIT");
			const temp = {
				...dataChosenRow,
				...formData
			};
			const result = await updateEntityRequest(formData);

			if ('error' in result)
			{
				console.log(result.error);
				setMessage("Sorry, some problem edit, try later or again now, maybe reload page?");
				setTableData([...tableData]);
				setIndChosenRow(undefined);
				setDataChosenRow(undefined);
				setIdRow(undefined);
				setOldTableData([]);
				return;
			}

			const changed: IEntity[] = (result as IAxiosReponse).changed;
			setTableData(updateCurrentData(tableData,temp,changed));


		} else
		{
			console.log(formData);
			const result = await createEntityRowRequest(formData);

			if ('error' in result)
			{
				console.log(result.error);
				setMessage("Sorry, some problem create, try later or again now, maybe reload page?");
				setTableData([...tableData]);
				setIndChosenRow(undefined);
				setDataChosenRow(undefined);
				setIdRow(undefined);
				setOldTableData([]);
				return;
			}

			const changed: IEntity[] = (result as IAxiosReponse).changed;
			const current: IEntity = (result as IAxiosReponse).current;
			const data: IEntity =
			{
				...current,
				child: [],
				parentId: formData.id,
				ind: formData.ind,
				level: formData.level
			};
			const newData = addNewData(tableData,changed,data);
			setTableData(newData);
			setIsCreateMod(false);
		}

		setIndChosenRow(undefined);
		setDataChosenRow(undefined);
		setIdRow(undefined);
		setOldTableData([]);
	};

	const handleChangeInput = (e: HTMLInputElement) =>
	{
		const { name,value } = e;

		if (isFieldShouldBeNum(name) && value.length !== 0 && !/^\d+(.|,)?\d*$/gm.test(value))
			return;
		setFormData((prev) => ({ ...prev,[name]: value }));
	};

	const debounced = useDebounce(handleChangeInput,100);
	const cancelCreate = useCallback((oldTableData: IEntity[]) =>
	{
		setTableData(getOldData(oldTableData));
		setOldTableData([]);
	},[oldTableData,tableData]);

	const editRow = useCallback((data: IEntity) =>
	{
		if (oldTableData.length > 0 || idRow || !data.id || isCreateMod)
			return;
		setIdRow(data.id);
		setDataChosenRow(data);
		setFormData({ id: data.id,equipmentCosts: data.equipmentCosts,estimatedProfit: data.estimatedProfit,overheads: data.overheads,rowName: data.rowName,salary: data.salary,ind: data.ind });
	},[oldTableData,idRow,tableData]);

	const deleteRow = async (id: number) =>
	{
		if (oldTableData.length > 0 || idRow || isCreateMod)
			return;
		const result = await deleteEntityRequest(id);
		if ('error' in result)
		{
			console.log(result);
			setMessage("Sorry, some problem with delete, try later or again now, maybe reload page?");
			return;
		}

		const changed: IEntity[] = (result as IAxiosReponse).changed;
		setTableData(deleteChildById(tableData,id,changed));
	};


	const createRow = useCallback((parentId?: number,level?: number) =>
	{
		if (oldTableData.length > 0 || idRow || isCreateMod)
			return;
		setIsCreateMod(true);
		const newEmptyData: IEntity =
		{
			level: level,
			child: [],
			equipmentCosts: 0,
			estimatedProfit: 0,
			overheads: 0,
			rowName: '',
			salary: 0,
			parentId: parentId,
			ind: -1
		};

		setOldTableData([...tableData]);

		const data = updateIndRowsAndAddElemToData(tableData,newEmptyData);

		setFormData({ id: parentId,equipmentCosts: newEmptyData.equipmentCosts,estimatedProfit: newEmptyData.estimatedProfit,overheads: newEmptyData.overheads,rowName: newEmptyData.rowName,salary: newEmptyData.salary,ind: data.indNewElem,level: level });

		setTableData(data.tableData);
	},[oldTableData,idRow,tableData]);


	const renderRows = (): JSX.Element[] =>
	{
		const rows: JSX.Element[] = [];
		const stack: { row: IEntity,level: number,parentId: number | undefined; }[] = tableData.map((data) => ({ row: data,level: 0,parentId: undefined }));
		let ind = 0;
		while (stack.length > 0)
		{
			const { row,level,parentId } = stack.pop()!;

			rows.push(
				<Row
					data={{ ...row,parentId: parentId }}
					handleChangeInput={debounced}
					level={level}
					idRow={idRow}
					formData={formData}
					key={row.id ?? 'row-'}
					edit={editRow}
					create={createRow}
					deleted={deleteRow}
					countChild={row.child?.length ?? 0}
					indRow={ind}
					indChooseRow={indChosenRow}

				/>
			);
			ind++;
			if (!row.child)
				continue;
			row.child.map((elem) =>
			{
				stack.push({ row: elem,level: level + 1,parentId: row?.id });
			});

		}
		return rows;
	};

	return (
		<>
			<form onSubmit={sendData}>
				<table className={scss.table} ref={tableRef}>
					<thead>
						<tr>
							{
								ths.map((th,ind) =>
								(
									<th key={`th-${ind}`}>{th}</th>
								))
							}
						</tr>
					</thead>
					<tbody>
						{renderRows()}
					</tbody>

				</table>
				<button type='submit'></button>
			</form>
			<button className={scss.btn_created_row} onClick={() => createRow()}>Создать ряд 0&nbsp;уровня</button>
			<SimpleModal
				title='Message for you'
				message={message}
				clearMessageAfterClose={clearMessage}
			/>
		</>
	);
};

export default Table;
