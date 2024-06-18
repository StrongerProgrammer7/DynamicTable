import blocks from 'src/images/blocks.png';
import nav_arrow from 'src/images/navArrow.png';
import scss from './Sidebar.style.module.scss';

const Sidebar = () => 
{
	const data = [
		'По проекту','Объекты','РД','МТО','СМР','График','МиМ','Рабочие','Капвложения','Бюджет','Финансирование','Панорамы','Камеры','Поручения','Контрагенты'
	];

	return (
		<section className={scss.sidebar}>
			<nav className={scss.sidebar_nav}>
				<div className={scss.nav__content}>
					<p className={scss.nav__content_title}>Название проекта</p>
					<span className={scss.nav__content_subtitle}>Аббревиатура</span>
				</div>
				<div className={scss.nav__content_arrow}>
					<img src={nav_arrow} alt="nav_arrow" />
				</div>
			</nav>
			<div className={scss.sidebar_content}>
				{
					data.map((elem,ind) => (
						<div
							key={`sideber-data-${ind}`}
							className={scss.content_wrapper}>
							<img src={blocks} alt='blocks' />
							<a>{elem}</a>
						</div>
					))
				}
			</div>
		</section>
	);
};

export default Sidebar;
