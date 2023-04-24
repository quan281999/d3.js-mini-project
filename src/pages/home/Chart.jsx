import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import Marks from "./Marks";
import { MARGIN, DATA_CIRCLE_RADIUS } from "./constants.ts";

const xValue = (prop) => (data) => data[prop];
const yValue = (prop) => (data) => data[prop];

const Chart = ({ irisData, x, y }) => {
  const svgRef = useRef();
  const width = window.innerWidth * 0.8;
  const height = window.innerHeight * 0.8;
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(irisData, xValue(x)))
    .range([MARGIN.LEFT, width - MARGIN.RIGHT]);
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(irisData, yValue(y)))
    .range([height - MARGIN.BOTTOM, MARGIN.TOP]);

  useEffect(() => {
    const t = d3.transition().duration(1000);
    const svg = d3.select(svgRef.current);

    const xAxis = d3.axisBottom().scale(xScale);
    const yAxis = d3.axisLeft().scale(yScale);

    const xAxisGrid = d3
      .axisBottom()
      .scale(xScale)
      .tickFormat("")
      .tickSize(-height);
    const yAxisGrid = d3
      .axisLeft()
      .scale(yScale)
      .tickFormat("")
      .tickSize(-width);

    svg
      .selectAll(".x-grid")
      .data([null])
      .join("g")
      .lower()
      .attr("class", "x-grid")
      .attr("transform", `translate(0,${height - MARGIN.BOTTOM})`)
      .transition(t)
      .call(xAxisGrid);
    svg
      .selectAll(".y-grid")
      .data([null])
      .join("g")
      .lower()
      .attr("class", "y-grid")
      .attr("transform", `translate(${MARGIN.LEFT},0)`)
      .transition(t)
      .call(yAxisGrid);
    svg
      .selectAll(".x-axis")
      .data([null])
      .join("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - MARGIN.BOTTOM})`)
      .transition(t)
      .call(xAxis);
    svg
      .selectAll(".y-axis")
      .data([null])
      .join("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${MARGIN.LEFT},0)`)
      .transition(t)
      .call(yAxis);
  }, [irisData, xScale, yScale, width, height]);

  return (
    <>
      <svg width={width} height={height} ref={svgRef}>
        <Marks
          data={irisData}
          xScale={xScale}
          yScale={yScale}
          xValue={xValue(x)}
          yValue={yValue(y)}
          circleRadius={DATA_CIRCLE_RADIUS}
        />
      </svg>
      <div id="tooltip"></div>
    </>
  );
};

export default Chart;
