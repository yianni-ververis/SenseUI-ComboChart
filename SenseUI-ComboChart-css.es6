"use strict";
// CSS
const cssjs = (vars) => {
	let css = `
		#${vars.id}_inner {
			width: ${vars.width}px;
			height: 100%;
			overflow-x: auto !important;
			overflow-y: hidden !important;
		}
		#${vars.id}_inner .content {
			width: ${vars.contentWidth}px;
		}
		#${vars.id}_inner .line2 {
			fill: none;
			stroke: ${vars.measure2.color};
			stroke-width: ${vars.measure2.stroke}px;
		}
		#${vars.id}_inner .line3 {
			fill: none;
			stroke: ${vars.measure3.color};
			stroke-width: ${vars.measure3.stroke}px;
		}
		#${vars.id}_inner .line4 {
			fill: none;
			stroke: ${vars.measure4.color};
			stroke-width: ${vars.measure4.stroke}px;
		}
		#${vars.id}_inner .bar1 {
			fill: ${vars.measure1.color};
			stroke: ${vars.measure1.strokeColor};
			stroke-width: ${vars.measure1.stroke}px;
			cursor: pointer;
			transition: fill 0.5s ease;
		}
		#${vars.id}_inner .dot1:hover,
		#${vars.id}_inner .bar1:hover {
			fill: ${vars.measure1.colorHover};
			stroke: ${vars.measure1.strokeColorHover};
		}
		#${vars.id}_inner .dot2,
		#${vars.id}_inner .bar2 {
			fill: ${vars.measure2.color};
			stroke: ${vars.measure2.color};
			stroke-width: ${vars.measure2.stroke}px;
			cursor: pointer;
		}
		#${vars.id}_inner .dot2:hover,
		#${vars.id}_inner .bar2:hover {
			fill: ${vars.measure2.colorHover};
			stroke: ${vars.measure2.strokeColorHover};
		}
		#${vars.id}_inner .dot3,
		#${vars.id}_inner .bar3 {
			fill: ${vars.measure3.color};
			stroke: ${vars.measure3.color};
			stroke-width: ${vars.measure3.stroke}px;
			cursor: pointer;
		}
		#${vars.id}_inner .dot3:hover,
		#${vars.id}_inner .bar3:hover {
			fill: ${vars.measure3.colorHover};
			stroke: ${vars.measure3.strokeColorHover};
		}
		#${vars.id}_inner .dot4,
		#${vars.id}_inner .bar4 {
			fill: ${vars.measure4.color};
			stroke: ${vars.measure4.color};
			stroke-width: ${vars.measure4.stroke}px;
			cursor: pointer;
		}
		#${vars.id}_inner .dot4:hover,
		#${vars.id}_inner .bar4:hover {
			fill: ${vars.measure4.colorHover};
			stroke: ${vars.measure4.strokeColorHover};
		}
		#${vars.id}_inner .title {
			font: bold 14px "Helvetica Neue", Helvetica, Arial, sans-serif;
		}
		#${vars.id}_inner,
		#${vars.id}_inner .axis {
			font: ${vars.font.size}px sans-serif;
			color: ${vars.font.color};
		}
		#${vars.id}_inner .axis path,
		#${vars.id}_inner .axis line {
			fill: none;
			stroke: #CCC;
			shape-rendering: crispEdges;
		}
		#${vars.id}_inner .x.axis path {
			display: none;
		}
		#${vars.id}_inner .legend {
			font: ${vars.font.size}px sans-serif;
			color: ${vars.font.color};
			text-align: ${vars.legendAlignment};
		}
		#${vars.id}_inner .legend .column {
			display: inline-block;
			padding-right: 10px;
		}
		#${vars.id}_inner .legend .column .box {
			width: 10px;
			height: 10px;
			display: inline-block;
			margin-right: 5px;
		}
		.d3-tip .box.measure1,
		#${vars.id}_inner .legend .column .box.measure1 {
			background-color: ${vars.measure1.color};
		}
		.d3-tip .box.measure2,
		#${vars.id}_inner .legend .column .box.measure2 {
			background-color: ${vars.measure2.color};
		}
		.d3-tip .box.measure3,
		#${vars.id}_inner .legend .column .box.measure3 {
			background-color: ${vars.measure3.color};
		}
		.d3-tip .box.measure4,
		#${vars.id}_inner .legend .column .box.measure4 {
			background-color: ${vars.measure4.color};
		}
		#${vars.id}_inner .grid .tick {
			stroke: grey;
			opacity: 0.2;
		}
		#${vars.id}_inner #grid line {
			stroke: grey;
			stroke-width: 0.5;
			opacity: 0.5;
		}
	`;

	return css;
}