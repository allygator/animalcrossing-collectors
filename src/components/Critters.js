import React, { useContext, useState, useEffect } from "react";
import { FirebaseContext } from "./Firebase";
import allCritters from "../allCritters";
import UserContext from "./UserContext";
import Item from "./Item";
import cx from "clsx";

var types = ["", "bugs", "fish", "all"];

function Critters(props) {
  const firebase = useContext(FirebaseContext);
  const userData = useContext(UserContext);
  const [critters, setCritters] = useState([]);
  const [collection, setCollection] = useState({});
  const [useLocal, setLocal] = useState(true);
  let type = props.type;
  let specific = props.specific;
  let hemisphere = props.hemisphere;
  let sort = props.sort;
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
    } else {
      setLocal(true);
    }
  }, [firebase, userData]);

  //Get specific critter data based on what the user selected
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
      switch (type) {
        //User selected "all critters"
        case 3:
          firebase.db
            .collection("bugs")
            .where(monthQuery, "==", true)
            .where(timeQuery, "==", true)
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                itemHolder.push(doc.data());
              });
            })
            .then(function () {
              firebase.db
                .collection("fish")
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
            });
          break;
        //User selected "bugs"
        case 1:
          firebase.db
            .collection("bugs")
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
          break;
        //User selected "fish"
        case 2:
          firebase.db
            .collection("fish")
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
          break;
        //All Month
        case 4:
          firebase.db
            .collection("bugs")
            .where(monthQuery, "==", true)
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                itemHolder.push(doc.data());
              });
            })
            .then(function () {
              firebase.db
                .collection("fish")
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
            });
          break;
        default:
          break;
      }
    } else {
      itemHolder = allCritters;
      switch (type) {
        //User selected "all critters"
        case 3:
          itemHolder = itemHolder.filter((a) => {
            let month;
            let hour = date.getHours();
            if (loc.includes("Months")) {
              month =
                a.Months[date.toLocaleString("default", { month: "long" })];
            } else {
              month =
                a.Southern[date.toLocaleString("default", { month: "long" })];
            }
            return month && a.Time[hour];
          });
          setCritters(itemHolder);
          toggleLoading(false);
          break;
        //User selected "bugs"
        case 1:
          itemHolder = itemHolder.filter((a) => {
            let month;
            let hour = date.getHours();
            if (loc.includes("Months")) {
              month =
                a.Months[date.toLocaleString("default", { month: "long" })];
            } else {
              month =
                a.Southern[date.toLocaleString("default", { month: "long" })];
            }
            return !Object.keys(a).includes("Shadow") && month && a.Time[hour];
          });
          setCritters(itemHolder);
          toggleLoading(false);
          break;
        //User selected "fish"
        case 2:
          itemHolder = itemHolder.filter((a) => {
            let month;
            let hour = date.getHours();
            if (loc.includes("Months")) {
              month =
                a.Months[date.toLocaleString("default", { month: "long" })];
            } else {
              month =
                a.Southern[date.toLocaleString("default", { month: "long" })];
            }
            return Object.keys(a).includes("Shadow") && month && a.Time[hour];
          });
          setCritters(itemHolder);
          toggleLoading(false);
          break;
        //All Month
        case 4:
          itemHolder = itemHolder.filter((a) => {
            let month;
            if (loc.includes("Months")) {
              month =
                a.Months[date.toLocaleString("default", { month: "long" })];
            } else {
              month =
                a.Southern[date.toLocaleString("default", { month: "long" })];
            }
            return month;
          });
          setCritters(itemHolder);
          toggleLoading(false);
          break;
        default:
          break;
      }
    }
    // eslint-disable-next-line
  }, [type, firebase.db, useLocal, hemisphere, specific]);

  useEffect(() => {
    let tempCritters = critters;
    if (tempCritters.length > 0) {
      //value=0, location=1, size=2, alpha=3
      switch (sort) {
        case 0:
          tempCritters.sort((a, b) => {
            if (a.Value > b.Value) {
              return 1;
            } else {
              return -1;
            }
          });
          break;
        case 1:
          tempCritters.sort((a, b) => {
            if (a.Location > b.Location) {
              return 1;
            } else {
              return -1;
            }
          });
          break;
        case 2:
          tempCritters.sort((a, b) => {
            if (a?.Shadow > b?.Shadow) {
              return 1;
            } else {
              return -1;
            }
          });
          break;
        case 3:
          tempCritters.sort((a, b) => {
            if (a.Name > b.Name) {
              return 1;
            } else {
              return -1;
            }
          });
          break;
        default:
          break;
      }
      setCritters([...tempCritters]);
    }
    // eslint-disable-next-line
  }, [sort, type]);
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
                        type={types[props.type]}
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
                      type={types[props.type]}
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
                    type={types[props.type]}
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
//
// const usePrevious = (value, initialValue) => {
//   const ref = useRef(initialValue);
//   useEffect(() => {
//     ref.current = value;
//   });
//   return ref.current;
// };
// const useEffectDebugger = (effectHook, dependencies, dependencyNames = []) => {
//   const previousDeps = usePrevious(dependencies, []);
//
//   const changedDeps = dependencies.reduce((accum, dependency, index) => {
//     if (dependency !== previousDeps[index]) {
//       const keyName = dependencyNames[index] || index;
//       return {
//         ...accum,
//         [keyName]: {
//           before: previousDeps[index],
//           after: dependency,
//         },
//       };
//     }
//
//     return accum;
//   }, {});
//
//   if (Object.keys(changedDeps).length) {
//     console.log("[use-effect-debugger] ", changedDeps);
//   }
//
//   useEffect(effectHook, dependencies);
// };

export default Critters;
