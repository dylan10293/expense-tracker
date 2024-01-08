import Image from 'next/image';
import { ImStatsBars } from 'react-icons/im';

type Props = {};

const Header = (props: Props) => {
	return (
		<header className="container max-w-2xl p-6 mx-auto">
			<div className="flex items-center justify-between">
				{/* User info */}
				<div className="flex items-center gap-2">
					<div className="h-[40px] w-[40px] rounded-full overflow-hidden">
						<Image
							width={0}
							height={0}
							className="w-full h-full object-cover"
							src="https://thispersondoesnotexist.com/"
							alt="Display Picture"
						/>
					</div>
					<small>Hi, John Doe</small>
				</div>

				{/* Action buttons */}
				<nav className="flex items-center gap-4">
					<div>
						<ImStatsBars className="text-2xl" />
					</div>
					<div>
						<button className="btn btn-danger">Sign Out</button>
					</div>
				</nav>
			</div>
		</header>
	);
};

export default Header;
