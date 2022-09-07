import { Fragment } from "react";
import { useState, useEffect, FC, ReactNode } from "react";
import ReactDOM from "react-dom";

import styles from "../styles/Modal.module.css";

interface BackdropProps {
	onClose: () => void;
}

const Backdrop = ({ onClose }: BackdropProps) => {
	return <div className={styles.backdrop} onClick={onClose} />;
};

const ModalOverlay: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<div className={styles.modal}>
			<div className={styles.content}>{children}</div>
		</div>
	);
};

const Modal: FC<{ children: ReactNode; onClose: () => void }> = ({
	onClose,
	children
}) => {
	// need to get the document so I can use a Portal for the modal and backdrop components but it is undefined on initial render
	const [_document, set_document] = useState<any>(null);

	useEffect(() => {
		set_document(document);
	}, []);

	if (_document) {
		return (
			<Fragment>
				{ReactDOM.createPortal(
					<Backdrop onClose={onClose} />,
					_document.getElementById("modal-root")
				)}
				{ReactDOM.createPortal(
					<ModalOverlay>{children}</ModalOverlay>,
					_document.getElementById("modal-root")
				)}
			</Fragment>
		);
	} else {
		return null;
	}
};

export default Modal;
