import React, { useContext, useState, useEffect } from "react";
import { FirebaseContext } from "./Firebase";
import allCritters from "../allCritters";
import UserContext from "./UserContext";
import Item from "./Item";
import cx from "clsx";

function Critters(props) {
	const firebase = useContext(FirebaseContext);
	const userData = useContext(UserContext);
	const [critters, setCritters] = useState([]);
	const [collection, setCollection] = useState({});
	const [useLocal, setLocal] = useState(true);
	let type = props.type;
	let specific = props.specific;
	let hemisphere = props.hemisphere;
	let showMonth = props.showMonth;
	const toggleLoading = props.toggleLoading;
	let currentDate = new Date();

	//Get what the user has already collected/donated
	useEffect(() => {
		if (userData?.authUser) {
			setLocal(false);
			let unsubscribe = firebase.db
				.collection("users")
				.doc(userData.authUser.uid)
				.onSnapshot(
					(doc) => {
						setCollection(doc.data());
					},
					(err) => {
						console.log(err);
					}
				);
			return () => unsubscribe();
		}
	}, [firebase, userData]);

	// Get specific critter data based on what the user selected
	useEffect(() => {
		let date = new Date();
		if (specific) {
			date.setMonth(specific.month);
			if (specific.meridiem) {
				date.setHours(specific.hour + 12);
			} else {
				date.setHours(specific.hour);
			}
		}
		let loc = "Months.";
		if (!hemisphere) {
			loc = "Southern.";
		}
		let month = date.toLocaleString("default", { month: "long" });
		let monthQuery = loc + month;
		let timeQuery = "Time.".concat(date.getHours());
		var itemHolder = [];
		if (!useLocal) {
			type.forEach((element) => {
				if (showMonth) {
					firebase.db
						.collection(element.toLowerCase().replace(/-/g, ""))
						.where(monthQuery, "==", true)
						.get()
						.then(function (querySnapshot) {
							querySnapshot.forEach(function (doc) {
								itemHolder.push(doc.data());
							});
						})
						.then(function () {
							setCritters(itemHolder);
							toggleLoading(false);
						});
				} else {
					firebase.db
						.collection(element.toLowerCase().replace(/-/g, ""))
						.where(monthQuery, "==", true)
						.where(timeQuery, "==", true)
						.get()
						.then(function (querySnapshot) {
							querySnapshot.forEach(function (doc) {
								itemHolder.push(doc.data());
							});
						})
						.then(function () {
							setCritters(itemHolder);
							toggleLoading(false);
						});
				}
			});
		} else {
			itemHolder = allCritters;
			let hour = date.getHours();
			itemHolder = itemHolder.filter((a) => {
				if (showMonth) {
					console.log();
					if (loc.includes("Months")) {
						return a.Months[month];
					} else {
						return a.Southern[month];
					}
				} else {
					if (loc.includes("Months")) {
						return a.Months[month] && a.Time[hour];
					} else {
						return a.Southern[month] && a.Time[hour];
					}
				}
			});
			const allowBugs = type.includes("Bugs");
			const allowFish = type.includes("Fish");
			const allowDeep = type.includes("Deep-sea");
			itemHolder = itemHolder.filter((a) => {
				let isBug = !a.hasOwnProperty("Shadow");
				let isFish = a.hasOwnProperty("Shadow") && !a.hasOwnProperty("Pattern");
				let isDeep = a.hasOwnProperty("Pattern");
				let isReturned = false;
				if (allowBugs && isBug) {
					isReturned = true;
				} else if (allowFish && isFish) {
					isReturned = true;
				} else if (allowDeep && isDeep) {
					isReturned = true;
				}
				return isReturned;
			});
			setCritters(itemHolder);
			toggleLoading(false);
		}
	}, [type, firebase.db, useLocal, hemisphere, specific, showMonth]);

	return (
		<div className="content">
			<div id="instructions">
				{props.hemisphere ? (
					<h3>Northern Hemisphere</h3>
				) : (
					<h3>Southern Hemisphere</h3>
				)}

				{userData ? (
					<p id="full">
						Marking donated will automatically mark collected as well
					</p>
				) : (
					""
				)}
			</div>

			<div className={cx("available", props.loading && "hidden")}>
				{critters
					? critters.map(function (item) {
							let name = item.Name.toLowerCase();
							name = name.replace("'", "");
							let collected;
							let donated;
							if (userData) {
								collected = collection[name]?.[0];
								donated = collection[name]?.[1];
								if (props.hidden) {
									if (!donated) {
										return (
											<Item
												item={item}
												key={item.Name}
												currMonth={currentDate.getMonth()}
												collected={collected}
												ignore={!props.specific}
											/>
										);
									} else {
										return "";
									}
								} else {
									return (
										<Item
											item={item}
											key={item.Name}
											currMonth={currentDate.getMonth()}
											collected={collected}
											donated={donated}
											ignore={!props.specific}
										/>
									);
								}
							} else {
								return (
									<Item
										item={item}
										key={item.Name}
										currMonth={currentDate.getMonth()}
										ignore={!props.specific}
									/>
								);
							}
					  })
					: ""}
			</div>
		</div>
	);
}

export default Critters;
