import React, { useContext, useState, useEffect } from "react";
import { FirebaseContext } from "./Firebase";
import UserContext from "./UserContext";
import Item from "./Item";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import cx from "clsx";

var types = ["", "bugs", "fish", "all"];
var filterOptions = ["value", "location", "size (fish only)", "alpha"];

function Critters(props) {
  const firebase = useContext(FirebaseContext);
  const userData = useContext(UserContext);
  const [critters, setCritters] = useState([]);
  const [sort, setSort] = useState(3);
  const [collection, setCollection] = useState({});
  let currentDate = new Date();

  //Get what the user has already collected/donated
  useEffect(() => {
    if (userData?.authUser) {
      let unsubscribe = firebase.db
        .collection("users")
        .doc(userData.authUser.uid)
        .onSnapshot(
          doc => {
            setCollection(doc.data());
          },
          err => {
            console.log(err);
          }
        );
      return () => unsubscribe();
    } else {
      return;
    }
  }, [firebase, userData]);

  //Get specific critter data based on what the user selected
  useEffect(() => {
    let date = new Date();
    if (props.specific) {
      date.setMonth(props.specific.month);
      if (props.specific.meridiem) {
        date.setHours(props.specific.hour + 12);
      } else {
        date.setHours(props.specific.hour);
      }
    }
    let loc = "Months.";
    if (!props.hemisphere) {
      loc = "Southern.";
    }
    let month = date.toLocaleString("default", { month: "long" });
    let monthQuery = loc + month;
    let timeQuery = "Time.".concat(date.getHours());
    props.toggleLoading(false);
    var itemHolder = [];
    switch (props.type) {
      //User selected "all critters"
      case 3:
        firebase.db
          .collection("bugs")
          .where(monthQuery, "==", true)
          .where(timeQuery, "==", true)
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              itemHolder.push(doc.data());
            });
          })
          .then(function() {
            firebase.db
              .collection("fish")
              .where(monthQuery, "==", true)
              .where(timeQuery, "==", true)
              .get()
              .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                  itemHolder.push(doc.data());
                });
              })
              .then(function() {
                setCritters(itemHolder);
                props.toggleLoading(false);
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
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              itemHolder.push(doc.data());
            });
          })
          .then(function() {
            setCritters(itemHolder);
            props.toggleLoading(false);
          });
        break;
      //User selected "fish"
      case 2:
        firebase.db
          .collection("fish")
          .where(monthQuery, "==", true)
          .where(timeQuery, "==", true)
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              itemHolder.push(doc.data());
            });
          })
          .then(function() {
            setCritters(itemHolder);
            props.toggleLoading(false);
          });
        break;
      //All Month
      case 4:
        firebase.db
          .collection("bugs")
          .where(monthQuery, "==", true)
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              itemHolder.push(doc.data());
            });
          })
          .then(function() {
            firebase.db
              .collection("fish")
              .where(monthQuery, "==", true)
              .get()
              .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                  itemHolder.push(doc.data());
                });
              })
              .then(function() {
                setCritters(itemHolder);
                props.toggleLoading(false);
              });
          });
        break;
      default:
        break;
    }
  }, [props, firebase.db]);

  function updateSortVal(e) {
    setSort(e.target.value);
    sortFunc(e.target.value);
  }

  let disableFish = props.type === 1 ? true : false;

  function sortFunc(type) {
    let tempCritters = critters;
    console.log(type);
    //value=0, location=1, size=2, alpha=3
    switch (type) {
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
          console.log(a?.Shadow);
          if (a?.Shadow > b?.Shadow) {
            return 1;
          } else {
            return -1;
          }
        });
        break;
      default:
        tempCritters.sort((a, b) => {
          if (a.Value > b.Value) {
            return 1;
          } else {
            return -1;
          }
        });
        break;
    }

    console.log(tempCritters);
    setCritters([...tempCritters]);
  }

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
        <div id="sort">
          <FormControl>
            <InputLabel id="sortLabel">Sort Order</InputLabel>
            <Select
              labelId="sortLabel"
              value={sort}
              name="filter"
              onChange={updateSortVal}
            >
              {filterOptions.map((option, index) => {
                let fish = option === "size (fish only)" && disableFish;
                return (
                  <MenuItem value={index} key={option} disabled={fish}>
                    {option}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
      </div>

      <div className={cx("available", props.loading && "hidden")}>
        {critters
          ? critters.map(function(item) {
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

export default Critters;
