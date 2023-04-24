import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import Marks from "./Marks";

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
  const width = window.innerWidth * 0.8;
  const height = window.innerHeight * 0.8;
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(irisData, xValue))
    .range([MARGIN.LEFT, width - MARGIN.RIGHT]);
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(irisData, yValue))
    .range([height - MARGIN.BOTTOM, MARGIN.TOP]);

  useEffect(() => {
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
      .append("g")
      .attr("transform", `translate(0,${height - MARGIN.BOTTOM})`)
      .attr("class", "axis-grid")
      .call(xAxisGrid)
      .lower();
    svg
      .append("g")
      .attr("transform", `translate(${MARGIN.LEFT},0)`)
      .attr("class", "axis-grid")
      .call(yAxisGrid)
      .lower();
    svg
      .append("g")
      .attr("transform", `translate(0,${height - MARGIN.BOTTOM})`)
      .attr("class", "axis")
      .call(xAxis);
    svg
      .append("g")
      .attr("transform", `translate(${MARGIN.LEFT},0)`)
      .attr("class", "axis")
      .call(yAxis);
  }, [irisData, xScale, yScale, width, height]);

  return (
    <>
      <svg width={width} height={height} ref={svgRef}>
        <Marks
          data={irisData}
          xScale={xScale}
          yScale={yScale}
          xValue={xValue}
          yValue={yValue}
          circleRadius={DATA_CIRCLE_RADIUS}
        />
      </svg>
      <div id="tooltip"></div>
    </>
  );
};

export default Chart;
