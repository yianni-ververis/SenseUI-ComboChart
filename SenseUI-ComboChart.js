/**
 * @name SenseUI-BiPartite
 * @author yianni.ververis@qlik.com
 * @requires string: 1 Dimension and at least 1 Measure
 * @param {integer} vars.font.size: 
 * @param {string} vars.font.color:
 * @param {boolean} vars.legend:
 * @param {boolean} vars.enableSelections:
 * @description
 * A simple Combo Chart
 * @version 1.1: Added 2nd line
 */

define( [ 
	"qlik",
	"jquery",
	"./d3.v3.min",
],
(qlik, $, d3) => {
	// Define properties
	var me = {
		initialProperties: {
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 4,
					qHeight: 1000
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 1,
					max: 1
				},
				measures: {
					uses: "measures",
					min: 1,
					max: 3
				},
				sorting: {
					uses: "sorting"
				},
				settings : {
					uses : "settings",
					items: {
						general: {
							type: "items",
							label: "General",
							items: {
								fontSize: {
									type: "integer",
									expression: "none",
									label: "Text Size",
									defaultValue: "10",
									ref: "vars.font.size"
								},
								fontColor: {
									type: "string",
									expression: "none",
									label: "Font Color",
									defaultValue: "#000000",
									ref: "vars.font.color"
								},
								displayLegend: {
									type: "boolean",
									component: "switch",
									label: "Display Legend",
									ref: "vars.legend",
									options: [{
										value: true,
										label: "On"
									}, {
										value: false,
										label: "Off"
									}],
									defaultValue: true
								},
								enableSelections: {
									type: "boolean",
									component: "switch",
									label: "Enable Selections",
									ref: "vars.enableSelections",
									options: [{
										value: true,
										label: "On"
									}, {
										value: false,
										label: "Off"
									}],
									defaultValue: true
								},
							},
						},
						customBar: {
							type: "items",
							label: "Bar Chart",
							items: {
								barColor: {
									type: "string",
									expression: "none",
									label: "Bar Color",
									defaultValue: "#4682B4",
									ref: "vars.bar.color"
								},
								barColorHover: {
									type: "string",
									expression: "none",
									label: "Bar Hover Color",
									defaultValue: "#77B62A",
									ref: "vars.bar.hover"
								},
								barWidth: {
									type: "integer",
									expression: "none",
									label: "Bar Width (0 for auto scaling)",
									defaultValue: "0",
									ref: "vars.bar.width"
								},
								barBorderColor: {
									type: "string",
									expression: "none",
									label: "Bar Border Color",
									defaultValue: "#4682B4",
									ref: "vars.bar.borderColor"
								},
								barBorderWidth: {
									type: "integer",
									expression: "none",
									label: "Bar Border Width",
									defaultValue: "1",
									ref: "vars.bar.borderWidth"
								}
							},
						},
						customLine1: {
							type: "items",
							label: "Line Chart 1",
							show : function(data) {
								if (data.qHyperCubeDef.qMeasures.length>1) {
									return true;
								}
							},
							items: {
								lineColor: {
									type: "string",
									expression: "none",
									label: "Line Color",
									defaultValue: "#ec5e08",
									ref: "vars.line.color"
								},
								lineWidth: {
									type: "string",
									expression: "none",
									label: "Line Width",
									defaultValue: "3",
									ref: "vars.line.width"
								},
								dotColor: {
									type: "string",
									expression: "none",
									label: "Dot Color",
									defaultValue: "#ec5e08",
									ref: "vars.dot.color"
								},
								dotStrokeColor: {
									type: "string",
									expression: "none",
									label: "Dot Stroke Color",
									defaultValue: "#ec5e08",
									ref: "vars.dot.strokeColor"
								},
								dotStrokeWidth: {
									type: "string",
									expression: "none",
									label: "Dot Stroke Width",
									defaultValue: "3",
									ref: "vars.dot.strokeWidth"
								},
								dotRadius: {
									type: "string",
									expression: "none",
									label: "Dot Radius",
									defaultValue: "5",
									ref: "vars.dot.radius"
								},
							}
						},
						customLine2: {
							type: "items",
							label: "Line Chart 2",
							show : function(data) {
								if (data.qHyperCubeDef.qMeasures.length>2) {
									return true;
								}
							},
							items: {
								lineColor2: {
									type: "string",
									expression: "none",
									label: "Line Color",
									defaultValue: "#1F78B4",
									ref: "vars.line2.color"
								},
								lineWidth2: {
									type: "string",
									expression: "none",
									label: "Line Width",
									defaultValue: "3",
									ref: "vars.line2.width"
								},
								dotColor2: {
									type: "string",
									expression: "none",
									label: "Dot Color",
									defaultValue: "#1F78B4",
									ref: "vars.dot2.color"
								},
								dotStrokeColor2: {
									type: "string",
									expression: "none",
									label: "Dot Stroke Color",
									defaultValue: "#ec5e08",
									ref: "vars.dot2.strokeColor"
								},
								dotStrokeWidth2: {
									type: "string",
									expression: "none",
									label: "Dot Stroke Width",
									defaultValue: "3",
									ref: "vars.dot2.strokeWidth"
								},
								dotRadius2: {
									type: "string",
									expression: "none",
									label: "Dot Radius",
									defaultValue: "5",
									ref: "vars.dot2.radius"
								},
							}
						}
					}
				}
			}
		}
	};

	me.support = {
		snapshot: true,
		export: true,
		exportData : false
	};

	// Get Engine API app for Selections
	me.app = qlik.currApp(this);

	me.paint = function($element,layout) {
		let vars = $.extend({
			v: '1.1',
			id: layout.qInfo.qId,
			name: 'SenseUI-ComboChart',
			width: $element.width(),
			contentWidth: $element.width(),
			height: $element.height(),
			margin: {top: 20, right: 20, bottom: 40, left: 40},
			dimension: layout.qHyperCube.qDimensionInfo[0].title,
			measure1: layout.qHyperCube.qMeasureInfo[0].qFallbackTitle,
			measure2: (layout.qHyperCube.qMeasureInfo[1]) ? layout.qHyperCube.qMeasureInfo[1].qFallbackTitle : null,
			measure3: (layout.qHyperCube.qMeasureInfo[2]) ? layout.qHyperCube.qMeasureInfo[2].qFallbackTitle : null,
			data: [],
			this: this
		}, layout.vars);	
		vars.bar.total = layout.qHyperCube.qDataPages[0].qMatrix.length;
		vars.bar.width = parseInt(vars.bar.width)
		vars.dot.radius = parseInt(vars.dot.radius)
		vars.dot2.radius = (vars.dot2) ? parseInt(vars.dot2.radius) : null;
		vars.bar.padding = 5
		
		if (vars.bar.width) {
			vars.contentWidth = (vars.bar.width + vars.bar.padding) * vars.bar.total + vars.margin.left + vars.margin.right
			vars.margin.bottom += 20;
		}
		if (vars.legend) {
			vars.margin.bottom += 20;
		}
		// CSS
		vars.css = `
			#${vars.id}_inner {
				width: ${vars.width}px;
				height: ${vars.height}px;
				overflow-x: auto !important;
				overflow-y: hidden !important;
			}
			#${vars.id}_inner .content {
				width: ${vars.contentWidth}px;
			}
			#${vars.id}_inner .line {
				fill: none;
				stroke: ${vars.line.color};
				stroke-width: ${vars.line.width}px;
			}
			#${vars.id}_inner .line2 {
				fill: none;
				stroke: ${vars.line2.color};
				stroke-width: ${vars.line2.width}px;
			}
			#${vars.id}_inner .dot {
				fill: ${vars.dot.color};
				stroke: ${vars.dot.strokeColor};
				stroke-width: ${vars.dot.width}px;
			}
			#${vars.id}_inner .dot2 {
				fill: ${vars.dot2.color};
				stroke: ${vars.dot2.strokeColor};
				stroke-width: ${vars.dot2.width}px;
			}
			#${vars.id}_inner .hover {
				fill: ${vars.line.color};
				stroke: ${vars.line.color};
			}
			#${vars.id}_inner .bar {
				fill: ${vars.bar.color};
				stroke: ${vars.bar.borderColor};
				stroke-width: ${vars.bar.borderWidth}px;
			}
			#${vars.id}_inner .bar:hover {
				fill: ${vars.bar.hover};
				cursor: pointer;
			}
			#${vars.id}_inner .title {
				font: bold 14px "Helvetica Neue", Helvetica, Arial, sans-serif;
			}
			#${vars.id}_inner .legend,
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
			#${vars.id}_inner .legend .column .box.measure1 {
				background-color: ${vars.bar.color};
			}
			#${vars.id}_inner .legend .column .box.measure2 {
				background-color: ${vars.line.color};
			}
			#${vars.id}_inner .legend .column .box.measure3 {
				background-color: ${vars.line2.color};
			}

		`;

		// TEMPLATE
		vars.template = `
			<div id="${vars.id}_inner">
				<div class="content"></div>
			</div>
		`;

		// Write Css and html
		$("<style>").html(vars.css).appendTo("head")
		$element.html(vars.template)

		vars.barWidth = (vars.width-vars.margin.left-vars.margin.right-5)/vars.bar.total
		vars.data = layout.qHyperCube.qDataPages[0].qMatrix.map(function(d) {
			return {
				"dimension":d[0].qText,
				"qElemNumber":d[0].qElemNumber,
				"measure": d[1].qText,
				"measureNum": d[1].qNum,
				"measure2": (d[2]) ? d[2].qText : null,
				"measureNum2": (d[2]) ? d[2].qNum : null,
				"measure3": (d[3]) ? d[3].qText : null,
				"measureNum3": (d[3]) ? d[3].qNum : null
			}
		});

		var margin = vars.margin,
			width = vars.width - margin.left - margin.right,
			height = vars.height - margin.top - margin.bottom;
		
		if (vars.bar.width) {
			width = (vars.bar.width + vars.bar.padding) * vars.bar.total + vars.margin.left + vars.margin.right
		}

		var x = d3.scale.ordinal()
			.rangeRoundBands([0, width], .1, .3);

		var y = d3.scale.linear()
			.range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(8, "")
			.tickFormat(function(d,i){
				var display = Math.round(d);
				if (d >= 1000 && d<1000000) {
					display = Math.round(d/1000) + 'K'
				} else if (d >= 1000000) {
					display = Math.round(d/1000000) + 'M'
				}
				return display; 
			})
			
		var svg = d3.select(`#${vars.id}_inner .content`).append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		x.domain(vars.data.map(function(d) { return d.dimension; }));
		y.domain([0, d3.max(vars.data, function(d) { return d.measureNum; })]);

		if (vars.legend) {
			var displayLegend = `<div class="column"><div class="box measure1"></div>${vars.measure1}</div>`;
			if (vars.measure2) {
				displayLegend += `<div class="column"><div class="box measure2"></div>${vars.measure2}</div>`;
			}
			if (vars.measure3) {
				displayLegend += `<div class="column"><div class="box measure3"></div>${vars.measure3}</div>`;
			}
			svg.append("foreignObject")
				.attr('width', 500)
				.attr('height', 50)
				.attr("y", `${height+vars.margin.bottom-15}`)
			.append("xhtml:div")
				.attr("class", "legend")
				.html(displayLegend);
		}

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.selectAll(".tick text")
			.call(wrap, (vars.bar.width) ? vars.bar.width : x.rangeBand());

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);
			
		svg.selectAll(".bar")
			.data(vars.data)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { return x(d.dimension); })
			.attr("width", (vars.bar.width) ? vars.bar.width : x.rangeBand())
			.attr("y", function(d) { return y(d.measureNum); })
			.attr("height", function(d) { return height - y(d.measureNum); })
			.on('click', function(d,i) {
				if (vars.enableSelections) {
					vars.this.backendApi.selectValues(0, [d.qElemNumber], true);
				}
			});

		// Create the Line Chart only if there is a 2nd measure
		if (vars.measure2) {
			var y2 = d3.scale.linear()
				.range([height, 0])
				.domain([0, d3.max(vars.data, function(d) { return d.measureNum2; })]);
			var line = d3.svg.line()
				.x(function(d) { return x(d.dimension); })
				.y(function(d) { return y2(d.measureNum2); })
			// Create the line
			svg.append("g").attr("id", "line")
				.append("path")
				.datum(vars.data)
					.attr("class", "line")
					.attr("transform", `translate(${vars.margin.left},0)`)
					.attr("d", line)
			// Add the dots
			svg.selectAll("dots")
				.data(vars.data)
				.enter().append("circle")
					.attr("class", "dot")
					.attr("r", vars.dot.radius)
					.attr("cx", function(d) { return x(d.dimension); })
					.attr("cy", function(d) { return y2(d.measureNum2); })
					.attr("transform", `translate(${vars.margin.left},0)`)
		}

		// Create the Line Chart only if there is a 2nd measure
		if (vars.measure3) {
			var y3 = d3.scale.linear()
				.range([height, 0])
				.domain([0, d3.max(vars.data, function(d) { return d.measureNum3; })]);
			var line2 = d3.svg.line()
				.x(function(d) { return x(d.dimension); })
				.y(function(d) { return y3(d.measureNum3); })
			// Create the line
			svg.append("g").attr("id", "line2")
				.append("path")
				.datum(vars.data)
					.attr("class", "line2")
					.attr("transform", `translate(${vars.margin.left},0)`)
					.attr("d", line2)
			// Add the dots
			svg.selectAll("dots")
				.data(vars.data)
				.enter().append("circle")
					.attr("class", "dot2")
					.attr("r", vars.dot.radius)
					.attr("cx", function(d) { return x(d.dimension); })
					.attr("cy", function(d) { return y3(d.measureNum3); })
					.attr("transform", `translate(${vars.margin.left},0)`)
		}
		function wrap (text, width) {
			text.each(function() {
				var breakChars = ['/', '&', '-'],
				text = d3.select(this),
				textContent = text.text(),
				spanContent;
				breakChars.forEach(char => {
				// Add a space after each break char for the function to use to determine line breaks
				textContent = textContent.replace(char, char + ' ');
				});

				var words = textContent.split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1.1, // ems
				x = text.attr('x'),
				y = text.attr('y'),
				dy = parseFloat(text.attr('dy') || 0),
				tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');

				while (word = words.pop()) {
				line.push(word);
				tspan.text(line.join(' '));
				if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					spanContent = line.join(' ');
					breakChars.forEach(char => {
						// Remove spaces trailing breakChars that were added above
						spanContent = spanContent.replace(char + ' ', char);
					});
					tspan.text(spanContent);
					line = [word];
					tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
				}
				}
			});
		}

		console.info(`%c ${vars.name}: `, 'color: red', `v ${vars.v}`)
		//needed for export
		return qlik.Promise.resolve()
	};

	// define HTML template	
	// me.template = '';

	// The Angular Controller for binding
	// me.controller = ["$scope", "$rootScope", "$element", function ( $scope, $rootScope, $element ) {}]

	return me
} );

