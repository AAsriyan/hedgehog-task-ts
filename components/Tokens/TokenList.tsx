import { useEffect, useState } from "react";
import { TOKEN_PROGRAM_ID, AccountLayout, RawAccount } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import Card from "../../UI/Card";
import Token from "./Token";
import { PublicKey } from "@solana/web3.js";

interface TokenListProps {
	copyText: (string: string) => void;
}

export type TokenItem = {
	pubkey: PublicKey;
	account: RawAccount;
};

const TokenList = ({ copyText }: TokenListProps) => {
	const [tokenList, setTokenList] = useState<TokenItem[]>([]);
	const { connection } = useConnection();
	const { publicKey } = useWallet();

	useEffect(() => {
		if (!publicKey) {
			return;
		}
		const getTokenList = async () => {
			const tokenAccounts = await connection.getTokenAccountsByOwner(
				publicKey,
				{
					programId: TOKEN_PROGRAM_ID
				}
			);

			const parsedTokenAccounts = tokenAccounts.value.map((token) => {
				const accountData = AccountLayout.decode(
					Buffer.from(token.account.data)
				);

				return {
					pubkey: token.pubkey,
					account: accountData
				};
			});

			setTokenList(parsedTokenAccounts);
		};

		getTokenList();
	}, [connection, publicKey]);

	return (
		<Card>
			{tokenList.map((token) => {
				return (
					<Token
						key={token.pubkey.toBase58()}
						tokenInfo={token}
						copyText={copyText}
					/>
				);
			})}
		</Card>
	);
};

export default TokenList;
