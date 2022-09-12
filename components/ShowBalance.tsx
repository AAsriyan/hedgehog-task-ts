import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { FC } from "react";

import styles from "../styles/NavBar.module.css";

const ShowBalance: FC<{ balance: number }> = ({ balance }) => {
	return (
		<div>
			<h2 className={styles["title-text"]}>{`SOL Balance: ${
				balance / LAMPORTS_PER_SOL
			}`}</h2>
		</div>
	);
};

export default ShowBalance;
