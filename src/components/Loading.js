import React, { useState } from "react";
import Loadingsvg from "./svg/Loadingsvg";
import Header from "./Header";
import cx from "clsx";

function Loading(props) {
	const [lighting, setLight] = useState(true);
	const toggle = () => setLight(!lighting);
	return (
		<div
			className={cx("loading-page", lighting && "dark", !lighting && "light")}
		>
			<Header toggle={toggle} lighting={lighting} />
			<Loadingsvg show={true} />
			<h2>Nice find.</h2>
		</div>
	);
}

export default Loading;
