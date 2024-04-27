import React, { useEffect, useReducer, useState } from "react";
import "./NationMedalsWidget.scss";
import { IMedals } from "../interfaces/medals";
import { medalsDetails } from "../constants";
import { RUS } from "../flags";

interface NationMedalsWidgetProps {
  id: string;
  sort?: string;
}

interface INationMedals {
  code: string;
  gold: number;
  silver: number;
  bronze: number;
  total?: number;
}

const medalReducer = (
  initialState: { medals: IMedals[] },
  action: { type: string; payload: string }
) => {
  switch (action.type) {
    case "toggleIsActive":
      return {
        ...initialState,
        medals: initialState.medals.map((medal) =>
          medal.title === action.payload
            ? { ...medal, isActive: true }
            : { ...medal, isActive: false }
        ),
      };
    default:
      return initialState;
  }
};

const NationMedalsWidget: React.FC<NationMedalsWidgetProps> = (
  props: NationMedalsWidgetProps
) => {
  const [medalsTypeDetails, dispatch] = useReducer(medalReducer, {
    medals: medalsDetails,
  });
  const [sortedData, setSortedData] = useState<INationMedals[]>([]);
  const [allRecords, setAllRecords] = useState<INationMedals[]>([]);

  useEffect(() => {}, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3300/getRecord");
        const jsonData: INationMedals[] = await response.json();
        const modifiedData = jsonData.map((obj: INationMedals) => {
          return Object.assign({}, obj, {
            total: obj.gold + obj.silver + obj.bronze,
          });
        });

        setAllRecords(modifiedData);
        handleClick(props.sort || "gold");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const activeSortType = medalsTypeDetails.medals.filter(
      (model: IMedals) => model.isActive == true
    );

    if (activeSortType.length) {
      const sortBy: string = activeSortType[0].title;
      const secondarySortBy: string = activeSortType[0].secondary;

      const sortedRecords = allRecords.slice().sort((a: any, b: any) => {
        if (a[sortBy] !== b[sortBy]) {
          return b[sortBy] - a[sortBy];
        } else {
          return b[secondarySortBy] - a[secondarySortBy];
        }
      });
      const tenSortedRecords = sortedRecords.slice(0, 10);
      setSortedData(tenSortedRecords);
    }
  }, [medalsTypeDetails]);

  const handleClick = (title: string) => {
    dispatch({ type: "toggleIsActive", payload: title });
  };

  return (
    <div id={props.id} className="medal_container">
      <h2>Medal count</h2>
      <div>
        <table>
          <thead>
            <tr>
              <th></th>
              {medalsTypeDetails.medals.length &&
                medalsTypeDetails.medals.map(
                  (medalType: IMedals, index: number) => {
                    return (
                      <th
                        className={medalType.isActive ? "active" : ""}
                        onClick={() => handleClick(medalType.title)}
                        key={index}
                      >
                        <span
                          className={
                            (medalType.isMedalType ? "circle " : "") +
                            medalType.title +
                            (!medalType.isMedalType ? " capitalize" : "")
                          }
                        >
                          {!medalType.isMedalType && medalType.title}
                        </span>
                      </th>
                    );
                  }
                )}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((medal: any, index: number) => {
              return (
                <tr key={medal.code}>
                  <td>
                    <ul className="country-detail">
                      <li>{index + 1}</li>
                      <li>
                        <span className={"flag flag-" + medal.code}></span>
                      </li>
                      <li>{medal.code}</li>
                    </ul>
                  </td>
                  <td className="center">{medal.gold}</td>
                  <td className="center">{medal.silver}</td>
                  <td className="center">{medal.bronze}</td>
                  <td className="center">
                    <b>{medal.gold + medal.silver + medal.bronze}</b>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NationMedalsWidget;
