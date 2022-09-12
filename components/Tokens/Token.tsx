import { useState } from "react";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { createMintToInstruction } from "@solana/spl-token";

import SendTokens from "./SendTokens";
import { TokenItem } from "./TokenList";
import { signAndSendRawTransaction } from "../../utils/helpers";

import styles from "../../styles/Home.module.css";

interface TokenProps {
	tokenInfo: TokenItem;
	copyText: (copiedText: string) => void;
	refresh: () => void;
}

const Token = ({
	tokenInfo: { pubkey, account: accountData },
	copyText,
	refresh
}: TokenProps) => {
	const [isSendingTokens, setIsSendingTokens] = useState(false);
	const onClose = () => setIsSendingTokens(false);

	const { connection } = useConnection();
	const wallet = useAnchorWallet();

	const mintTokenHandler = async (e: any) => {
		e.preventDefault();
		if (!connection || !wallet) {
			return;
		}

		const mintPubKey = new web3.PublicKey(accountData.mint);
		const recipientPubkey = new web3.PublicKey(pubkey);

		try {
			const instruction = createMintToInstruction(
				mintPubKey,
				recipientPubkey,
				wallet.publicKey,
				100
			);
			await signAndSendRawTransaction(connection, wallet, [instruction]);
			setTimeout(() => {
				refresh();
			}, 1000);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className={styles.token}>
			<div className={styles.text}>Token: {accountData.amount.toString()}</div>
			<div className={styles.text}>Mint: {accountData.mint.toBase58()}</div>
			<div className={styles.text}>Account Public Key: {pubkey.toBase58()}</div>
			<div>
				<button
					onClick={() => setIsSendingTokens(true)}
					className={styles["button-main"]}
				>
					Send
				</button>
				<button
					onClick={() => copyText(pubkey.toBase58())}
					className={styles["button-main"]}
				>
					Receive
				</button>
				<button onClick={mintTokenHandler} className={styles["button-main"]}>
					Mint 100 Tokens
				</button>
			</div>
			{isSendingTokens && (
				<SendTokens
					onClose={onClose}
					mint={accountData.mint}
					tokenAccountPubkey={pubkey}
				/>
			)}
		</div>
	);
};

export default Token;
