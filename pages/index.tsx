import type { NextPage } from "next";
import Head from "next/head";
import NavBar from "../components/NavBar";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
	return (
		<div className={styles.App}>
			<Head>
				<title>Hedgehog Task</title>
			</Head>
			<div>
				<NavBar />
			</div>
		</div>
	);
};

export default Home;
