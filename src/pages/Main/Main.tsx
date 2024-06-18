import Content from 'src/layouts/Main/Content/Content';
import Head from 'src/layouts/Main/Head/Head';
import NavContent from 'src/layouts/Main/NavContent/NavContent';
import Sidebar from 'src/layouts/Main/Sidebar/Sidebar';
import scss from 'src/pages/Main/Main.style.module.scss';

const Main = () =>
{
	return (
		<main className={scss.main}>
			<Head />
			<div className={scss.main_area}>
				<Sidebar />
				<div className={scss.main_content}>
					<NavContent />
					<Content />
				</div>
			</div>
		</main>
	);
};

export default Main;
