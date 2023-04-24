import React, { useEffect, useState } from "react";
import Chart from "./Chart";
import * as d3 from "d3";
import Select from "react-select";
import csv from "../../data/iris.csv";
import styles from "./index.module.css";
import { SELECT_OPTIONS, DEFAULT_X, DEFAULT_Y } from "./constants.ts";

const HomePage = () => {
  const [irisData, setIrisData] = useState();
  const [x, setX] = useState(DEFAULT_X.value);
  const [y, setY] = useState(DEFAULT_Y.value);
  useEffect(() => {
    d3.csv(csv, (data) => ({
      petalWidth: +data["petal.width"],
      petalLength: +data["petal.length"],
      sepalWidth: +data["sepal.width"],
      sepalLength: +data["sepal.length"],
      variety: data.variety,
    })).then((data) => {
      data.columns = [
        "petalWidth",
        "petalLength",
        "sepalWidth",
        "sepalLength",
        "variety",
      ];
      setIrisData(data);
    });
  }, []);

  return (
    <>
      <div className={styles["select-container"]}>
        <Select
          placeholder="Select X"
          onChange={(selectedOption) => setX(selectedOption.value)}
          options={SELECT_OPTIONS}
          defaultValue={DEFAULT_X}
        />
        <Select
          placeholder="Select Y"
          onChange={(selectedOption) => setY(selectedOption.value)}
          options={SELECT_OPTIONS}
          defaultValue={DEFAULT_Y}
        />
      </div>
      <div className={styles["chart-container"]}>
        {irisData && <Chart irisData={irisData} x={x} y={y} />}
      </div>
    </>
  );
};

export default HomePage;
