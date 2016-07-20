/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splReusable.libs.SapSplEnums");

/**
 * @description Enum to hold static string values.
 * @since 1.0
 * @namespace SPL Enumerations
 * @example oSapSplEnums.fatal|oSapSplEnums.info
 * @public
 */
var SapSplEnums = {
    fatal: "Fatal",
    info: "Information",
    error: "Error",
    appl: "appl",
    config: "config",
    util: "utlils",
    missing_parameter: "Parameter missing. Please pass all parameters",
    dummy: "Dummy",
    configJSON: "ConfigJSON",
    flag: "Flag",
    RootApp: "app",
    Init: "init",
    HomePage: "splView.tileContainer.MasterTileContainer",
    PDFHELP: "pdf",
    HTMLHELP: "html",
    REDIRPATH: "./logout/index.html",
    LOGOUTPAGE: "/logout/index.html",
    fuzzyThreshold: 0.3,
    numberOfRecords: 50,
    REFERRERPATH: "logout/index.html",
    TILESTATELOADED: "Loaded",
    TILESTATELOADING: "Loading",
    TILESTATEFAILED: "Failed",
    APPNAME: "SAP Networked Logistics Hub",
    VehiclePositionsPollingTime: 60000,
    IncidentOccurencePollingTime: 60000,
    LiveFeedPollingTime: 60000,
    ChatBoxFetchThreshHold: 20,
    DESKTOP_TYPE: "D",
    COMBI_TYPE: "C",
    PHONE_TYPE: "P",
    TABLET_TYPE: "T",
    REQUEST_ABORTED: "Request aborted"
};
