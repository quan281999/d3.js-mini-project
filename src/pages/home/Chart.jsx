import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  MARGIN,
  DATA_CIRCLE_RADIUS,
  VARIETY_COLOR_MAPPING,
} from "./constants.ts";

const xValue = (prop) => (data) => data[prop];
const yValue = (prop) => (data) => data[prop];

const Chart = ({ irisData, x, y }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.8;
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(irisData, xValue(x)))
      .range([MARGIN.LEFT, width - MARGIN.RIGHT]);
    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(irisData, yValue(y)))
      .range([height - MARGIN.BOTTOM, MARGIN.TOP]);
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

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("opacity", 0)
      .style("background-color", "#c1d8f0")
      .style("z-index", "10")
      .style("padding", "4px 8px");

    const t = d3.transition().duration(1000);

    const positionCircles = (circles) => {
      circles
        .attr("cx", (d) => xScale(xValue(x)(d)))
        .attr("cy", (d) => yScale(yValue(y)(d)));
    };
    const initializeRadius = (circles) => {
      circles.attr("r", 0);
    };
    const growRadius = (enter) => {
      enter.transition(t).attr("r", DATA_CIRCLE_RADIUS);
    };

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
    svg
      .selectAll("circle")
      .data(irisData)
      .join(
        (enter) =>
          enter
            .append("circle")
            .call(initializeRadius)
            .call(growRadius)
            .call(positionCircles),
        (update) =>
          update
            .transition(t)
            .delay((d, i) => i * 10)
            .call(positionCircles)
      )
      .attr("fill", (d) => VARIETY_COLOR_MAPPING[d.variety])
      .on("mouseover", (event, d) => {
        const html = `
            <small>X: ${xValue(x)(d)}</small>
            <br>
            <small>Y: ${yValue(y)(d)}</small>
          `;
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip
          .html(html)
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY - 15 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
      });
  }, [irisData, x, y]);

  return <svg ref={svgRef}></svg>;
};

export default Chart;
