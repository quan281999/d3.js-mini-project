import React from "react";
import * as d3 from "d3";

const Marks = ({ data, xScale, yScale, xValue, yValue, circleRadius }) => {
  const onMouseOver = (d) => (event) => {
    const tooltip = d3.select("#tooltip");
    const html = `
            <small>X: ${xValue(d)}</small>
            <br>
            <small>Y: ${yValue(d)}</small>
          `;
    tooltip.transition().duration(200).style("opacity", 1);
    tooltip
      .html(html)
      .style("left", event.pageX + 15 + "px")
      .style("top", event.pageY - 15 + "px");
  };

  const onMouseOut = () => {
    const tooltip = d3.select("#tooltip");
    tooltip.transition().duration(200).style("opacity", 0);
  };

  return data.map((d, index) => (
    <circle
      key={index}
      cx={xScale(xValue(d))}
      cy={yScale(yValue(d))}
      r={circleRadius}
      onMouseOver={onMouseOver(d)}
      onMouseOut={onMouseOut}
    ></circle>
  ));
};

export default Marks;
