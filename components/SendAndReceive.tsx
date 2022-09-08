import styles from "../styles/Home.module.css";

interface SendAndReceiveProps {
	toggle: () => void;
	copyText: (string: string) => void;
	userWalletKey: string;
}

const SendAndReceive = ({
	toggle,
	copyText,
	userWalletKey
}: SendAndReceiveProps) => {
	return (
		<div>
			<button className={styles["button-main"]} onClick={toggle}>
				Send
			</button>
			<button
				className={styles["button-main"]}
				onClick={() => copyText(userWalletKey)}
			>
				Receive
			</button>
		</div>
	);
};

export default SendAndReceive;
