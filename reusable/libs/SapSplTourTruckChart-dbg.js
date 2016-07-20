/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.m.Slider");
jQuery.sap.declare("splReusable.libs.SapSplTourTruckChart");

sap.ui.core.Control
    .extend(
        "splReusable.libs.SapSplTourTruckChart", {
            metadata: {
                properties: {
                    stops: "object[]",
                    width: "string",
                    height: "string",
                    registration: "string",
                    truckiconsrc: "string",
                    size: {
                        type: "sap.ui.core.CSSSize",
                        defaultValue: "100%"
                    }

                },

                aggregations: {

                }
            },
            // set up the inner controls
            init: function () {
                var that = this;
                $(window).resize(function () {
                    that.rerender();
                });


            },
            onAfterRendering: function () {

                if ($("#" + this.getParent().getParent().getParent().getId()).height() !== 0) {
                    this.setHeight(585);
                    this.setWidth($("#" + this.getParent().getParent().getParent().getId()).width() / 2);
                } else {
                    this.setHeight(585);
                    this.setWidth(780);
                }

            },

            // render a composite with a wrapper div
            renderer: function (oRm, oControl) {

                try {
                    var bIsrtl = sap.ui.getCore().getConfiguration().getRTL();
                    var X_index = 0,
                        Y_index = 100,
                        sIconClass = "",
                        sLineThickness = 0,
                        sLineColor = null,
                        isTruckWritten = false,
                        fStopSegmentWidth, fStopSegmentHeight, factor, ETAcolor, iStoplength, fTruckPathFactor = 0,
                        TruckSegmentInitialPathColor = null,
                        bisTruckInBetween = false;
                    var Truck_X_index;
                    X_index = !bIsrtl ? 90 : oControl.getWidth() - 90;

                    if (oControl.getStops().length < 2) {

                        X_index = 100;
                    }

                    oRm
                        .write("<svg xmlns=\"http://www.w3.org/2000/svg\"xmlns:xlink=\"http://www.w3.org/1999/xlink\"  style=\"width: 100%;font-size:0.75rem;padding-top:1.5%; \"");

                    oRm.writeControlData(oControl); // writes the Control ID
                    oRm.addStyle("width", "100%"); // write the

                    oRm.write(">");

                    if (oControl.getStops().length !== 0) {
                        fStopSegmentWidth = oControl.getWidth() / oControl.getStops().length;
                        if (bIsrtl) {
                            fStopSegmentWidth = fStopSegmentWidth * -1;
                            sIconClass = "class=\"SapSplTruckIconMirror\"";
                        }
                        fStopSegmentHeight = oControl.getHeight() / 4;
                        X_index = X_index - fStopSegmentWidth;
                        iStoplength = oControl.getStops().length - 1;
                        for (var i = 0; i < oControl.getStops().length; i++) {
                            X_index = X_index + fStopSegmentWidth;

                            if (isNaN(X_index) || isNaN(fStopSegmentWidth)) {
                                return;
                            }


                            if (oControl.getStops()[i - 1] && oControl.getStops()[i - 1].Planned_DepartureTime) {


                                if (oControl.getStops()[i] && oControl.getStops()[i].ETA && oControl.getStops()[i].Status === "A") {


                                    if (oControl.getStops()[i].ETA < oControl.getStops()[i].Planned_ArrivalTime) {
                                        ETAcolor = "#347335";

                                    } else {
                                        ETAcolor = "#F26B22";
                                    }
                                    oRm.write(" <text  id =\"text1\" x=\"" + (X_index - fStopSegmentWidth / 8) + "\" y=\"" + (Y_index * 0.47) + "\" style=\" fill: #969392\">" + splReusable.libs.SapSplModelFormatters.encodeHTML(splReusable.libs.SapSplModelFormatters.returnTimeValue(oControl.getStops()[i - 1].Planned_DepartureTime)) + "<tspan style=\" fill:" + ETAcolor + " \";\"> (" + splReusable.libs.SapSplModelFormatters.returnTimeValue(oControl.getStops()[i].ETA) + ")  </tspan>" + "</text>");

                                } else {

                                    oRm.write(" <text  id =\"text1\" x=\"" + (X_index - fStopSegmentWidth / 8) + "\" y=\"" + (Y_index * 0.47) + "\" style=\" fill: #969392\">" + splReusable.libs.SapSplModelFormatters.encodeHTML(splReusable.libs.SapSplModelFormatters.returnTimeValue(oControl.getStops()[i - 1].Planned_DepartureTime)) + "</text>");

                                }

                            }


                            if (oControl.getStops()[i + 1] && (oControl.getStops()[i + 1]["Status"] === "C" || oControl.getStops()[i + 1]["LastReportedEvent"] === "com.sap.spl.ArrivedAtDestination")) {
                                sLineThickness = fStopSegmentHeight / 60;
                                sLineColor = "#009de0";
                                factor = 15;
                            } else {



                                sLineThickness = fStopSegmentHeight / 130;
                                sLineColor = "#6D6F73";
                                factor = 20;
                            }


                            if (!isTruckWritten && !(oControl.getStops()[i + 1] && (oControl.getStops()[i + 1]["Status"] === "C"))) {

                                if (oControl.getStops()[i + 1] && oControl.getStops()[i + 1]["LastReportedEvent"] === "com.sap.spl.ArrivedAtDestination") {
                                    Truck_X_index = X_index + fStopSegmentWidth;

                                } else if (!(oControl.getStops()[i + 1] && oControl.getStops()[i + 1]["LastReportedEvent"] === "com.sap.spl.ApproachingDestination") && oControl.getStops()[i]["LastReportedEvent"] === "com.sap.spl.Departure") {

                                    Truck_X_index = X_index + fStopSegmentWidth * 0.2;
                                    fTruckPathFactor = 0.2;
                                    TruckSegmentInitialPathColor = "#FC690D";
                                    bisTruckInBetween = true;

                                } else if (oControl.getStops()[i + 1] && oControl.getStops()[i + 1]["LastReportedEvent"] === "com.sap.spl.ApproachingDestination") {
                                    Truck_X_index = X_index + fStopSegmentWidth * 0.7;
                                    fTruckPathFactor = 0.7;
                                    TruckSegmentInitialPathColor = "#FC690D";
                                    bisTruckInBetween = true;
                                } else {
                                    Truck_X_index = X_index;
                                }
                                oRm.write("<image " + sIconClass + " x=\"" + (Truck_X_index) + "\" y=\"" + Y_index * 0.001 + "\" width=\"" + oControl.getWidth() / 30 + "\" height=\"" + oControl.getWidth() / 35 + "\" xlink:href=\"" + splReusable.libs.SapSplModelFormatters.encodeHTML(oControl.getTruckiconsrc()) + "\" />");

                                if (oControl.getRegistration()) {
                                    oRm
                                        .write(" <text x=\"" + (Truck_X_index) + "\" y=\"" + (Y_index * 0.33) + "\" style=\"stroke: #009de0; fill: #009de0\">" + splReusable.libs.SapSplModelFormatters.encodeHTML(oControl
                                            .getRegistration()) + "</text>");
                                }


                                isTruckWritten = true;

                            }



                            oRm.write("<g>");


                            if (i !== iStoplength) {

                                if (!bisTruckInBetween) {
                                    oRm.write("<line x1=\"" + (X_index) + "\" y1=\"" + (Y_index / 2 + (fStopSegmentHeight / 20)) + "\" x2=\"" + (X_index + fStopSegmentWidth) + "\" y2=\"" + (Y_index / 2 + (fStopSegmentHeight / 20)) + "\" style=\"stroke:" + sLineColor + " ;  stroke-width:" + sLineThickness + "\"/>");
                                    oRm.write("<g transform=\"rotate(40," + X_index + "," + Y_index / 2 + ")\">  <rect x=\"" + X_index + "\" y=\"" + Y_index / 2 + "\" height=\"" + fStopSegmentHeight / factor + "\" width=\"" + fStopSegmentHeight / factor + "\"style=\"stroke: #" + sLineColor + "; fill: " + sLineColor + "\"/> </g>");

                                } else {
                                    oRm.write("<g transform=\"rotate(40," + X_index + "," + Y_index / 2 + ")\">  <rect x=\"" + X_index + "\" y=\"" + Y_index / 2 + "\" height=\"" + (fStopSegmentHeight / factor) * 1.33 + "\" width=\"" + (fStopSegmentHeight / factor) * 1.33 + "\"style=\"stroke: #" + TruckSegmentInitialPathColor + "; fill: " + TruckSegmentInitialPathColor + "\"/> </g>");

                                    oRm.write("<line x1=\"" + (X_index) + "\" y1=\"" + (Y_index / 2 + (fStopSegmentHeight / 20)) + "\" x2=\"" + (X_index + fStopSegmentWidth * fTruckPathFactor) + "\" y2=\"" + (Y_index / 2 + (fStopSegmentHeight / 20)) + "\" style=\"stroke:" + TruckSegmentInitialPathColor + " ;  stroke-width:" + sLineThickness * 2 + "\"/>");

                                    oRm.write("<line x1=\"" + (X_index + fStopSegmentWidth * fTruckPathFactor) + "\" y1=\"" + (Y_index / 2 + (fStopSegmentHeight / 20)) + "\" x2=\"" + (X_index + fStopSegmentWidth) + "\" y2=\"" + (Y_index / 2 + (fStopSegmentHeight / 21)) + "\" style=\"stroke:" + sLineColor + " ;  stroke-width:" + sLineThickness + "\"/>");
                                    bisTruckInBetween = null;

                                }


                            } else {
                                oRm.write("<g transform=\"rotate(40," + X_index + "," + Y_index / 2 + ")\">  <rect x=\"" + X_index + "\" y=\"" + Y_index / 2 + "\" height=\"" + fStopSegmentHeight / factor + "\" width=\"" + fStopSegmentHeight / factor + "\"style=\"stroke: #" + sLineColor + "; fill: " + sLineColor + "\"/> </g>");

                            }

                            oRm
                                .write(" <text  text-anchor=\"middle\" x=\"" + (X_index) + "\" y=\"" + ((0.2 * Y_index) + (fStopSegmentHeight / 20) + (0.48 * Y_index)) + "\" style=\" fill: #0C0C0D\">" + splReusable.libs.SapSplModelFormatters.encodeHTML(oControl.getStops()[i].Name) + "</text>");

                            oRm
                                .write(" <text x=\"" + (X_index) + "\" y=\"" + ((Y_index * 0.2) + (fStopSegmentHeight / 20) + (Y_index * 0.62)) + "\" style=\"  fill: #969392\">" + splReusable.libs.SapSplModelFormatters.encodeHTML(splReusable.libs.SapSplModelFormatters.returnTimeValue(oControl.getStops()[i].Planned_ArrivalTime)) + "</text>");

                            oRm.write("</g>");
                        }

                        X_index = X_index + fStopSegmentWidth;



                    }

                } catch (e) {

                }
            }
        });
