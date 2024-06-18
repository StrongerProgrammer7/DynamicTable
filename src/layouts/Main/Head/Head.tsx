import arrow from "src/images/arrow.png";
import cubic from "src/images/cubic.png";
import scss from './Head.style.module.scss';

const Head = () =>
{
	return (
		<header className={scss.header}>
			<nav>
				<ul className={scss.header_list}>
					<li className={scss.list__li}><img src={cubic} alt="cubics" /></li>
					<li className={scss.list__li}><img src={arrow} alt="arr" /></li>
					<li className={scss.list__li}><a className={scss.active}>Просмотр</a></li>
					<li className={scss.list__li}><a>Управление</a></li>
				</ul>
			</nav>
		</header>
	);
};

export default Head;
