import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const xValue = (data) => data.sepalLength;
const yValue = (data) => data.petalWidth;

const Chart = ({ irisData }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (irisData) {
      const width = window.innerWidth * 0.8;
      const height = window.innerHeight * 0.8;

      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .style("background", "#d3d3d3");

      const xScale = d3
        .scaleLinear()
        .domain(d3.extent(irisData, xValue))
        .range([0, width]);
      const yScale = d3
        .scaleLinear()
        .domain(d3.extent(irisData, yValue))
        .range([height, 0]);

      svg
        .selectAll("circle")
        .data(irisData)
        .join("circle")
        .attr("cx", (d) => xScale(xValue(d)))
        .attr("cy", (d) => yScale(yValue(d)))
        .attr("r", 10);
    }
  }, [irisData]);

  return <svg ref={svgRef}></svg>;
};

export default Chart;
