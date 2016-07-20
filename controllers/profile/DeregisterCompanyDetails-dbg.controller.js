/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.profile.DeregisterCompanyDetails", {

    oSourceInstance: null,

    companyModel: null,

    onInit: function () {
        sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(oSapSplUtils.getCompanyDetails()), "sapSplCompanyDetailsModel");
    },
    onBeforeRendering: function () {

    },
    onAfterRendering: function () {

    },
    onExit: function () {

    },

    /**
     * @description Stub to be invoked during every instantiation
     * @private
     * @internal
     * @since 1.0.1
     */
    onBeforeShow: function () {
        var that = this;
        sap.ui.getCore().getModel("sapSplCompanyDetailsModel").refresh();

        function __init__(instance) {
            var _execute = {
                truckData: function () {

                    var i = instance;

                    sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel({}), "compDeregSharedTrucksModel");

                    oSapSplAjaxFactory.fireAjaxCall({
                        url: oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/appl.xsodata/SharedList?$format=json&$filter=isShared eq 1"),
                        method: "GET",
                        async: true,
                        success: jQuery.proxy(function (oResult) {
                            sap.ui.getCore().getModel("compDeregSharedTrucksModel").setData(oResult.d);
                            sap.ui.getCore().getModel("compDeregSharedTrucksModel").refresh();
                            this.byId("sapSplTruckAndTourDataTable").setBusy(false);
                        }, i),
                        error: jQuery.proxy(function () {
                            this.byId("sapSplTruckAndTourDataTable").setBusy(false);
                        }, i)
                    });
                },
                truckCount: function () {
                    var i = instance;

                    oSapSplAjaxFactory.fireAjaxCall({
                        url: oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/appl.xsodata/MyTrackableObjects/$count/?$filter=(OwnerID eq X'" + oSapSplUtils.base64ToHex(oSapSplUtils.getCompanyDetails()["UUID"]) + "' and isDeleted eq '0')"),
                        method: "GET",
                        async: true,
                        success: jQuery.proxy(function (oResult) {
                            this.byId("sapSplTotalTruckTerminationText").setText(oResult);
                            this.byId("sapSplTotalTruckTerminationText").setBusy(false);
                        }, i),
                        error: jQuery.proxy(function () {
                            this.byId("sapSplTotalTruckTerminationText").setBusy(false);
                        }, i)
                    });
                },
                tourCount: function () {
                    var i = instance;

                    oSapSplAjaxFactory.fireAjaxCall({
                        url: oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/appl.xsodata/Tours/$count/?$filter=(OwnerID eq X'" + oSapSplUtils.base64ToHex(oSapSplUtils.getCompanyDetails()["UUID"]) + "' and isDeleted eq '0')"),
                        method: "GET",
                        async: true,
                        success: jQuery.proxy(function (oResult) {
                            this.byId("sapSplTotalTourTerminationText").setText(oResult);
                            this.byId("sapSplTotalTourTerminationText").setBusy(false);
                        }, i),
                        error: jQuery.proxy(function () {
                            this.byId("sapSplTotalTourTerminationText").setBusy(false);
                        }, i)
                    });
                },
                locationObjects: function () {
                    var i = instance;

                    var aResultModel = [{
                        name: oSapSplUtils.getBundle().getText("GEOFENCE_LIST_DEREG_COMPANY"),
                        value: 0
                    }, {
                        name: oSapSplUtils.getBundle().getText("POI_LIST_DEREG_COMPANY"),
                        value: 0
                    }];

                    sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel({
                        results: aResultModel
                    }), "compDeregLocationObjectModel");

                    oSapSplAjaxFactory.fireAjaxCall({
                        url: oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/appl.xsodata/MyLocations/$count/?$filter=(Type eq 'L00002')"),
                        method: "GET",
                        async: true,
                        success: jQuery.proxy(function (oResult) {
                            aResultModel[0]["value"] = oResult;
                            sap.ui.getCore().getModel("compDeregLocationObjectModel").getData()["results"] = aResultModel;
                            sap.ui.getCore().getModel("compDeregLocationObjectModel").refresh();
                        }, i),
                        error: jQuery.proxy(function () {
                            this.byId("sapSplTotalTourTerminationText").setBusy(false);
                        }, i)
                    });

                    oSapSplAjaxFactory.fireAjaxCall({
                        url: oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/appl.xsodata/MyLocations/$count/?$filter=(Type eq 'L00001')"),
                        method: "GET",
                        async: true,
                        success: jQuery.proxy(function (oResult) {
                            aResultModel[1]["value"] = oResult;
                            sap.ui.getCore().getModel("compDeregLocationObjectModel").getData()["results"] = aResultModel;
                            sap.ui.getCore().getModel("compDeregLocationObjectModel").refresh();
                        }, i),
                        error: jQuery.proxy(function () {
                            this.byId("sapSplTotalTourTerminationText").setBusy(false);
                        }, i)
                    });
                },
                buPaConnections: function () {
                    var i = instance;

                    oSapSplAjaxFactory.fireAjaxCall({
                        url: oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/appl.xsodata/MyBusinessPartners/$count/?$filter=(isOwner eq 0)"),
                        method: "GET",
                        async: true,
                        success: jQuery.proxy(function (oResult) {
                            this.byId("sapSplCompDeregBupaConnectionCountText").setText(oResult);
                            this.byId("sapSplCompDeregBupaConnectionCountText").setBusy(false);
                        }, i),
                        error: jQuery.proxy(function () {
                            this.byId("sapSplCompDeregBupaConnectionCountText").setBusy(false);
                        }, i)
                    });
                }

            };

            for (var key in _execute) {
                if (_execute.hasOwnProperty(key)) {
                    _execute[key]();
                }
            }

        }

        __init__(that);

    }
});
