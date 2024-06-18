import IconText from 'src/components/svg/IconText';
import Trash from 'src/components/svg/Trash';
import { IEntity } from 'src/utils/interfaces';
import { FC,memo,useEffect,useState } from 'react';
import { getHeight,getWidth,isSubmitData } from './Row.service';

import './Row.style.scss';
import { SimpleInput } from 'src/components/UI/inputs/index';
import CircularProgress from '@mui/material/CircularProgress/CircularProgress';
import { IRow } from './Row.types';


const Row: FC<IRow> = ({ data,level,formData,idRow,countChild,indRow,indChooseRow,create,deleted,edit,handleChangeInput,}) =>
{
	const [rowData,setRowData] = useState<IEntity>(data);
	const [isEdit,setIsEdit] = useState<boolean>(false);
	const startPadding = getWidth(level);
	const heightLine = data?.child ? getHeight(data?.child) * 48 : countChild * 48;

	useEffect(() =>
	{
		if (!idRow)
			setIsEdit(false);
	},[idRow]);

	useEffect(() =>
	{
		setRowData(data);
	},[data]);
	const createChild = () =>
	{
		if (!rowData.id)
			return;
		create?.(rowData.id,level + 1);
	};

	const deletedChild = () =>
	{
		if (!rowData.id)
			return;
		deleted?.(rowData.id);
	};

	const editChild = () =>
	{
		setIsEdit(true);
		edit(rowData);
	};
	return (
		<tr className='row'>

			<td style={{ paddingLeft: `${startPadding}px` }}>
				<div className='row_icons-wrapper'>
					<div className='row_icons'>
						<a className='row_icons-text' onClick={createChild}>
							<IconText />
						</a>
						<a className='row_icons-trash' onClick={deletedChild}>
							<Trash />
						</a>

					</div>
					{
						data.child && data.child.length > 0 &&
						<div className='row_icons-line' style={{ height: heightLine }}></div>
					}
					{
						level !== 0 &&
						<div className='row_icons-line-left'></div>
					}
				</div>
			</td>
			{
				isSubmitData(indRow,indChooseRow) &&
				<>
					<td><CircularProgress color="inherit" /></td>
					<td><CircularProgress color="inherit" /></td>
					<td><CircularProgress color="inherit" /></td>
					<td><CircularProgress color="inherit" /></td>
					<td><CircularProgress color="inherit" /></td>
				</>

			}

			{
				rowData.id && idRow !== rowData.id && !isSubmitData(indRow,indChooseRow) &&
				<>
					<td onClick={() => editChild()}><p>{rowData?.rowName}</p></td>
					<td onClick={() => editChild()}><p>{rowData?.salary}</p></td>
					<td onClick={() => editChild()}><p>{rowData?.equipmentCosts}</p></td>
					<td onClick={() => editChild()}><p>{rowData?.overheads}</p></td>
					<td onClick={() => editChild()}><p>{rowData?.estimatedProfit}</p></td>
				</>

			}
			{
				(idRow === rowData.id || !rowData.id) && !isSubmitData(indRow,indChooseRow) &&
				<>
					<td>
						<SimpleInput
							name='rowName'
							value={formData.rowName}
							onChange={handleChangeInput}
						/>

					</td>
					<td>
						<SimpleInput
							name='salary'
							value={formData.salary.toString()}
							onChange={handleChangeInput}
						/>

					</td>
					<td>
						<SimpleInput
							name='equipmentCosts'
							value={formData.equipmentCosts.toString()}
							onChange={handleChangeInput}
						/>

					</td>
					<td>
						<SimpleInput
							name='overheads'
							value={formData.overheads.toString()}
							onChange={handleChangeInput}
						/>

					</td>
					<td>
						<SimpleInput
							name='estimatedProfit'
							value={formData.estimatedProfit.toString()}
							onChange={handleChangeInput}
						/>
					</td>
					<td className='row_display_none'>
						<input type='text' name="id" value={formData.id ?? -1} readOnly />
					</td>
					<td className='row_display_none'>
						<input type='text' name="ind" value={formData.ind ?? -1} readOnly />
					</td>
					<td className='row_display_none'>
						<input type='text' name="level" value={formData.level ?? -1} readOnly />
					</td>
				</>
			}
		</tr>
	);
};

export default memo(Row);
