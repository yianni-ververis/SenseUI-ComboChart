// Define properties
var options = {
	initialProperties: {
		qHyperCubeDef: {
			qDimensions: [],
			qMeasures: [],
			qInitialDataFetch: [{
				qWidth: 7,
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
				max: 2
			},
			measures: {
				uses: "measures",
				min: 1,
				max: 7
			},
			sorting: {
				uses: "sorting"
			},
			addons: {  
				uses: "addons",  
				items: {  
					dataHandling: {  
						uses: "dataHandling"  
					}  
				}  
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
							legendAlignment: {
								type: "string",
								component: "radiobuttons",
								label: "Align Legend",
								ref: "vars.legendAlignment",
								options: [{
									value: "left",
									label: "Left"
								}, {
									value: "center",
									label: "Center"
								}, {
									value: "right",
									label: "Right"
								}],
								defaultValue: "center",
								show : function(data) {
									if (data.vars.legend) {
										return true;
									}
								}
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
							yAxisMax: {
								type: "integer",
								expression: "none",
								label: "Y-Axis Max (0 for Auto)",
								defaultValue: 0,
								ref: "vars.yaxis.max"
							},
							yAxisMin: {
								type: "integer",
								expression: "none",
								label: "Y-Axis Min (0 for Auto)",
								defaultValue: 0,
								ref: "vars.yaxis.min"
							},
							// footerExpression: {
							// 	type: "string",
							// 	expression: "none",
							// 	label: "X-Axis Values Expression",
							// 	defaultValue: "",
							// 	ref: "vars.footerExpression"
							// },
							barWidth: {
								type: "integer",
								expression: "none",
								label: "Bar Width (0 for auto scaling)",
								defaultValue: "0",
								ref: "vars.bar.width"
							},
							precision: {
								type: "boolean",
								component: "switch",
								label: "Display decimals?",
								ref: "vars.precision",
								options: [{
									value: true,
									label: "Yes"
								}, {
									value: false,
									label: "No"
								}],
								defaultValue: false
							},
							tooltipVisible: {
								type: "boolean",
								component: "switch",
								label: "Show Tooltip?",
								ref: "vars.tooltip.visible",
								options: [{
									value: true,
									label: "On"
								}, {
									value: false,
									label: "Off"
								}],
								defaultValue: true
							},
							tooltipMashup: {
								type: "boolean",
								component: "switch",
								label: "Will this be in a mashup?",
								ref: "vars.tooltip.mashup",
								options: [{
									value: true,
									label: "Yes"
								}, {
									value: false,
									label: "No"
								}],
								defaultValue: false,
								show : function(data) {
									if (data.vars.tooltip && data.vars.tooltip.visible) {
										return true;
									}
								}
							},
							tooltipMashupDiv: {
								type: "string",
								expression: "none",
								label: "What is the mashup div id to calculate correct positioning",
								defaultValue: "maincontent",
								ref: "vars.tooltip.divid",
								show : function(data) {
									if (data.vars.tooltip && data.vars.tooltip.visible && data.vars.tooltip.mashup) {
										return true;
									}
								}
							},
							tooltipShowAllMeasures: {
								type: "boolean",
								component: "switch",
								label: "Show All measures in the Tooltip?",
								ref: "vars.tooltip.showAll",
								options: [{
									value: true,
									label: "Yes"
								}, {
									value: false,
									label: "No"
								}],
								defaultValue: false,
								show : function(data) {
									if (data.vars.tooltip && data.vars.tooltip.visible) {
										return true;
									}
								}
							},
						},
					},
					measure1: {
						type: "items",
						label: "Measure 1",
						items: {
							measure1type: {
								type: "boolean",
								component: "switch",
								label: "Bar / Line",
								ref: "vars.measure1.type",
								options: [{
									value: true,
									label: "Bar"
								}, {
									value: false,
									label: "Line"
								}],
								defaultValue: true
							},
							measure1color: {
								type: "string",
								expression: "none",
								label: "Color",
								defaultValue: "#4477AA",
								ref: "vars.measure1.color"
							},
							measure1stroke: {
								type: "string",
								expression: "none",
								label: "Line Width/Bar Border Width",
								defaultValue: "1",
								ref: "vars.measure1.stroke"
							},
							measure1colorHover: {
								type: "string",
								expression: "none",
								label: "Hover Color",
								defaultValue: "#77B62A",
								ref: "vars.measure1.colorHover"
							},
							measure1strokeColor: {
								type: "string",
								expression: "none",
								label: "Line/Bar Border Color",
								defaultValue: "#4477AA",
								ref: "vars.measure1.strokeColor"
							},
							measure1strokeColorHover: {
								type: "string",
								expression: "none",
								label: "Line/Bar Border Hover Color",
								defaultValue: "#77B62A",
								ref: "vars.measure1.strokeColorHover"
							},
							measure1solidLine: {
								type: "boolean",
								component: "switch",
								label: "Solid Line / Dashed Line",
								ref: "vars.measure1.solidLine",
								options: [{
									value: true,
									label: "Solid"
								}, {
									value: false,
									label: "Dashed"
								}],
								defaultValue: true,
								show : function(data) {
									if (!data.vars.measure1.type) {
										return true;
									}
								}
							},
							measure1strokeDashedLine: {
								type: "string",
								expression: "none",
								label: "Dashed Line Width",
								defaultValue: "3",
								ref: "vars.measure1.strokeDashedLine",
								show : function(data) {
									if (!data.vars.measure1.type && !data.vars.measure1.solidLine) {
										return true;
									}
								}
							},
							measure1radius: {
								type: "string",
								expression: "none",
								label: "Dot Radius",
								defaultValue: "5",
								ref: "vars.measure1.radius",
								show : function(data) {
									if (!data.vars.measure1.type) {
										return true;
									}
								}
							},
						},
					},
					measure2: {
						type: "items",
						label: "Measure 2",
						show : function(data) {
							if (data.qHyperCubeDef.qMeasures.length>=2) {
								return true;
							}
						},
						// vars.measure2.type: 1 for bar, 0 for Line
						items: {
							measure2type: {
								type: "boolean",
								component: "switch",
								label: "Bar / Line",
								ref: "vars.measure2.type",
								options: [{
									value: true,
									label: "Bar"
								}, {
									value: false,
									label: "Line"
								}],
								defaultValue: false
							},
							measure2visible: {
								type: "boolean",
								component: "switch",
								label: "Visible",
								ref: "vars.measure2.visible",
								options: [{
									value: true,
									label: "Yes"
								}, {
									value: false,
									label: "No"
								}],
								defaultValue: true
							},
							measure2color: {
								type: "string",
								expression: "none",
								label: "Color",
								defaultValue: "#ec5e08",
								ref: "vars.measure2.color"
							},
							measure2colorHover: {
								type: "string",
								expression: "none",
								label: "Hover Color",
								defaultValue: "#77B62A",
								ref: "vars.measure2.colorHover"
							},
							measure2stroke: {
								type: "string",
								expression: "none",
								label: "Line Width/Bar Border Width",
								defaultValue: "1",
								ref: "vars.measure2.stroke"
							},
							measure2strokeColor: {
								type: "string",
								expression: "none",
								label: "Line/Bar Border Color",
								defaultValue: "#ec5e08",
								ref: "vars.measure2.strokeColor"
							},
							measure2strokeColorHover: {
								type: "string",
								expression: "none",
								label: "Line/Bar Border Hover Color",
								defaultValue: "#77B62A",
								ref: "vars.measure2.strokeColorHover"
							},
							measure2solidLine: {
								type: "boolean",
								component: "switch",
								label: "Solid Line / Dashed Line",
								ref: "vars.measure2.solidLine",
								options: [{
									value: true,
									label: "Solid"
								}, {
									value: false,
									label: "Dashed"
								}],
								defaultValue: true,
								show : function(data) {
									if (!data.vars.measure2.type) {
										return true;
									}
								}
							},
							measure2strokeDashedLine: {
								type: "string",
								expression: "none",
								label: "Dashed Line Width",
								defaultValue: "3",
								ref: "vars.measure2.strokeDashedLine",
								show : function(data) {
									if (!data.vars.measure2.type && !data.vars.measure2.solidLine) {
										return true;
									}
								}
							},
							measure2radius: {
								type: "string",
								expression: "none",
								label: "Dot Radius",
								defaultValue: "5",
								ref: "vars.measure2.radius",
								show : function(data) {
									if (!data.vars.measure2.type) {
										return true;
									}
								}
							},
						}
					},
					measure3: {
						type: "items",
						label: "Measure 3",
						show : function(data) {
							if (data.qHyperCubeDef.qMeasures.length>=3) {
								return true;
							}
						},
						items: {
							measure3type: {
								type: "boolean",
								component: "switch",
								label: "Bar / Line",
								ref: "vars.measure3.type",
								options: [{
									value: true,
									label: "Bar"
								}, {
									value: false,
									label: "Line"
								}],
								defaultValue: false
							},
							measure3visible: {
								type: "boolean",
								component: "switch",
								label: "Visible",
								ref: "vars.measure3.visible",
								options: [{
									value: true,
									label: "Yes"
								}, {
									value: false,
									label: "No"
								}],
								defaultValue: true
							},
							measure3color: {
								type: "string",
								expression: "none",
								label: "Color",
								defaultValue: "#1e9fb3",
								ref: "vars.measure3.color"
							},
							measure3colorHover: {
								type: "string",
								expression: "none",
								label: "Hover Color",
								defaultValue: "#77B62A",
								ref: "vars.measure3.colorHover"
							},
							measure3stroke: {
								type: "string",
								expression: "none",
								label: "Line Width/Bar Border",
								defaultValue: "1",
								ref: "vars.measure3.stroke"
							},
							measure3strokeColor: {
								type: "string",
								expression: "none",
								label: "Line/Bar Border Color",
								defaultValue: "#1e9fb3",
								ref: "vars.measure3.strokeColor"
							},
							measure3strokeColorHover: {
								type: "string",
								expression: "none",
								label: "Line/Bar Border Hover Color",
								defaultValue: "#77B62A",
								ref: "vars.measure3.strokeColorHover"
							},
							measure3solidLine: {
								type: "boolean",
								component: "switch",
								label: "Solid Line / Dashed Line",
								ref: "vars.measure3.solidLine",
								options: [{
									value: true,
									label: "Solid"
								}, {
									value: false,
									label: "Dashed"
								}],
								defaultValue: true,
								show : function(data) {
									if (!data.vars.measure3.type) {
										return true;
									}
								}
							},
							measure3strokeDashedLine: {
								type: "string",
								expression: "none",
								label: "Dashed Line Width",
								defaultValue: "3",
								ref: "vars.measure3.strokeDashedLine",
								show : function(data) {
									if (!data.vars.measure3.type && !data.vars.measure3.solidLine) {
										return true;
									}
								}
							},
							measure3radius: {
								type: "string",
								expression: "none",
								label: "Dot Radius",
								defaultValue: "5",
								ref: "vars.measure3.radius",
								show : function(data) {
									if (!data.vars.measure3.type) {
										return true;
									}
								}
							},
						}
					},
					measure4: {
						type: "items",
						label: "Measure 4",
						show : function(data) {
							if (data.qHyperCubeDef.qMeasures.length>=4) {
								return true;
							}
						},
						items: {
							measure4type: {
								type: "boolean",
								component: "switch",
								label: "Bar / Line",
								ref: "vars.measure4.type",
								options: [{
									value: true,
									label: "Bar"
								}, {
									value: false,
									label: "Line"
								}],
								defaultValue: false
							},
							measure4visible: {
								type: "boolean",
								component: "switch",
								label: "Visible",
								ref: "vars.measure4.visible",
								options: [{
									value: true,
									label: "Yes"
								}, {
									value: false,
									label: "No"
								}],
								defaultValue: true
							},
							measure4color: {
								type: "string",
								expression: "none",
								label: "Color",
								defaultValue: "#19ae4b",
								ref: "vars.measure4.color"
							},
							measure4colorHover: {
								type: "string",
								expression: "none",
								label: "Hover Color",
								defaultValue: "#77B62A",
								ref: "vars.measure4.colorHover"
							},
							measure4stroke: {
								type: "string",
								expression: "none",
								label: "Line Width/Bar Border",
								defaultValue: "1",
								ref: "vars.measure4.stroke"
							},
							measure4strokeColor: {
								type: "string",
								expression: "none",
								label: "Line/Bar Border Color",
								defaultValue: "#19ae4b",
								ref: "vars.measure4.strokeColor"
							},
							measure4strokeColorHover: {
								type: "string",
								expression: "none",
								label: "Line/Bar Border Hover Color",
								defaultValue: "#77B62A",
								ref: "vars.measure4.strokeColorHover"
							},
							measure4solidLine: {
								type: "boolean",
								component: "switch",
								label: "Solid Line / Dashed Line",
								ref: "vars.measure4.solidLine",
								options: [{
									value: true,
									label: "Solid"
								}, {
									value: false,
									label: "Dashed"
								}],
								defaultValue: true,
								show : function(data) {
									if (!data.vars.measure4.type) {
										return true;
									}
								}
							},
							measure4strokeDashedLine: {
								type: "string",
								expression: "none",
								label: "Dashed Line Width",
								defaultValue: "3",
								ref: "vars.measure4.strokeDashedLine",
								show : function(data) {
									if (!data.vars.measure4.type && !data.vars.measure4.solidLine) {
										return true;
									}
								}
							},
							measure4radius: {
								type: "string",
								expression: "none",
								label: "Dot Radius",
								defaultValue: "5",
								ref: "vars.measure4.radius",
								show : function(data) {
									if (!data.vars.measure4.type) {
										return true;
									}
								}
							},
						}
					},
					measure5: {
						type: "items",
						label: "Measure 5",
						show : function(data) {
							if (data.qHyperCubeDef.qMeasures.length>=5) {
								return true;
							}
						},
						items: {
							measure5type: {
								type: "boolean",
								component: "switch",
								label: "Bar / Line",
								ref: "vars.measure5.type",
								options: [{
									value: true,
									label: "Bar"
								}, {
									value: false,
									label: "Line"
								}],
								defaultValue: false
							},
							measure5visible: {
								type: "boolean",
								component: "switch",
								label: "Visible",
								ref: "vars.measure5.visible",
								options: [{
									value: true,
									label: "Yes"
								}, {
									value: false,
									label: "No"
								}],
								defaultValue: true
							},
							measure5color: {
								type: "string",
								expression: "none",
								label: "Color",
								defaultValue: "#ff4040",
								ref: "vars.measure5.color"
							},
							measure5colorHover: {
								type: "string",
								expression: "none",
								label: "Hover Color",
								defaultValue: "#77B62A",
								ref: "vars.measure5.colorHover"
							},
							measure5stroke: {
								type: "string",
								expression: "none",
								label: "Line Width/Bar Border",
								defaultValue: "1",
								ref: "vars.measure5.stroke"
							},
							measure5strokeColor: {
								type: "string",
								expression: "none",
								label: "Line/Bar Border Color",
								defaultValue: "#ff4040",
								ref: "vars.measure5.strokeColor"
							},
							measure5strokeColorHover: {
								type: "string",
								expression: "none",
								label: "Line/Bar Border Hover Color",
								defaultValue: "#77B62A",
								ref: "vars.measure5.strokeColorHover"
							},
							measure5solidLine: {
								type: "boolean",
								component: "switch",
								label: "Solid Line / Dashed Line",
								ref: "vars.measure5.solidLine",
								options: [{
									value: true,
									label: "Solid"
								}, {
									value: false,
									label: "Dashed"
								}],
								defaultValue: true,
								show : function(data) {
									if (!data.vars.measure5.type) {
										return true;
									}
								}
							},
							measure5strokeDashedLine: {
								type: "string",
								expression: "none",
								label: "Dashed Line Width",
								defaultValue: "3",
								ref: "vars.measure5.strokeDashedLine",
								show : function(data) {
									if (!data.vars.measure5.type && !data.vars.measure5.solidLine) {
										return true;
									}
								}
							},
							measure5radius: {
								type: "string",
								expression: "none",
								label: "Dot Radius",
								defaultValue: "5",
								ref: "vars.measure5.radius",
								show : function(data) {
									if (!data.vars.measure5.type) {
										return true;
									}
								}
							},
						}
					},
					measure6: {
						type: "items",
						label: "Measure 6",
						show : function(data) {
							if (data.qHyperCubeDef.qMeasures.length>=6) {
								return true;
							}
						},
						items: {
							measure6type: {
								type: "boolean",
								component: "switch",
								label: "Bar / Line",
								ref: "vars.measure6.type",
								options: [{
									value: true,
									label: "Bar"
								}, {
									value: false,
									label: "Line"
								}],
								defaultValue: false
							},
							measure6visible: {
								type: "boolean",
								component: "switch",
								label: "Visible",
								ref: "vars.measure6.visible",
								options: [{
									value: true,
									label: "Yes"
								}, {
									value: false,
									label: "No"
								}],
								defaultValue: true
							},
							measure6color: {
								type: "string",
								expression: "none",
								label: "Color",
								defaultValue: "#ffc342",
								ref: "vars.measure6.color"
							},
							measure6colorHover: {
								type: "string",
								expression: "none",
								label: "Hover Color",
								defaultValue: "#77B62A",
								ref: "vars.measure6.colorHover"
							},
							measure6stroke: {
								type: "string",
								expression: "none",
								label: "Line Width/Bar Border",
								defaultValue: "1",
								ref: "vars.measure6.stroke"
							},
							measure6strokeColor: {
								type: "string",
								expression: "none",
								label: "Line/Bar Border Color",
								defaultValue: "#ffc342",
								ref: "vars.measure6.strokeColor"
							},
							measure6strokeColorHover: {
								type: "string",
								expression: "none",
								label: "Line/Bar Border Hover Color",
								defaultValue: "#77B62A",
								ref: "vars.measure6.strokeColorHover"
							},
							measure6solidLine: {
								type: "boolean",
								component: "switch",
								label: "Solid Line / Dashed Line",
								ref: "vars.measure6.solidLine",
								options: [{
									value: true,
									label: "Solid"
								}, {
									value: false,
									label: "Dashed"
								}],
								defaultValue: true,
								show : function(data) {
									if (!data.vars.measure6.type) {
										return true;
									}
								}
							},
							measure6strokeDashedLine: {
								type: "string",
								expression: "none",
								label: "Dashed Line Width",
								defaultValue: "3",
								ref: "vars.measure6.strokeDashedLine",
								show : function(data) {
									if (!data.vars.measure6.type && !data.vars.measure6.solidLine) {
										return true;
									}
								}
							},
							measure6radius: {
								type: "string",
								expression: "none",
								label: "Dot Radius",
								defaultValue: "5",
								ref: "vars.measure6.radius",
								show : function(data) {
									if (!data.vars.measure6.type) {
										return true;
									}
								}
							},
						}
					},
					measure7: {
						type: "items",
						label: "Measure 7 - Footer KPI",
						show : function(data) {
							if (data.qHyperCubeDef.qMeasures.length>=7) {
								return true;
							}
						},
						items: {
						}
					}
				}
			}
		}
	}
};

define(options);