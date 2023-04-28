import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import * as d3 from "d3";

import {
  MARGIN,
  DATA_POINT_RADIUS,
  VARIETY_COLOR_MAPPING,
  TRANSITION_DURATION,
  TOOLTIP_TRANSITION_DURATION,
  TOOLTIP_POSITION_OFFSET,
  CHART_SIZE_FRACTION,
} from "../constants.js";

const xValue = (prop) => (data) => data[prop];
const yValue = (prop) => (data) => data[prop];

const Chart = ({ irisData, x, y }) => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useLayoutEffect(() => {
    const updateSize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  const svgRef = useRef();

  useEffect(() => {
    const width = screenSize.width * CHART_SIZE_FRACTION;
    const height = screenSize.height * CHART_SIZE_FRACTION;
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
      .style("border-radius", "5px")
      .style("box-shadow", "rgba(0, 0, 0, 0.1) 0px 4px 12px")
      .style("position", "absolute")
      .style("opacity", 0)
      .style("z-index", "10")
      .style("padding", "4px 8px");

    const t = d3.transition().duration(TRANSITION_DURATION);

    const positionCircles = (circles) => {
      circles
        .attr("cx", (d) => xScale(xValue(x)(d)))
        .attr("cy", (d) => yScale(yValue(y)(d)));
    };
    const initializeRadius = (circles) => {
      circles.attr("r", 0);
    };
    const growRadius = (enter) => {
      enter.transition(t).attr("r", DATA_POINT_RADIUS);
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
        (update) => update.transition(t).call(positionCircles)
      )
      .attr("fill", (d) => VARIETY_COLOR_MAPPING[d.variety])
      .on("mouseover", (event, d) => {
        const html = `
            <span>${d.variety}</span>
            <br>
            <small>X: ${xValue(x)(d)}</small>
            <br>
            <small>Y: ${yValue(y)(d)}</small>
          `;
        tooltip.style("background-color", VARIETY_COLOR_MAPPING[d.variety]);
        tooltip
          .transition()
          .duration(TOOLTIP_TRANSITION_DURATION)
          .style("opacity", 1);
        tooltip
          .html(html)
          .style("left", event.pageX + TOOLTIP_POSITION_OFFSET + "px")
          .style("top", event.pageY - TOOLTIP_POSITION_OFFSET + "px");
      })
      .on("mouseout", () => {
        tooltip
          .transition()
          .duration(TOOLTIP_TRANSITION_DURATION)
          .style("opacity", 0);
      });
  }, [irisData, x, y, screenSize]);

  return <svg ref={svgRef}></svg>;
};

export default Chart;
