import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
	getMinimumBalanceForRentExemptMint,
	MINT_SIZE,
	TOKEN_PROGRAM_ID,
	createInitializeMintInstruction
} from "@solana/spl-token";
import * as web3 from "@solana/web3.js";

import styles from "../../styles/Home.module.css";

const CreateMint = () => {
	const [mint, setMint] = useState("");

	const { connection } = useConnection();
	const { publicKey, sendTransaction } = useWallet();

	const createMintHandler = async () => {
		if (!connection || !publicKey) {
			return;
		}

		const mint = web3.Keypair.generate();
		const lamports = await getMinimumBalanceForRentExemptMint(connection);

		const transaction = new web3.Transaction();

		try {
			transaction.add(
				web3.SystemProgram.createAccount({
					fromPubkey: publicKey,
					newAccountPubkey: mint.publicKey,
					space: MINT_SIZE,
					lamports,
					programId: TOKEN_PROGRAM_ID
				}),
				createInitializeMintInstruction(
					mint.publicKey,
					0,
					publicKey,
					publicKey,
					TOKEN_PROGRAM_ID
				)
			);

			await sendTransaction(transaction, connection, {
				signers: [mint]
			});
			setMint(mint.publicKey.toString());
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className={styles["label-fields"]}>
			<button className={styles["button-main"]} onClick={createMintHandler}>
				Create Mint
			</button>
			{mint && <p>Your mint has been created! {mint}</p>}
		</div>
	);
};

export default CreateMint;
