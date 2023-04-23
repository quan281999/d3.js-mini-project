import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const xValue = (data) => data.sepalLength;
const yValue = (data) => data.petalWidth;

const MARGIN = {
  TOP: 20,
  RIGHT: 20,
  BOTTOM: 40,
  LEFT: 50,
};

const DATA_CIRCLE_RADIUS = 5;

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
        .range([MARGIN.LEFT, width - MARGIN.RIGHT]);
      const yScale = d3
        .scaleLinear()
        .domain(d3.extent(irisData, yValue))
        .range([height - MARGIN.BOTTOM, MARGIN.TOP]);

      const xAxis = d3.axisBottom().scale(xScale);
      const yAxis = d3.axisLeft().scale(yScale);

      svg
        .selectAll("circle")
        .data(irisData)
        .join("circle")
        .attr("cx", (d) => xScale(xValue(d)))
        .attr("cy", (d) => yScale(yValue(d)))
        .attr("r", DATA_CIRCLE_RADIUS);
      svg
        .append("g")
        .attr("transform", `translate(0,${height - MARGIN.BOTTOM})`)
        .call(xAxis);
      svg
        .append("g")
        .attr("transform", `translate(${MARGIN.LEFT},0)`)
        .call(yAxis);
    }
  }, [irisData]);

  return <svg ref={svgRef}></svg>;
};

export default Chart;
