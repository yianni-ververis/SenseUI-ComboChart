"use strict";
/**
 * @name SenseUI-ComboChart
 * @author yianni.ververis@qlik.com
 * @requires string: 1 Dimension and at least 1 Measure
 * @param {integer} vars.font.size: 
 * @param {string} vars.font.color:
 * @param {boolean} vars.legend:
 * @param {boolean} vars.enableSelections:
 * @description
 * A simple Combo Chart
 * @version 1.9: 7 Measures possible; Measure/Bar 2  has the special grouping feature for Measure/Bar 1
 * @version 1.8: 6 Measures possible and the option for dashed lines
 * @version 1.7: Legend Alignment
 * @version 1.4: Add text on top of the bars
 * @version 1.3: Distribute Bars evenly
 * @version 1.2: Added Tooltips
 * @version 1.1: Added 2nd line
 * @version 1.0: Initial Setup
 */

define(["qlik", "jquery", 'css!./SenseUI-ComboChart.css', './SenseUI-ComboChart-options', "./d3.v3.min", './d3-tip', './SenseUI-ComboChart-css'], function (qlik, $, css, options, d3) {
	// Define properties
	var me = options;

	me.support = {
		snapshot: true,
		export: true,
		exportData: false
	};

	// Get Engine API app for Selections
	me.app = qlik.currApp(undefined);

	me.paint = function ($element, layout) {
		var vars = $.extend(true, {
			v: '1.9.1',
			id: layout.qInfo.qId,
			name: 'SenseUI-ComboChart',
			width: $element.width(),
			contentWidth: $element.width(),
			height: $element.height(),
			margin: { top: 20, right: 20, bottom: 40, left: 40 },
			dimension: layout.qHyperCube.qDimensionInfo[0].title,
			measure1: {
				label: layout.qHyperCube.qMeasureInfo[0].qFallbackTitle
			},
			measure2: {
				label: layout.qHyperCube.qMeasureInfo[1] ? layout.qHyperCube.qMeasureInfo[1].qFallbackTitle : null
			},
			measure3: {
				label: layout.qHyperCube.qMeasureInfo[2] ? layout.qHyperCube.qMeasureInfo[2].qFallbackTitle : null
			},
			measure4: {
				label: layout.qHyperCube.qMeasureInfo[3] ? layout.qHyperCube.qMeasureInfo[3].qFallbackTitle : null
			},
			measure5: {
				label: layout.qHyperCube.qMeasureInfo[4] ? layout.qHyperCube.qMeasureInfo[4].qFallbackTitle : null
			},
			measure6: {
				label: layout.qHyperCube.qMeasureInfo[5] ? layout.qHyperCube.qMeasureInfo[5].qFallbackTitle : null
			},
			measure7: {
				label: layout.qHyperCube.qMeasureInfo[6] ? layout.qHyperCube.qMeasureInfo[6].qFallbackTitle : null
			},
			tooltip: {
				visible: layout.vars.tooltip && layout.vars.tooltip.visible ? true : false,
				// dimension: (layout.vars.tooltip && layout.vars.tooltip.dimension)?true:false,
				mashup: layout.vars.tooltip && layout.vars.tooltip.mashup ? true : false,
				showAll: layout.vars.tooltip && layout.vars.tooltip.showAll ? true : false,
				divid: layout.vars.tooltip && layout.vars.tooltip.divid ? layout.vars.tooltip.divid : 'maincontent',
				scrollLeft: 0,
				scrollTop: 0
			},
			data: [],
			this: this
		}, layout.vars);
		vars.bar.total = layout.qHyperCube.qDataPages[0].qMatrix.length;
		vars.bar.width = parseInt(vars.bar.width);
		vars.bar.padding = 5;
		if (vars.bar.width) {
			vars.contentWidth = (vars.bar.width + vars.bar.padding) * vars.bar.total + vars.margin.left + vars.margin.right;
			vars.margin.bottom += 20;
		}
		if (vars.legend) {
			vars.margin.bottom += vars.font.size * 2;
		}
		vars.bar.count = 1; // How many bars do we have to distributed the grouped bars evently
		vars.bar.count += vars.measure2.type && vars.measure2.visible && !vars.measure2.specialBarGrouping ? 1 : 0;
		vars.bar.count += vars.measure3.type && vars.measure3.visible ? 1 : 0;
		vars.bar.count += vars.measure4.type && vars.measure4.visible ? 1 : 0;
		vars.bar.count += vars.measure5.type && vars.measure5.visible ? 1 : 0;
		vars.bar.count += vars.measure6.type && vars.measure6.visible ? 1 : 0;
		vars.bar.count += vars.measure7.type && vars.measure7.visible ? 1 : 0;
		vars.palette = ['#332288', '#88CCEE', '#DDCC77', '#117733', '#CC6677', '#3399CC', '#CC6666', '#99CC66', '#275378', '#B35A01', '#B974FD', '#993300', '#99CCCC', '#669933', '#898989', '#EDA1A1', '#C6E2A9', '#D4B881', '#137D77', '#D7C2EC', '#FF5500', '#15DFDF', '#93A77E', '#CB5090', '#BFBFBF'];
		vars.legendAlignment = vars.legendAlignment ? vars.legendAlignment : 'center'; // Default for the apps that have been created before this version

		/*
  	inputMeasure: integer, e.g. for measure 5 -> input 4
  	inputOption: x-value for 'bar' or 'bar_label'
  */
		function visibleBarCounter(inputMeasure, inputOption) {
			var barCount = 0;
			var barLabelCount = 1;

			if (inputMeasure >= 1 && vars.measure2.type && vars.measure2.visible && !vars.measure2.specialBarGrouping) {
				barCount += 1;
				barLabelCount += 2;
			}
			if (inputMeasure >= 2 && vars.measure3.type && vars.measure3.visible) {
				barCount += 1;
				barLabelCount += 2;
			}
			if (inputMeasure >= 3 && vars.measure4.type && vars.measure4.visible) {
				barCount += 1;
				barLabelCount += 2;
			}
			if (inputMeasure >= 4 && vars.measure5.type && vars.measure5.visible) {
				barCount += 1;
				barLabelCount += 2;
			}
			if (inputMeasure >= 5 && vars.measure6.type && vars.measure6.visible) {
				barCount += 1;
				barLabelCount += 2;
			}
			if (inputMeasure >= 6 && vars.measure7.type && vars.measure7.visible) {
				barCount += 1;
				barLabelCount += 2;
			}

			if (inputOption == 'bar') {
				return barCount;
			} else if (inputOption == 'bar_label') {
				return barLabelCount;
			}
			/*if(inputMeasure >= vars.bar.count) {
   	return inputMeasure - (inputMeasure - vars.bar.count) - 1;
   }
   else {
   	return inputMeasure;
   }
   */
		}
		// CSS
		vars.css = cssjs(vars);
		// TEMPLATE
		vars.template = "\n\t\t\t<div id=\"" + vars.id + "_inner\">\n\t\t\t\t<div class=\"content\"></div>\n\t\t\t</div>\n\t\t";

		// Write Css and html
		if ($("#" + vars.id + "_css").length) {
			// insert only once
			$("#" + vars.id + "_css").remove();
		}
		// if (!$(`#${vars.id}_css`).length) { // insert only once
		$("<style id=\"" + vars.id + "_css\">").html(vars.css).appendTo("head");
		// }
		$element.html(vars.template);

		// helper Function to round the displayed numbers
		var roundNumber = function roundNumber(num, noPrecision) {
			//check if the string passed is number or contains formatting like 13%
			if (/^[0-9.]+$/.test(num)) {
				num = vars.precision && !noPrecision ? parseFloat(num).toFixed(2) : Math.round(num);
				if (num >= 1000 && num < 1000000) {
					num = vars.precision && !noPrecision ? parseFloat(num / 1000).toFixed(2) : Math.round(num / 1000);
					if (/\.00$/.test(num)) {
						num = num.replace(/\.00$/, ''); // Remove .00
					}
					num += 'K'; // Add the abbreviation
				} else if (num >= 1000000 && num < 1000000000) {
					num = vars.precision && !noPrecision ? parseFloat(num / 1000000).toFixed(2) : Math.round(num / 1000000);
					if (/\.00$/.test(num)) {
						num = num.replace(/\.00$/, ''); // Remove .00
					}
					num += 'M'; // Add the abbreviation
				} else if (num >= 1000000000) {
					num = vars.precision && !noPrecision ? parseFloat(num / 1000000000).toFixed(2) : Math.round(num / 1000000000);
					if (/\.00$/.test(num)) {
						num = num.replace(/\.00$/, ''); // Remove .00
					}
					num += 'T'; // Add the abbreviation
				}
			}
			return num;
		};

		vars.barWidth = (vars.width - vars.margin.left - vars.margin.right - 5) / vars.bar.total;
		vars.data = layout.qHyperCube.qDataPages[0].qMatrix.map(function (d) {
			return {
				"dimension": d[0].qText,
				"qElemNumber": d[0].qElemNumber,
				"measure": d[1].qText,
				"measureNum": d[1].qNum,
				"measure2": d[2] ? d[2].qText : null,
				"measureNum2": d[2] ? d[2].qNum : null,
				"measure3": d[3] ? d[3].qText : null,
				"measureNum3": d[3] ? d[3].qNum : null,
				"measure4": d[4] ? d[4].qText : null,
				"measureNum4": d[4] ? d[4].qNum : null,
				"measure5": d[5] ? d[5].qText : null,
				"measureNum5": d[5] ? d[5].qNum : null,
				"measure6": d[6] ? d[6].qText : null,
				"measureNum6": d[6] ? d[6].qNum : null,
				"measure7": d[7] ? d[7].qText : null,
				"measureNum7": d[7] ? d[7].qNum : null
			};
		});

		var margin = vars.margin,
		    width = vars.width - margin.left - margin.right,
		    height = vars.height - margin.top - margin.bottom;

		if (vars.bar.width) {
			var tempWidth = (vars.bar.width + vars.bar.padding) * vars.bar.total + vars.margin.left + vars.margin.right;
			if (tempWidth > width) {
				width = tempWidth;
			}
		}

		var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

		var y = d3.scale.linear().range([height, 0]);

		var xAxis = d3.svg.axis().scale(x).orient("bottom");

		var yAxis = d3.svg.axis().scale(y).orient("left").ticks(3, "").tickFormat(function (d, i) {
			return roundNumber(d);
		});

		var svg = d3.select("#" + vars.id + "_inner .content").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Create Parent Group layering
		svg.append("g").attr("id", "grid");

		// Set the Y-Axis Max and Min
		var yAxisMax = d3.max(vars.data, function (d) {
			return Math.max(d.measureNum, d.measureNum2 ? d.measureNum2 : 0, d.measureNum3 ? d.measureNum3 : 0, d.measureNum4 ? d.measureNum4 : 0, d.measureNum5 ? d.measureNum5 : 0, d.measureNum6 ? d.measureNum6 : 0, d.measureNum7 ? d.measureNum7 : 0);
		});
		var yAxisMin = d3.min(vars.data, function (d) {
			return Math.min(d.measureNum, d.measureNum2 ? d.measureNum2 : 0, d.measureNum3 ? d.measureNum3 : 0, d.measureNum4 ? d.measureNum4 : 0, d.measureNum5 ? d.measureNum5 : 0, d.measureNum6 ? d.measureNum6 : 0, d.measureNum7 ? d.measureNum7 : 0);
		});
		if (vars.yaxis && vars.yaxis.max && vars.yaxis.max > yAxisMax) {
			yAxisMax = vars.yaxis.max;
		}
		if (vars.yaxis && vars.yaxis.min && vars.yaxis.min < yAxisMin) {
			yAxisMin = vars.yaxis.min;
		}

		x.domain(vars.data.map(function (d) {
			return d.dimension;
		}));
		y.domain([yAxisMin, yAxisMax]);

		// Set the layers
		svg.append("g").attr("id", "grid");
		svg.append("g").attr("id", "measure1");
		svg.append("g").attr("id", "measure2");
		svg.append("g").attr("id", "measure3");
		svg.append("g").attr("id", "measure4");
		svg.append("g").attr("id", "measure5");
		svg.append("g").attr("id", "measure6");
		svg.append("g").attr("id", "measure7");
		svg.append("g").attr("id", "labels");

		svg.select("#grid").append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis).selectAll(".tick text").call(wrap, vars.bar.width ? vars.bar.width : x.rangeBand());

		svg.select("#grid").append("g").attr("class", "y axis").call(yAxis);

		// Add bottom horizontal line (x-axis)
		svg.select("#grid").append("line").attr("x1", 0).attr("y1", height).attr("x2", width).attr("y2", height);

		/* ***********
   * MEASURE 1
   * ***********/
		if (!vars.measure1.type) {
			// if it is a line
			var line1 = d3.svg.line().x(function (d) {
				return x(d.dimension);
			}).y(function (d) {
				return y(d.measureNum);
			});
			// Create the line
			svg.select("#measure1").append("g").attr("id", "line1").append("path").datum(vars.data).attr("class", "line1").attr("transform", "translate(" + x.rangeBand() / 2 + ",0)").attr("d", line1).attr("stroke-dasharray", function (d, i) {
				if (vars.measure1.solidLine) {
					return 0;
				} else {
					return vars.measure1.strokeDashedLine;
				}
			});

			// Add the dots
			svg.select("#measure1").selectAll("dots").data(vars.data).enter().append("circle").attr("class", "dot1").attr("r", vars.measure1.radius).attr("cx", function (d) {
				return x(d.dimension);
			}).attr("cy", function (d) {
				return y(d.measureNum);
			}).attr("transform", "translate(" + x.rangeBand() / 2 + ",0)").on("mousemove", function (d, i) {
				if (vars.tooltip.divid && $("#" + vars.tooltip.divid).length > 0) {
					vars.tooltip.scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
					vars.tooltip.scrollTop = -$("#" + vars.tooltip.divid).offset().top;
				}
				tooltip.style("left", vars.tooltip.scrollLeft + d3.event.pageX - $("." + vars.id + ".d3-tip").width() / 2 - 8 + "px").style("top", function () {
					var position = vars.tooltip.scrollTop + d3.event.pageY - 70 + "px";
					if (vars.tooltip.showAll) {
						position = vars.tooltip.scrollTop + d3.event.pageY - $("." + vars.id + ".d3-tip").height() - 25 + "px";
					}
					return position;
				}).style("display", "inline-block").html(tooltipHtml(d, i, 1));
			}).on("mouseout", function (d, i) {
				tooltip.style("display", "none");
			}).on('click', function (d, i) {
				tooltip.style("display", "none");
				if (vars.enableSelections) {
					vars.this.backendApi.selectValues(0, [d.qElemNumber], true);
				}
			});
		} else {
			// If it is a bar
			svg.select("#measure1").selectAll(".bar").data(vars.data).enter().append("rect").attr("class", "bar1").attr("x", function (d) {
				return x(d.dimension);
			}).attr("width", vars.bar.width ? vars.bar.width / vars.bar.count : x.rangeBand() / vars.bar.count).attr("y", function (d) {
				return y(d.measureNum);
			}).attr("height", function (d) {
				return height - y(d.measureNum);
			}).on("mousemove", function (d, i) {
				if (vars.tooltip.divid && $("#" + vars.tooltip.divid).length > 0) {
					vars.tooltip.scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
					vars.tooltip.scrollTop = -$("#" + vars.tooltip.divid).offset().top;
				}
				tooltip.style("left", vars.tooltip.scrollLeft + d3.event.pageX - $("." + vars.id + ".d3-tip").width() / 2 - 8 + "px").style("top", function () {
					var position = vars.tooltip.scrollTop + d3.event.pageY - 70 + "px";
					if (vars.tooltip.showAll) {
						position = vars.tooltip.scrollTop + d3.event.pageY - $("." + vars.id + ".d3-tip").height() - 25 + "px";
					}
					return position;
				}).style("display", "inline-block").html(tooltipHtml(d, i, 1));
			}).on("mouseout", function (d, i) {
				tooltip.style("display", "none");
			}).on('click', function (d, i) {
				tooltip.style("display", "none");
				if (vars.enableSelections) {
					vars.this.backendApi.selectValues(0, [d.qElemNumber], true);
				}
			});

			// Add the text on top of the bars
			svg.select("#labels").selectAll(".text").data(vars.data).enter().append("text").text(function (d) {
				return roundNumber(d.measureNum);
			}).attr("x", function (d, i) {
				return x(d.dimension) + 1 * (x.rangeBand() / (vars.bar.count * 2)); // position + total width of all bars / total halfs
			}).attr("y", function (d) {
				return y(d.measureNum) - 5;
			}).attr("text-anchor", 'middle');
		}

		/* ***********
   * MEASURE 2
   * ***********/
		if (vars.measure2.label && vars.measure2.visible) {
			if (!vars.measure2.type) {
				// if it is a line
				var line2 = d3.svg.line().x(function (d) {
					return x(d.dimension);
				}).y(function (d) {
					return y(d.measureNum2);
				});
				// Create the line
				svg.select("#measure2").append("g").attr("id", "line2").append("path").datum(vars.data).attr("class", "line2").attr("transform", "translate(" + x.rangeBand() / 2 + ",0)").attr("d", line2).attr("stroke-dasharray", function (d, i) {
					if (vars.measure2.solidLine) {
						return 0;
					} else {
						return vars.measure2.strokeDashedLine;
					}
				});

				// Add the dots
				svg.select("#measure2").selectAll("dots").data(vars.data).enter().append("circle").attr("class", "dot2").attr("r", vars.measure2.radius).attr("cx", function (d) {
					return x(d.dimension);
				}).attr("cy", function (d) {
					return y(d.measureNum2);
				}).attr("transform", "translate(" + x.rangeBand() / 2 + ",0)").on("mousemove", function (d, i) {
					if (vars.tooltip.divid && $("#" + vars.tooltip.divid).length > 0) {
						vars.tooltip.scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
						vars.tooltip.scrollTop = -$("#" + vars.tooltip.divid).offset().top;
					}
					tooltip.style("left", vars.tooltip.scrollLeft + d3.event.pageX - $("." + vars.id + ".d3-tip").width() / 2 - 8 + "px").style("top", function () {
						var position = vars.tooltip.scrollTop + d3.event.pageY - 70 + "px";
						if (vars.tooltip.showAll) {
							position = vars.tooltip.scrollTop + d3.event.pageY - $("." + vars.id + ".d3-tip").height() - 25 + "px";
						}
						return position;
					}).style("display", "inline-block").html(tooltipHtml(d, i, 2));
				}).on("mouseout", function (d, i) {
					tooltip.style("display", "none");
				}).on('click', function (d, i) {
					tooltip.style("display", "none");
					if (vars.enableSelections) {
						vars.this.backendApi.selectValues(0, [d.qElemNumber], true);
					}
				});
			} else {
				// If it is a bar
				svg.select("#measure2").selectAll(".bar2").data(vars.data).enter().append("rect").attr("class", "bar2").attr("x", function (d) {
					if (!vars.measure2.specialBarGrouping) {
						return x(d.dimension) + x.rangeBand() / vars.bar.count * visibleBarCounter(1, 'bar');
					} else if (vars.measure2.specialBarGrouping) {
						return x(d.dimension);
					}
				}).attr("width", vars.bar.width ? vars.bar.width / vars.bar.count : x.rangeBand() / vars.bar.count).attr("y", function (d) {
					if (!vars.measure2.specialBarGrouping || vars.measure2.specialBarGrouping && !vars.measure2.specialBarGroupingAlignment) {
						return y(d.measureNum2);
					} else if (vars.measure2.specialBarGrouping && vars.measure2.specialBarGroupingAlignment) {
						return y(d.measureNum);
					}
				}).attr("height", function (d) {
					return height - y(d.measureNum2);
				}).on("mousemove", function (d, i) {
					if (vars.tooltip.divid && $("#" + vars.tooltip.divid).length > 0) {
						vars.tooltip.scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
						vars.tooltip.scrollTop = -$("#" + vars.tooltip.divid).offset().top;
					}
					tooltip.style("left", vars.tooltip.scrollLeft + d3.event.pageX - $("." + vars.id + ".d3-tip").width() / 2 - 8 + "px").style("top", function () {
						var position = vars.tooltip.scrollTop + d3.event.pageY - 70 + "px";
						if (vars.tooltip.showAll) {
							position = vars.tooltip.scrollTop + d3.event.pageY - $("." + vars.id + ".d3-tip").height() - 25 + "px";
						}
						return position;
					}).style("display", "inline-block").html(tooltipHtml(d, i, 2));
				}).on("mouseout", function (d, i) {
					tooltip.style("display", "none");
				}).on('click', function (d, i) {
					tooltip.style("display", "none");
					if (vars.enableSelections) {
						vars.this.backendApi.selectValues(0, [d.qElemNumber], true);
					}
				});
				// Add the text on the bars
				if (!vars.measure2.specialBarGrouping) {
					svg.select("#labels").selectAll(".text").data(vars.data).enter().append("text").text(function (d) {
						return roundNumber(d.measureNum2);
					}).attr("x", function (d, i) {
						return x(d.dimension) + visibleBarCounter(1, 'bar_label') * (x.rangeBand() / (vars.bar.count * 2)); // position + how many halfs * (total width of all bars / total halfs)
					}).attr("y", function (d) {
						return y(d.measureNum2) - 5;
					}).attr("text-anchor", 'middle');
				}
			}
		}

		/* ***********
   * MEASURE 3
   * ***********/
		if (vars.measure3.label && vars.measure3.visible) {
			if (!vars.measure3.type) {
				// if it is a line
				var line3 = d3.svg.line().x(function (d) {
					return x(d.dimension);
				}).y(function (d) {
					return y(d.measureNum3);
				});
				// Create the line
				svg.select("#measure3").append("g").attr("id", "line3").append("path").datum(vars.data).attr("class", "line3").attr("transform", "translate(" + x.rangeBand() / 2 + ",0)").attr("d", line3).attr("stroke-dasharray", function (d, i) {
					if (vars.measure3.solidLine) {
						return 0;
					} else {
						return vars.measure3.strokeDashedLine;
					}
				});

				// Add the dots
				svg.select("#measure3").selectAll("dots").data(vars.data).enter().append("circle").attr("class", "dot3").attr("r", vars.measure3.radius).attr("cx", function (d) {
					return x(d.dimension);
				}).attr("cy", function (d) {
					return y(d.measureNum3);
				}).attr("transform", "translate(" + x.rangeBand() / 2 + ",0)").on("mousemove", function (d, i) {
					if (vars.tooltip.divid && $("#" + vars.tooltip.divid).length > 0) {
						vars.tooltip.scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
						vars.tooltip.scrollTop = -$("#" + vars.tooltip.divid).offset().top;
					}
					tooltip.style("left", vars.tooltip.scrollLeft + d3.event.pageX - $("." + vars.id + ".d3-tip").width() / 2 - 8 + "px").style("top", function () {
						var position = vars.tooltip.scrollTop + d3.event.pageY - 70 + "px";
						if (vars.tooltip.showAll) {
							position = vars.tooltip.scrollTop + d3.event.pageY - $("." + vars.id + ".d3-tip").height() - 25 + "px";
						}
						return position;
					}).style("display", "inline-block").html(tooltipHtml(d, i, 3));
				}).on("mouseout", function (d, i) {
					tooltip.style("display", "none");
				}).on('click', function (d, i) {
					tooltip.style("display", "none");
					if (vars.enableSelections) {
						vars.this.backendApi.selectValues(0, [d.qElemNumber], true);
					}
				});
			} else {
				// If it is a bar
				svg.select("#measure3").selectAll(".bar3").data(vars.data).enter().append("rect").attr("class", "bar3").attr("x", function (d) {
					return x(d.dimension) + x.rangeBand() / vars.bar.count * visibleBarCounter(2, 'bar');
				}).attr("width", vars.bar.width ? vars.bar.width / vars.bar.count : x.rangeBand() / vars.bar.count).attr("y", function (d) {
					return y(d.measureNum3);
				}).attr("height", function (d) {
					return height - y(d.measureNum3);
				}).on("mousemove", function (d, i) {
					if (vars.tooltip.divid && $("#" + vars.tooltip.divid).length > 0) {
						vars.tooltip.scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
						vars.tooltip.scrollTop = -$("#" + vars.tooltip.divid).offset().top;
					}
					tooltip.style("left", vars.tooltip.scrollLeft + d3.event.pageX - $("." + vars.id + ".d3-tip").width() / 2 - 8 + "px").style("top", function () {
						var position = vars.tooltip.scrollTop + d3.event.pageY - 70 + "px";
						if (vars.tooltip.showAll) {
							position = vars.tooltip.scrollTop + d3.event.pageY - $("." + vars.id + ".d3-tip").height() - 25 + "px";
						}
						return position;
					}).style("display", "inline-block").html(tooltipHtml(d, i, 3));
				}).on("mouseout", function (d, i) {
					tooltip.style("display", "none");
				}).on('click', function (d, i) {
					tooltip.style("display", "none");
					if (vars.enableSelections) {
						vars.this.backendApi.selectValues(0, [d.qElemNumber], true);
					}
				});
				// Add the text on the bars
				svg.select("#labels").selectAll(".text").data(vars.data).enter().append("text").text(function (d) {
					return roundNumber(d.measureNum3);
				}).attr("x", function (d, i) {
					return x(d.dimension) + visibleBarCounter(2, 'bar_label') * (x.rangeBand() / (vars.bar.count * 2)); // position + how many halfs * (total width of all bars / total halfs)
				}).attr("y", function (d) {
					return y(d.measureNum3) - 5;
				}).attr("text-anchor", 'middle');
			}
		}

		/* ***********
   * MEASURE 4
   * ***********/
		if (vars.measure4.label && vars.measure4.visible) {
			if (!vars.measure4.type) {
				// if it is a line
				var line4 = d3.svg.line().x(function (d) {
					return x(d.dimension);
				}).y(function (d) {
					return y(d.measureNum4);
				});
				// Create the line
				svg.select("#measure4").append("g").attr("id", "line4").append("path").datum(vars.data).attr("class", "line4").attr("transform", "translate(" + x.rangeBand() / 2 + ",0)").attr("d", line4).attr("stroke-dasharray", function (d, i) {
					if (vars.measure4.solidLine) {
						return 0;
					} else {
						return vars.measure4.strokeDashedLine;
					}
				});

				// Add the dots
				svg.select("#measure4").selectAll("dots").data(vars.data).enter().append("circle").attr("class", "dot4").attr("r", vars.measure4.radius).attr("cx", function (d) {
					return x(d.dimension);
				}).attr("cy", function (d) {
					return y(d.measureNum4);
				}).attr("transform", "translate(" + x.rangeBand() / 2 + ",0)").on("mousemove", function (d, i) {
					if (vars.tooltip.divid && $("#" + vars.tooltip.divid).length > 0) {
						vars.tooltip.scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
						vars.tooltip.scrollTop = -$("#" + vars.tooltip.divid).offset().top;
					}
					tooltip.style("left", vars.tooltip.scrollLeft + d3.event.pageX - $("." + vars.id + ".d3-tip").width() / 2 - 8 + "px").style("top", function () {
						var position = vars.tooltip.scrollTop + d3.event.pageY - 70 + "px";
						if (vars.tooltip.showAll) {
							position = vars.tooltip.scrollTop + d3.event.pageY - $("." + vars.id + ".d3-tip").height() - 25 + "px";
						}
						return position;
					}).style("display", "inline-block").html(tooltipHtml(d, i, 4));
				}).on("mouseout", function (d, i) {
					tooltip.style("display", "none");
				}).on('click', function (d, i) {
					tooltip.style("display", "none");
					if (vars.enableSelections) {
						vars.this.backendApi.selectValues(0, [d.qElemNumber], true);
					}
				});
			} else {
				// If it is a bar
				svg.select("#measure4").selectAll(".bar4").data(vars.data).enter().append("rect").attr("class", "bar4").attr("x", function (d) {
					return x(d.dimension) + x.rangeBand() / vars.bar.count * visibleBarCounter(3, 'bar');
				}).attr("width", vars.bar.width ? vars.bar.width / vars.bar.count : x.rangeBand() / vars.bar.count).attr("y", function (d) {
					return y(d.measureNum4);
				}).attr("height", function (d) {
					return height - y(d.measureNum4);
				}).on("mousemove", function (d, i) {
					if (vars.tooltip.divid && $("#" + vars.tooltip.divid).length > 0) {
						vars.tooltip.scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
						vars.tooltip.scrollTop = -$("#" + vars.tooltip.divid).offset().top;
					}
					tooltip.style("left", vars.tooltip.scrollLeft + d3.event.pageX - $("." + vars.id + ".d3-tip").width() / 2 - 8 + "px").style("top", function () {
						var position = vars.tooltip.scrollTop + d3.event.pageY - 70 + "px";
						if (vars.tooltip.showAll) {
							position = vars.tooltip.scrollTop + d3.event.pageY - $("." + vars.id + ".d3-tip").height() - 25 + "px";
						}
						return position;
					}).style("display", "inline-block").html(tooltipHtml(d, i, 4));
				}).on("mouseout", function (d, i) {
					tooltip.style("display", "none");
				}).on('click', function (d, i) {
					tooltip.style("display", "none");
					if (vars.enableSelections) {
						vars.this.backendApi.selectValues(0, [d.qElemNumber], true);
					}
				});
				// Add the text on the bars
				svg.select("#labels").selectAll(".text").data(vars.data).enter().append("text").text(function (d) {
					return roundNumber(d.measureNum4);
				}).attr("x", function (d, i) {
					return x(d.dimension) + visibleBarCounter(3, 'bar_label') * (x.rangeBand() / (vars.bar.count * 2)); // position + how many halfs * (total width of all bars / total halfs)
				}).attr("y", function (d) {
					return y(d.measureNum4) - 5;
				}).attr("text-anchor", 'middle');
			}
		}

		/* ***********
   * MEASURE 5
   * ***********/
		if (vars.measure5.label && vars.measure5.visible) {
			if (!vars.measure5.type) {
				// if it is a line
				var line5 = d3.svg.line().x(function (d) {
					return x(d.dimension);
				}).y(function (d) {
					return y(d.measureNum5);
				});
				// Create the line
				svg.select("#measure5").append("g").attr("id", "line5").append("path").datum(vars.data).attr("class", "line5").attr("transform", "translate(" + x.rangeBand() / 2 + ",0)").attr("d", line5).attr("stroke-dasharray", function (d, i) {
					if (vars.measure5.solidLine) {
						return 0;
					} else {
						return vars.measure5.strokeDashedLine;
					}
				});

				// Add the dots
				svg.select("#measure5").selectAll("dots").data(vars.data).enter().append("circle").attr("class", "dot5").attr("r", vars.measure5.radius).attr("cx", function (d) {
					return x(d.dimension);
				}).attr("cy", function (d) {
					return y(d.measureNum5);
				}).attr("transform", "translate(" + x.rangeBand() / 2 + ",0)").on("mousemove", function (d, i) {
					if (vars.tooltip.divid && $("#" + vars.tooltip.divid).length > 0) {
						vars.tooltip.scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
						vars.tooltip.scrollTop = -$("#" + vars.tooltip.divid).offset().top;
					}
					tooltip.style("left", vars.tooltip.scrollLeft + d3.event.pageX - $("." + vars.id + ".d3-tip").width() / 2 - 8 + "px").style("top", function () {
						var position = vars.tooltip.scrollTop + d3.event.pageY - 70 + "px";
						if (vars.tooltip.showAll) {
							position = vars.tooltip.scrollTop + d3.event.pageY - $("." + vars.id + ".d3-tip").height() - 25 + "px";
						}
						return position;
					}).style("display", "inline-block").html(tooltipHtml(d, i, 5));
				}).on("mouseout", function (d, i) {
					tooltip.style("display", "none");
				}).on('click', function (d, i) {
					tooltip.style("display", "none");
					if (vars.enableSelections) {
						vars.this.backendApi.selectValues(0, [d.qElemNumber], true);
					}
				});
			} else {
				// If it is a bar
				svg.select("#measure5").selectAll(".bar5").data(vars.data).enter().append("rect").attr("class", "bar5").attr("x", function (d) {
					return x(d.dimension) + x.rangeBand() / vars.bar.count * visibleBarCounter(4, 'bar');
				}).attr("width", vars.bar.width ? vars.bar.width / vars.bar.count : x.rangeBand() / vars.bar.count).attr("y", function (d) {
					return y(d.measureNum5);
				}).attr("height", function (d) {
					return height - y(d.measureNum5);
				}).on("mousemove", function (d, i) {
					if (vars.tooltip.divid && $("#" + vars.tooltip.divid).length > 0) {
						vars.tooltip.scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
						vars.tooltip.scrollTop = -$("#" + vars.tooltip.divid).offset().top;
					}
					tooltip.style("left", vars.tooltip.scrollLeft + d3.event.pageX - $("." + vars.id + ".d3-tip").width() / 2 - 8 + "px").style("top", function () {
						var position = vars.tooltip.scrollTop + d3.event.pageY - 70 + "px";
						if (vars.tooltip.showAll) {
							position = vars.tooltip.scrollTop + d3.event.pageY - $("." + vars.id + ".d3-tip").height() - 25 + "px";
						}
						return position;
					}).style("display", "inline-block").html(tooltipHtml(d, i, 5));
				}).on("mouseout", function (d, i) {
					tooltip.style("display", "none");
				}).on('click', function (d, i) {
					tooltip.style("display", "none");
					if (vars.enableSelections) {
						vars.this.backendApi.selectValues(0, [d.qElemNumber], true);
					}
				});
				// Add the text on the bars
				svg.select("#labels").selectAll(".text").data(vars.data).enter().append("text").text(function (d) {
					return roundNumber(d.measureNum5);
				}).attr("x", function (d, i) {
					return x(d.dimension) + visibleBarCounter(4, 'bar_label') * (x.rangeBand() / (vars.bar.count * 2)); // position + how many halfs * (total width of all bars / total halfs)
				}).attr("y", function (d) {
					return y(d.measureNum5) - 5;
				}).attr("text-anchor", 'middle');
			}
		}

		/* ***********
   * MEASURE 6
   * ***********/
		if (vars.measure6.label && vars.measure6.visible) {
			if (!vars.measure6.type) {
				// if it is a line
				var line6 = d3.svg.line().x(function (d) {
					return x(d.dimension);
				}).y(function (d) {
					return y(d.measureNum6);
				});
				// Create the line
				svg.select("#measure6").append("g").attr("id", "line6").append("path").datum(vars.data).attr("class", "line6").attr("transform", "translate(" + x.rangeBand() / 2 + ",0)").attr("d", line6).attr("stroke-dasharray", function (d, i) {
					if (vars.measure6.solidLine) {
						return 0;
					} else {
						return vars.measure6.strokeDashedLine;
					}
				});

				// Add the dots
				svg.select("#measure6").selectAll("dots").data(vars.data).enter().append("circle").attr("class", "dot6").attr("r", vars.measure6.radius).attr("cx", function (d) {
					return x(d.dimension);
				}).attr("cy", function (d) {
					return y(d.measureNum6);
				}).attr("transform", "translate(" + x.rangeBand() / 2 + ",0)").on("mousemove", function (d, i) {
					if (vars.tooltip.divid && $("#" + vars.tooltip.divid).length > 0) {
						vars.tooltip.scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
						vars.tooltip.scrollTop = -$("#" + vars.tooltip.divid).offset().top;
					}
					tooltip.style("left", vars.tooltip.scrollLeft + d3.event.pageX - $("." + vars.id + ".d3-tip").width() / 2 - 8 + "px").style("top", function () {
						var position = vars.tooltip.scrollTop + d3.event.pageY - 70 + "px";
						if (vars.tooltip.showAll) {
							position = vars.tooltip.scrollTop + d3.event.pageY - $("." + vars.id + ".d3-tip").height() - 25 + "px";
						}
						return position;
					}).style("display", "inline-block").html(tooltipHtml(d, i, 6));
				}).on("mouseout", function (d, i) {
					tooltip.style("display", "none");
				}).on('click', function (d, i) {
					tooltip.style("display", "none");
					if (vars.enableSelections) {
						vars.this.backendApi.selectValues(0, [d.qElemNumber], true);
					}
				});
			} else {
				// If it is a bar
				svg.select("#measure6").selectAll(".bar6").data(vars.data).enter().append("rect").attr("class", "bar6").attr("x", function (d) {
					return x(d.dimension) + x.rangeBand() / vars.bar.count * visibleBarCounter(5, 'bar');
				}).attr("width", vars.bar.width ? vars.bar.width / vars.bar.count : x.rangeBand() / vars.bar.count).attr("y", function (d) {
					return y(d.measureNum6);
				}).attr("height", function (d) {
					return height - y(d.measureNum6);
				}).on("mousemove", function (d, i) {
					if (vars.tooltip.divid && $("#" + vars.tooltip.divid).length > 0) {
						vars.tooltip.scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
						vars.tooltip.scrollTop = -$("#" + vars.tooltip.divid).offset().top;
					}
					tooltip.style("left", vars.tooltip.scrollLeft + d3.event.pageX - $("." + vars.id + ".d3-tip").width() / 2 - 8 + "px").style("top", function () {
						var position = vars.tooltip.scrollTop + d3.event.pageY - 70 + "px";
						if (vars.tooltip.showAll) {
							position = vars.tooltip.scrollTop + d3.event.pageY - $("." + vars.id + ".d3-tip").height() - 25 + "px";
						}
						return position;
					}).style("display", "inline-block").html(tooltipHtml(d, i, 6));
				}).on("mouseout", function (d, i) {
					tooltip.style("display", "none");
				}).on('click', function (d, i) {
					tooltip.style("display", "none");
					if (vars.enableSelections) {
						vars.this.backendApi.selectValues(0, [d.qElemNumber], true);
					}
				});
				// Add the text on the bars
				svg.select("#labels").selectAll(".text").data(vars.data).enter().append("text").text(function (d) {
					return roundNumber(d.measureNum6);
				}).attr("x", function (d, i) {
					return x(d.dimension) + visibleBarCounter(5, 'bar_label') * (x.rangeBand() / (vars.bar.count * 2)); // position + how many halfs * (total width of all bars / total halfs)
				}).attr("y", function (d) {
					return y(d.measureNum6) - 5;
				}).attr("text-anchor", 'middle');
			}
		}

		/* ***********
   * MEASURE 7
   * ***********/
		if (vars.measure7.label && vars.measure7.visible) {
			if (!vars.measure7.type) {
				// if it is a line
				var line7 = d3.svg.line().x(function (d) {
					return x(d.dimension);
				}).y(function (d) {
					return y(d.measureNum7);
				});
				// Create the line
				svg.select("#measure7").append("g").attr("id", "line7").append("path").datum(vars.data).attr("class", "line7").attr("transform", "translate(" + x.rangeBand() / 2 + ",0)").attr("d", line7).attr("stroke-dasharray", function (d, i) {
					if (vars.measure7.solidLine) {
						return 0;
					} else {
						return vars.measure7.strokeDashedLine;
					}
				});

				// Add the dots
				svg.select("#measure7").selectAll("dots").data(vars.data).enter().append("circle").attr("class", "dot7").attr("r", vars.measure7.radius).attr("cx", function (d) {
					return x(d.dimension);
				}).attr("cy", function (d) {
					return y(d.measureNum7);
				}).attr("transform", "translate(" + x.rangeBand() / 2 + ",0)").on("mousemove", function (d, i) {
					if (vars.tooltip.divid && $("#" + vars.tooltip.divid).length > 0) {
						vars.tooltip.scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
						vars.tooltip.scrollTop = -$("#" + vars.tooltip.divid).offset().top;
					}
					tooltip.style("left", vars.tooltip.scrollLeft + d3.event.pageX - $("." + vars.id + ".d3-tip").width() / 2 - 8 + "px").style("top", function () {
						var position = vars.tooltip.scrollTop + d3.event.pageY - 70 + "px";
						if (vars.tooltip.showAll) {
							position = vars.tooltip.scrollTop + d3.event.pageY - $("." + vars.id + ".d3-tip").height() - 25 + "px";
						}
						return position;
					}).style("display", "inline-block").html(tooltipHtml(d, i, 7));
				}).on("mouseout", function (d, i) {
					tooltip.style("display", "none");
				}).on('click', function (d, i) {
					tooltip.style("display", "none");
					if (vars.enableSelections) {
						vars.this.backendApi.selectValues(0, [d.qElemNumber], true);
					}
				});
			} else {
				// If it is a bar
				svg.select("#measure7").selectAll(".bar7").data(vars.data).enter().append("rect").attr("class", "bar7").attr("x", function (d) {
					return x(d.dimension) + x.rangeBand() / vars.bar.count * visibleBarCounter(6, 'bar');
				}).attr("width", vars.bar.width ? vars.bar.width / vars.bar.count : x.rangeBand() / vars.bar.count).attr("y", function (d) {
					return y(d.measureNum7);
				}).attr("height", function (d) {
					return height - y(d.measureNum7);
				}).on("mousemove", function (d, i) {
					if (vars.tooltip.divid && $("#" + vars.tooltip.divid).length > 0) {
						vars.tooltip.scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
						vars.tooltip.scrollTop = -$("#" + vars.tooltip.divid).offset().top;
					}
					tooltip.style("left", vars.tooltip.scrollLeft + d3.event.pageX - $("." + vars.id + ".d3-tip").width() / 2 - 8 + "px").style("top", function () {
						var position = vars.tooltip.scrollTop + d3.event.pageY - 70 + "px";
						if (vars.tooltip.showAll) {
							position = vars.tooltip.scrollTop + d3.event.pageY - $("." + vars.id + ".d3-tip").height() - 25 + "px";
						}
						return position;
					}).style("display", "inline-block").html(tooltipHtml(d, i, 7));
				}).on("mouseout", function (d, i) {
					tooltip.style("display", "none");
				}).on('click', function (d, i) {
					tooltip.style("display", "none");
					if (vars.enableSelections) {
						vars.this.backendApi.selectValues(0, [d.qElemNumber], true);
					}
				});
				// Add the text on the bars
				svg.select("#labels").selectAll(".text").data(vars.data).enter().append("text").text(function (d) {
					return roundNumber(d.measureNum7);
				}).attr("x", function (d, i) {
					return x(d.dimension) + visibleBarCounter(6, 'bar_label') * (x.rangeBand() / (vars.bar.count * 2)); // position + how many halfs * (total width of all bars / total halfs)
				}).attr("y", function (d) {
					return y(d.measureNum7) - 5;
				}).attr("text-anchor", 'middle');
			}
		}

		/* ***********
   * FOOTER EXPRESSION
   * ***********/
		if (vars.footerExpression) {}
		// vars.this.backendApi.applyPatches([
		// 	{
		// 		"qPath": "/layer1cube/qHyperCubeDef/qDimensions",
		// 		"qOp": "add",
		// 		"qValue": JSON.stringify([{qDef: {qFieldDefs: ""}}])
		// 	},
		// 	{
		// 		"qPath": "/qHyperCubeDef/qMeasures",
		// 		"qOp": "add",
		// 		"qValue": JSON.stringify([{ 
		// 			"qDef" : { 
		// 				"qDef" : "1"//vars.footerExpression
		// 			}, 
		// 			"qSortBy": { 
		// 				"qSortByState": 0, 
		// 				"qSortByFrequency": 0, 
		// 				"qSortByNumeric": 0, 
		// 				"qSortByAscii": 0, 
		// 				"qSortByLoadOrder": 1, 
		// 				"qSortByExpression": 0, 
		// 				"qExpression": { 
		// 					qv: "" 
		// 				} 
		// 			} 
		// 		}]) //+vars.footerExpression
		// 	}
		// ], false).then(function(data){
		// 	console.log(data)
		// });
		// vars.this.backendApi.applyPatches([
		// 	{
		// 		"qPath": "/meta",
		// 		"qOp": "add",
		// 		"qValue": "{ \"data\": \"this is the data\"}"
		// 	}
		// ], false);


		// TOOLTIPS
		if ($("." + vars.id + ".d3-tip").length) {
			$("." + vars.id + ".d3-tip").remove();
		}
		var tooltip = d3.select("body").append("div").attr("class", vars.id + " d3-tip");
		var tooltipHtml = function tooltipHtml(d, i, m) {
			var display = {
				bgColor: vars.measure1.color,
				title: d.dimension,
				label: vars.measure1.label,
				value: roundNumber(d.measureNum)
			};
			if (m && m == 2) {
				display.bgColor = vars.measure2.color;
				display.label = vars.measure2.label;
				display.value = roundNumber(d.measureNum2);
			}
			if (m && m == 3) {
				display.bgColor = vars.measure3.color;
				display.label = vars.measure3.label;
				display.value = roundNumber(d.measureNum3);
			}
			if (m && m == 4) {
				display.bgColor = vars.measure4.color;
				display.label = vars.measure4.label;
				display.value = roundNumber(d.measureNum4);
			}
			if (m && m == 5) {
				display.bgColor = vars.measure5.color;
				display.label = vars.measure5.label;
				display.value = roundNumber(d.measureNum5);
			}
			if (m && m == 6) {
				display.bgColor = vars.measure6.color;
				display.label = vars.measure6.label;
				display.value = roundNumber(d.measureNum6);
			}
			if (m && m == 7) {
				display.bgColor = vars.measure7.color;
				display.label = vars.measure7.label;
				display.value = roundNumber(d.measureNum7);
			}
			// Flex
			var html = "\n\t\t\t\t<div class=\"tt-container\">\n\t\t\t\t\t<div class=\"tt-row\"><div class=\"tt-item-header\">" + display.title + "</div></div>\n\t\t\t";
			if (vars.tooltip.showAll) {
				html += "\n\t\t\t\t\t\t<div class=\"tt-row\">\n\t\t\t\t\t\t\t<div class=\"tt-item-label\"><div class=\"box\" style=\"background-color: " + vars.measure1.color + "\"></div>" + vars.measure1.label + ":</div>\n\t\t\t\t\t\t\t<div class=\"tt-item-value\">" + roundNumber(d.measureNum) + "</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t";
				if (vars.measure2.label && vars.measure2.visible) {
					html += "\n\t\t\t\t\t\t\t<div class=\"tt-row\">\n\t\t\t\t\t\t\t\t<div class=\"tt-item-label\"><div class=\"box\" style=\"background-color: " + vars.measure2.color + "\"></div>" + vars.measure2.label + ":</div>\n\t\t\t\t\t\t\t\t<div class=\"tt-item-value\">" + roundNumber(d.measureNum2) + "</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t";
				}
				if (vars.measure3.label && vars.measure3.visible) {
					html += "\n\t\t\t\t\t\t\t<div class=\"tt-row\">\n\t\t\t\t\t\t\t\t<div class=\"tt-item-label\"><div class=\"box\" style=\"background-color: " + vars.measure3.color + "\"></div>" + vars.measure3.label + ":</div>\n\t\t\t\t\t\t\t\t<div class=\"tt-item-value\">" + roundNumber(d.measureNum3) + "</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t";
				}
				if (vars.measure4.label && vars.measure4.visible) {
					html += "\n\t\t\t\t\t\t\t<div class=\"tt-row\">\n\t\t\t\t\t\t\t\t<div class=\"tt-item-label\"><div class=\"box\" style=\"background-color: " + vars.measure4.color + "\"></div>" + vars.measure4.label + ":</div>\n\t\t\t\t\t\t\t\t<div class=\"tt-item-value\">" + roundNumber(d.measureNum4) + "</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t";
				}
				if (vars.measure5.label && vars.measure5.visible) {
					html += "\n\t\t\t\t\t\t\t<div class=\"tt-row\">\n\t\t\t\t\t\t\t\t<div class=\"tt-item-label\"><div class=\"box\" style=\"background-color: " + vars.measure5.color + "\"></div>" + vars.measure5.label + ":</div>\n\t\t\t\t\t\t\t\t<div class=\"tt-item-value\">" + roundNumber(d.measureNum5) + "</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t";
				}
				if (vars.measure6.label && vars.measure6.visible) {
					html += "\n\t\t\t\t\t\t\t<div class=\"tt-row\">\n\t\t\t\t\t\t\t\t<div class=\"tt-item-label\"><div class=\"box\" style=\"background-color: " + vars.measure6.color + "\"></div>" + vars.measure6.label + ":</div>\n\t\t\t\t\t\t\t\t<div class=\"tt-item-value\">" + roundNumber(d.measureNum6) + "</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t";
				}
				if (vars.measure7.label && vars.measure7.visible) {
					html += "\n\t\t\t\t\t\t\t<div class=\"tt-row\">\n\t\t\t\t\t\t\t\t<div class=\"tt-item-label\"><div class=\"box\" style=\"background-color: " + vars.measure7.color + "\"></div>" + vars.measure7.label + ":</div>\n\t\t\t\t\t\t\t\t<div class=\"tt-item-value\">" + roundNumber(d.measureNum7) + "</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t";
				}
			} else {
				html += "\n\t\t\t\t\t\t<div class=\"tt-row\">\n\t\t\t\t\t\t\t<div class=\"tt-item-label\"><div class=\"box\" style=\"background-color: " + display.bgColor + "\"></div>" + display.label + ":</div>\n\t\t\t\t\t\t\t<div class=\"tt-item-value\">" + display.value + "</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t";
			}

			html += "\n\t\t\t\t</div>\n\t\t\t";

			return html;
		};

		// LEGEND
		if (vars.legend) {
			var drawLegend = function drawLegend() {
				// Alternative chart Legend implementation		
				legend = svg.append('g').attr('class', 'legend').attr('transform', 'translate(' + 0 + ',' + (height + 30 + legendColorBoxSize) + ')');

				// Measure 1
				legend.append('rect').attr('width', legendColorBoxSize).attr('height', legendColorBoxSize).style('fill', vars.measure1.color);

				legend.append('text').attr('x', legendColorBoxSize + legendColorBoxSize / 2).attr('y', legendColorBoxSize * 0.85).text(vars.measure1.label);

				// get the attributes of the measure1 text object, e.g. to get the height and width
				var Measure1BBox = legend.node().getBBox();

				// Measure 2
				if (vars.measure2.label && vars.measure2.visible) {
					legend.append('rect').attr('x', legendColorBoxSize + Measure1BBox.width).attr('width', legendColorBoxSize).attr('height', legendColorBoxSize).style('fill', vars.measure2.color);

					legend.append('text').attr('x', legendColorBoxSize * 2.5 + Measure1BBox.width).attr('y', legendColorBoxSize * 0.85).text(vars.measure2.label);
				}

				// Measure 3
				if (vars.measure3.label && vars.measure3.visible) {
					var Measure2BBox = legend.node().getBBox();

					legend.append('rect').attr('x', legendColorBoxSize + Measure2BBox.width).attr('width', legendColorBoxSize).attr('height', legendColorBoxSize).style('fill', vars.measure3.color);

					legend.append('text').attr('x', legendColorBoxSize * 2.5 + Measure2BBox.width).attr('y', legendColorBoxSize * 0.85).text(vars.measure3.label);
				}

				// Measure 4
				if (vars.measure4.label && vars.measure4.visible) {
					var Measure3BBox = legend.node().getBBox();

					legend.append('rect').attr('x', legendColorBoxSize + Measure3BBox.width).attr('width', legendColorBoxSize).attr('height', legendColorBoxSize).style('fill', vars.measure4.color);

					legend.append('text').attr('x', legendColorBoxSize * 2.5 + Measure3BBox.width).attr('y', legendColorBoxSize * 0.85).text(vars.measure4.label);
				}

				// Measure 5
				if (vars.measure5.label && vars.measure5.visible) {
					var Measure4BBox = legend.node().getBBox();

					legend.append('rect').attr('x', legendColorBoxSize + Measure4BBox.width).attr('width', legendColorBoxSize).attr('height', legendColorBoxSize).style('fill', vars.measure5.color);

					legend.append('text').attr('x', legendColorBoxSize * 2.5 + Measure4BBox.width).attr('y', legendColorBoxSize * 0.85).text(vars.measure5.label);
				}

				// Measure 6
				if (vars.measure6.label && vars.measure6.visible) {
					var Measure5BBox = legend.node().getBBox();

					legend.append('rect').attr('x', legendColorBoxSize + Measure5BBox.width).attr('width', legendColorBoxSize).attr('height', legendColorBoxSize).style('fill', vars.measure6.color);

					legend.append('text').attr('x', legendColorBoxSize * 2.5 + Measure5BBox.width).attr('y', legendColorBoxSize * 0.85).text(vars.measure6.label);
				}

				// Measure 7
				if (vars.measure7.label && vars.measure7.visible) {
					var Measure6BBox = legend.node().getBBox();

					legend.append('rect').attr('x', legendColorBoxSize + Measure6BBox.width).attr('width', legendColorBoxSize).attr('height', legendColorBoxSize).style('fill', vars.measure7.color);

					legend.append('text').attr('x', legendColorBoxSize * 2.5 + Measure6BBox.width).attr('y', legendColorBoxSize * 0.85).text(vars.measure7.label);
				}

				// get and set the horizontal legend alignment for CENTER and RIGHT
				if (vars.legendAlignment == "center") {
					var legendBBox = legend.node().getBBox();
					var alignment = (vars.width - legendBBox.width) / 2;
					legend.attr('transform', 'translate(' + (-margin.left + alignment) + ',' + (height + 30 + legendColorBoxSize) + ')');
				}
				if (vars.legendAlignment == "right") {
					var legendBBox = legend.node().getBBox();
					var alignment = vars.width - legendBBox.width;
					legend.attr('transform', 'translate(' + (-margin.left - margin.right + alignment) + ',' + (height + 30 + legendColorBoxSize) + ')');
				}
			};

			var legendColorBoxSize = vars.font.size == 10 ? 10 : vars.font.size; // font size default value = 10, without this if-clause-workaround the initial legend painting will be incorrect.
			var legend;

			drawLegend();
			var legendBBox = legend.node().getBBox();
			legend.remove();
			var legendBackground = svg.append('rect').attr('class', 'legendBackground').attr('width', legendBBox.width).attr('height', legendBBox.height).attr('y', legendColorBoxSize * -0.15).style('fill', 'white').attr('transform', 'translate(' + 0 + ',' + (height + 30 + legendColorBoxSize) + ')');

			// get and set the horizontal legend background alignment for CENTER and RIGHT
			if (vars.legendAlignment == "center") {
				var alignment = (vars.width - legendBBox.width) / 2;
				legendBackground.attr('transform', 'translate(' + (-margin.left + alignment) + ',' + (height + 30 + legendColorBoxSize) + ')');
			}
			if (vars.legendAlignment == "right") {
				var alignment = vars.width - legendBBox.width;
				legendBackground.attr('transform', 'translate(' + (-margin.left - margin.right + alignment) + ',' + (height + 30 + legendColorBoxSize) + ')');
			}

			drawLegend();
		}

		// WRAP LABELS
		function wrap(text, width) {
			text.each(function () {
				var breakChars = ['/', '&', '-'],
				    text = d3.select(this),
				    textContent = text.text(),
				    spanContent;
				breakChars.forEach(function (char) {
					// Add a space after each break char for the function to use to determine line breaks
					textContent = textContent.replace(char, char + ' ');
				});

				var words = textContent.split(/\s+/).reverse(),
				    word,
				    line = [],
				    lineNumber = 0,
				    lineHeight = 1.1,
				    // ems
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
						breakChars.forEach(function (char) {
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

		//console.info(`%c SenseUI-ComboChart ${vars.v}: `, 'color: red', `#${vars.id} Loaded!`)

		//needed for export
		return qlik.Promise.resolve();
	};

	// define HTML template	
	// me.template = '';

	// The Angular Controller for binding
	me.controller = ["$scope", "$rootScope", "$element", function ($scope, $rootScope, $element) {
		// $scope.$watchCollection("layout.vars.footerExpression", function(data) {
		// 	console.log(data)
		// 	$scope.backendApi.applyPatches([
		// 		{
		// 			"qPath": "/meta",
		// 			"qOp": "add",
		// 			"qValue": `{ \"data\": \"${data}\"}`
		// 		},
		// 		{
		// 			"qPath": "/qHyperCubeDef/qMeasures",
		// 			"qOp": "add",
		// 			"qValue": JSON.stringify([{qDef: {qDef: data}}])
		// 		}
		// 	], false);
		// })
	}];

	return me;
});
