/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
$.sap.require("sap.ui.core.util.Export");
$.sap.require("sap.ui.core.util.ExportTypeCSV");

sap.ui.controller("splController.logger.Logger", {
    onInit: function () {

        var oLogObject = {
                Logs: []
            },

            oModel = new sap.ui.model.json.JSONModel(),

            /*Maintain a master collection of supported UI5 Log versions*/
            oLogLevelData = {
                levels: [{
                    name: "None",
                    value: -1
                }, {
                    name: "Trace",
                    value: 5

                }, {
                    name: "Debug",
                    value: 4
                }, {
                    name: "Info",
                    value: 3
                }, {
                    name: "Warning",
                    value: 2
                }, {
                    name: "Error",
                    value: 1
                }, {
                    name: "Fatal",
                    value: 0
                }]
            };

        oLogObject.Logs = jQuery.sap.log.getLogEntries();

        oModel.setData(oLogObject);

        this.byId("sapSplLogTable").setModel(oModel);

        this.byId("sapSplLogHeaderLevelSelect").setModel(new sap.ui.model.json.JSONModel(oLogLevelData));

        this.byId("sapSplLogHeaderCount").setText("SAP Networked Logistics Hub (" + encodeURIComponent(oLogObject.Logs.length || 0) + ")");

    },

    onClose: function () {

    },

    onAfterRendering: function () {

        this.byId("sapSplLogExportToCSV").setTooltip(oSapSplUtils.getBundle().getText("DOWNLOAD_LOG_TO_CSV"));

    },


    /**
     * @description Use UI5 core functionality for download of CSV instead of custom CSV preparation
     * @since 1.0
     * @private
     * @param oEvent {Object} Link press event object callback parameter
     *
     */
    handleLogExportToCSV: function () {

        var oExportObject = new sap.ui.core.util.Export({
            exportType: new sap.ui.core.util.ExportTypeCSV({
                separatorCharacter: ",",
                fileExtension: "csv",
                mimeType: "application/excel",
                charset: "UTF-8"
            }),
            models: this.byId("sapSplLogTable").getModel(),
            rows: {
                path: "/Logs"
            },
            columns: [{
                name: "Component",
                template: {
                    content: "{component}"
                }
            }, {
                name: "Description",
                template: {
                    content: "{details}"
                }
            }, {
                name: "Level",
                template: {
                    content: "{level}"
                }
            }, {
                name: "Message",
                template: {
                    content: "{message}"
                }
            }, {
                name: "Date",
                template: {
                    content: {
                        parts: ["date"],
                        formatter: function (sValue) {

                            return sap.ui.core.format.DateFormat.getDateInstance({
                                pattern: "MMM dd, yyyy",
                                style: "short"
                            }, sap.ui.getCore().getConfiguration().getLocale()).format(new Date(sValue), true);
                        }
                    }
                }
            }, {
                name: "Time",
                template: {
                    content: {
                        parts: ["timestamp"],
                        formatter: function (sValue) {

                            return sap.ui.core.format.DateFormat.getTimeInstance({
                                pattern: "HH:mm:ss",
                                style: "long"
                            }, sap.ui.getCore().getConfiguration().getLocale()).format(new Date(sValue), true);
                        }
                    }
                }
            }]
        });

        oExportObject.saveFile().always(function () {
            this.destroy();
        });

    },

    handleLevelChangeEvent: function (oEvent) {
        var oLevel = oEvent.getParameter("selectedItem").getBindingContext().getProperty("value");
        this.byId("sapSplLogTable").getBinding("items").filter((oLevel > -1) ? new sap.ui.model.Filter("level", sap.ui.model.FilterOperator.EQ, oLevel) : null);
    }
});
