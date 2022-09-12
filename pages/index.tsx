import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import Head from "next/head";
import NavBar from "../components/NavBar";
import CreateMint from "../components/Mints/CreateMint";
import ShowBalance from "../components/ShowBalance";
import SendAndReceive from "../components/SendAndReceive";
import SendSol from "../components/Tokens/SendSol";
import CreateTokenAccount from "../components/Mints/CreateTokenAccount";
import TokenList from "../components/Tokens/TokenList";
import Card from "../UI/Card";
import styles from "../styles/Home.module.css";
import { Fragment } from "react";

const Home: NextPage = () => {
	const [isCreatingTokenAccount, setIsCreatingTokenAccount] = useState(false);
	const [balance, setBalance] = useState(0);
	const [userPublicKey, setUserPublicKey] = useState("");
	const [isSendingSol, setIsSendingSol] = useState(false);
	const [isRefresh, setIsRefresh] = useState(false);

	const { connection } = useConnection();
	const { publicKey } = useWallet();

	useEffect(() => {
		if (!connection || !publicKey) {
			return;
		}
		setUserPublicKey(publicKey.toBase58());

		connection.getAccountInfo(publicKey).then((info) => {
			setBalance(info?.lamports ?? 0);
		});
	}, [connection, publicKey, isRefresh]);

	const toggleSendHandler = () => {
		setIsSendingSol((prevSendingState: boolean) => !prevSendingState);
	};

	const toggleCreatingAccountHandler = () => {
		setIsCreatingTokenAccount(
			(prevCreatingTokenAccountState) => !prevCreatingTokenAccountState
		);
	};

	const copyTextHandler = async (copiedText: string) => {
		await navigator.clipboard.writeText(copiedText);
	};

	const walletNotConnected = (
		<Card>
			<div className={styles["connect-wallet"]}>
				<h2>Connect Your Wallet</h2>
				<WalletMultiButton />
			</div>
		</Card>
	);

	const showIfWalletConnected = (
		<Fragment>
			<CreateMint />
			{isCreatingTokenAccount && (
				<CreateTokenAccount onClose={toggleCreatingAccountHandler} />
			)}
			<div className={styles["label-fields"]}>
				<button
					className={styles["button-main"]}
					onClick={toggleCreatingAccountHandler}
				>
					Create Token Account
				</button>
			</div>
			<ShowBalance balance={balance} />
			<SendAndReceive
				userWalletKey={userPublicKey}
				copyText={copyTextHandler}
				toggle={toggleSendHandler}
			/>
			{isSendingSol && (
				<SendSol
					onClose={toggleSendHandler}
					refresh={() => setIsRefresh((prevState) => !prevState)}
				/>
			)}
			<TokenList copyText={copyTextHandler} />
		</Fragment>
	);
	return (
		<div className={styles.App}>
			<Head>
				<title>Hedgehog Task</title>
			</Head>
			<div>
				<NavBar />
			</div>
			{publicKey ? showIfWalletConnected : ""}
			{publicKey ? "" : walletNotConnected}
		</div>
	);
};

export default Home;
