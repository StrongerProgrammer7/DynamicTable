import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import scss from './simplemodal.module.scss';
import React,{ useEffect,useState } from 'react';
import ReactDOM from 'react-dom';

const style = {

};
interface ISimpleModal
{
	message: string;
	title: string;
	clearMessageAfterClose: () => void;
}

const SimpleModal: React.FC<ISimpleModal> = ({ message,title,clearMessageAfterClose }) =>
{
	const [isOpen,setIsOpen] = useState<boolean>(false);

	const handleOpen = () => setIsOpen(true);
	const handleClose = () => setIsOpen(false);

	useEffect(() =>
	{
		if (message.length > 0)
		{
			handleOpen();
		}
		else
		{
			clearMessageAfterClose();
			handleClose();
		}
	},[message]);
	return ReactDOM.createPortal(
		<div>
			<Modal
				open={isOpen}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"

			>
				<Box sx={style} className={scss.simple_modal}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						{title}
					</Typography>
					<Typography id="modal-modal-description" sx={{ mt: 2 }} className={scss.modal__text}>
						{message}
					</Typography>
				</Box>
			</Modal>
		</div>,document.getElementById('modal-root')!
	);
};

export default SimpleModal;


