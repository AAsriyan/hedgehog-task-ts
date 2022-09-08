import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";

import Modal from "../../UI/Modal";
import styles from "../../styles/Home.module.css";

interface SendSolProps {
	refresh: () => void;
	onClose: () => void;
}

const SendSol = ({ refresh, onClose }: SendSolProps) => {
	const { connection } = useConnection();
	const { publicKey, sendTransaction } = useWallet();

	const sendSolToken = async (e: any) => {
		e.preventDefault();
		if (!connection || !publicKey) {
			return;
		}
		const transaction = new web3.Transaction();
		const recipientPubkey = new web3.PublicKey(e.target.recipient.value);

		const sendSolInstruction = web3.SystemProgram.transfer({
			fromPubkey: publicKey,
			toPubkey: recipientPubkey,
			lamports: web3.LAMPORTS_PER_SOL * e.target.amount.value
		});

		transaction.add(sendSolInstruction);
		// using set timeout just to make sure the transaction went out before updating the balance.
		await sendTransaction(transaction, connection);

		setTimeout(() => {
			refresh();
		}, 1000);
	};

	return (
		<Modal onClose={onClose}>
			<form onSubmit={sendSolToken}>
				<div className={styles.label}>
					<label className={styles["label-fields"]} htmlFor="amount">
						Amount to send:
					</label>
					<input
						id="amount"
						type="text"
						className={styles.input}
						placeholder="e.g. 0.1"
						required
					/>
				</div>
				<div className={styles.label}>
					<label className={styles["label-fields"]} htmlFor={"recipient"}>
						Send SOL to:
					</label>
					<input
						id="recipient"
						type="text"
						className={styles.input}
						placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA"
						required
					/>
				</div>
				<div>
					<button className={styles["button-confirm"]} type="submit">
						Send
					</button>
				</div>
			</form>
		</Modal>
	);
};

export default SendSol;
