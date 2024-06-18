import { FC } from 'react';
import scss from './simpleinput.module.scss';
import { isDigitKeyDow } from './SimpeInput.service';

interface ISimpleInput
{
	name: string;
	value: string;
	onChange: (e: HTMLInputElement) => void;
}
const SimpleInput: FC<ISimpleInput> = ({ name,value,onChange }) =>
{
	return (
		<input
			type='text'
			name={name}
			defaultValue={value}
			className={`${scss.row__input} ${value.length === 0 ? scss.row__input_empty : ''}`}
			onKeyDown={(e) =>
			{
				if (['salary','equipmentCosts','overheads','estimatedProfit'].includes(name) && !isDigitKeyDow(e.key,value))
					e.preventDefault();
			}
			}
			onChange={(e) => onChange(e.target)} />
	);
};

export default SimpleInput;
