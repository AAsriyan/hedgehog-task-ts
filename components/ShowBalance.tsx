import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { FC } from "react";

const ShowBalance: FC<{ balance: number }> = ({ balance }) => {
	return (
		<div>
			<h2>{`SOL Balance: ${balance / LAMPORTS_PER_SOL}`}</h2>
		</div>
	);
};

export default ShowBalance;
