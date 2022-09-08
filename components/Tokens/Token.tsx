import { AccountLayout } from "@solana/spl-token";
import { useState } from "react";

import SendTokens from "./SendTokens";
import styles from "../../styles/Home.module.css";
import { TokenItem } from "./TokenList";

interface TokenProps {
	tokenInfo: TokenItem;
	copyText: (copiedText: string) => void;
}

const Token = ({
	tokenInfo: { pubkey, account: accountData },
	copyText
}: TokenProps) => {
	const [isSendingTokens, setIsSendingTokens] = useState(false);
	const onClose = () => setIsSendingTokens(false);

	return (
		<div className={styles.token}>
			<div>Token: {accountData.amount.toString()}</div>
			<div>Mint: {accountData.mint.toBase58()}</div>
			<div>Account Public Key: {pubkey.toBase58()}</div>
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
