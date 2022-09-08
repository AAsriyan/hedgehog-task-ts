import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import { sendTokens } from "../../utils/helpers";
import Modal from "../../UI/Modal";

import styles from "../../styles/Home.module.css";

interface SendTokensProp {
	onClose: () => void;
	mint: PublicKey;
	tokenAccountPubkey: PublicKey;
}

const SendTokens = ({ onClose, mint, tokenAccountPubkey }: SendTokensProp) => {
	const { connection } = useConnection();
	const wallet = useAnchorWallet();

	const sendTokensHandler = async (e: any) => {
		e.preventDefault();
		const amount = e.target.amount.value;
		const recipientAddress = e.target.recipient.value;

		try {
			if (!wallet || !connection) {
				return;
			}
			await sendTokens(
				connection,
				wallet,
				tokenAccountPubkey,
				recipientAddress,
				mint,
				amount
			);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<Modal onClose={onClose}>
			<form onSubmit={sendTokensHandler}>
				<div className={styles.label}>
					<label htmlFor="recipient" className={styles["label-fields"]}>
						Recipient:
					</label>
					<input
						id="recipient"
						type="text"
						className={styles.input}
						placeholder="Enter Recipient PublicKey"
						required
					/>
				</div>
				<div className={styles.label}>
					<label htmlFor="amount" className={styles["label-fields"]}>
						Amount of Tokens to Mint:
					</label>
					<input
						id="amount"
						type="text"
						className={styles.input}
						placeholder="e.g. 100"
						required
					/>
				</div>
				<div>
					<button className={styles["button-confirm"]} type="submit">
						Send Tokens
					</button>
				</div>
			</form>
		</Modal>
	);
};
export default SendTokens;
