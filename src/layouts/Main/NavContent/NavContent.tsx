import scss from './NavContent.style.module.scss';

const NavContent = () => 
{
	return (
		<nav className={scss.nav_content}>
			<ul className={scss.nav_content__list}>
				<li><a>Строительно-монтажные работы</a></li>
			</ul>
		</nav>
	);
};

export default NavContent;
