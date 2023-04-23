import React, { useEffect, useState } from "react";
import Chart from "./Chart";
import * as d3 from "d3";
import csv from "../../data/iris.csv";
import styles from "./index.module.css";

const HomePage = () => {
  const [irisData, setIrisData] = useState();
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
    <div className={styles.container}>
      <Chart irisData={irisData} />
    </div>
  );
};

export default HomePage;
