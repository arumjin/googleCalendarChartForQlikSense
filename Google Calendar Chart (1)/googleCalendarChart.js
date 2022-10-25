define([
	"qlik", 
	"//www.gstatic.com/charts/loader.js"
//	"css!./googleCalendarChart.css"
],
	function (qlik) {
        'use strict';
        return {
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
						max: 1
					},
					sorting: {
						uses: "sorting"
					},
					addons: {
						uses: "addons"
					},
					appearance: {
						uses: "settings",
						items: {
							cellsizing: {
								type: "items",
								label: "Cell Sizing",
								items: {
									autosizing: {
										ref: "prop.autosizing",
										type: "string",
										component: "buttongroup",
										label: "Cell sizing",
										defaultValue: "auto",
										options: [
											{value: "auto", label: "Fit to Width"},
											{value: "cell", label: "Cell sizing"}
										]
									},
									sizing: {
										ref: "prop.cellsize",
										type: "number",
										component: "slider",
										label: "Cell size",
										min: 5,
										max: 30,
										defaultValue: 14,
										show: function(data) {
											return data.prop.autosizing == "cell";
										}
									}							
								}
							},
							colorpick: {
								type: "items",
								label: "Colors and legend",
								items: {
									minColor: {
										ref: "prop.minColor",
										type: "object",
										component: "color-picker",
										label: "min color",
										defaultValue: {color:"ffffff"}
									},
									maxColor: {
										ref: "prop.maxColor",
										type: "object",
										component: "color-picker",
										label: "max color",
										defaultValue: {color:"#006580"}
									},
									showLegend: {
										ref: "prop.showLegend",
										type: "boolean",
										component: "switch",
										label: "Show legend",
										defaultValue: false,
										options:[{
											value: true,
											label: "Show"
											},{
											value: false,
											label: "Hide"
										}]
									}						
								}
							}

						}

					}
				}
			},
			support: {
				snapshot: true,
				export: true,
				exportData: true
			},
			initialProperties: {
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [
						{
							qWidth: 2,
							qHeight: 5000
						}
					]
				}
			},
			paint: function ( $element, layout ) {

				var hc = layout.qHyperCube;
				$element.empty();
				var contenttag=layout.qInfo.qId+"_content";
				var cellsize = $element.width()/58;
				if (layout.prop.autosizing=="cell") {
					cellsize=layout.prop.cellsize;
				}
				google.charts.load("current", {packages:["calendar"]});
      			google.charts.setOnLoadCallback(drawChart);
				function drawChart() { 
					const qDataArray= [];
					qDataArray.push([{ type: 'date', id: 'Date' }, { type: 'number', id: 'Measure' }]);
					for (var r = 0; r < hc.qDataPages[0].qMatrix.length; r++) {
						qDataArray.push([new Date(hc.qDataPages[0].qMatrix[r][0].qText), hc.qDataPages[0].qMatrix[r][1].qText]);
					}
					var dataTable = new google.visualization.arrayToDataTable(qDataArray);
					var chart = new google.visualization.Calendar($element[0]);
					var options = {
						colorAxis: {
							colors: [layout.prop.minColor.color, layout.prop.maxColor.color]
						},
						calendar: {
						  cellSize: cellsize,
						  focusedCellColor: {
							stroke: '#d3362d',
							strokeOpacity: 1,
							strokeWidth: 1,
						  }
						}
					};
					google.visualization.events.addListener(chart, 'ready', function () {
					   if (layout.prop.showLegend==false) {
						   $($('#'+contenttag+' text')[0]).hide();
						   $($('#'+contenttag+' text')[1]).hide();
						   $($('#'+contenttag+' text')[2]).hide();
						   $('#'+contenttag+' linearGradient').hide();
						   $('#'+contenttag).find('[fill-opacity="1"]').hide();
						}
					});
					chart.draw(dataTable, options);
			   }
			}
        };
    } );