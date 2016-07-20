/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
$.sap.declare("splReusable.libs.SapSplTileRefresher");

var oSapSplTileRefresher = {
    oTileModel: new sap.ui.model.json.JSONModel(),

    sPageId: "__tile0-splView.tileContainer.MasterTileContainer--masterTileContainerPage-",

    oContextObject: null,

    /* CSNFIX : 0120031469 0000760596 2014 - Added Status ne '1' to fetch the secondary count */
    tileConfig: {
        "myBusinessPartners": {
            "tileSize": "L",
            "frameType": "OneByOne",
            "tileHeader": null,
            "tileSubheader": null,
            "tileBGImage": null,
            "tileTotalCountText": oSapSplUtils.getBundle().getText("SPL_TOTAL_COUNT_TEXT"),
            "tileService": {
                "primaryService": "/MyBusinessPartners/$count/?$filter=(BasicInfo_Type eq 'O' and isOwner ne 1)",
                "secondaryService": "/MyBusinessPartners/$count/?$filter=((RequestStatus ne '1' or Status ne '1') and isOwner ne 1)"
            },
            "tileScale": oSapSplUtils.getBundle().getText("CONNECTIONS_LABEL_BUPA_TILE")
        },
        "myUsers": {
            "tileSize": "L",
            "frameType": "OneByOne",
            "tileHeader": null,
            "tileSubheader": null,
            "tileBGImage": null,
            "tileTotalCountText": oSapSplUtils.getBundle().getText("SPL_TOTAL_COUNT_TEXT"),
            "tileService": {
                "primaryService": "/MyUsers/$count/?$filter=(BasicInfo_Type eq 'P' and isMyself ne 1)",
                "secondaryService": "/MyUsers/$count/?$filter=(RequestStatus ne '1' and isMyself ne 1)"
            },
            "tileScale": oSapSplUtils.getBundle().getText("USERS_LABEL_USERS_TILE")
        },
        "vehicles": {
            "tileSize": "L",
            "frameType": "OneByOne",
            "tileHeader": null,
            "tileSubheader": null,
            "tileBGImage": null,
            "tileTotalCountText": oSapSplUtils.getBundle().getText("FILTER_LABEL_ACTIVE"),
            "tileService": {
                "primaryService": "/MyTrackableObjects/$count/?$filter=(Status eq 'A') and isDeleted eq '0' and isSharedWithMyOrg eq 0",
                "secondaryService": "/MyTrackableObjects/$count/?$filter=(Status eq 'I') and isDeleted eq '0' and isSharedWithMyOrg eq 0",
                "secondaryService1": "/MyTrackableObjects/$count/?$filter=isDeleted eq '0' and isSharedWithMyOrg eq 0"
            },
            "tileScale": oSapSplUtils.getBundle().getText("INACTIVE_TRUCKS_TRACKABLEOBJECTS_TILE"),
            "tileScale1": oSapSplUtils.getBundle().getText("SPL_TOTAL_COUNT_TEXT")
        },
        "manageTours": {
            "tileSize": "L",
            "frameType": "OneByOne",
            "tileHeader": null,
            "tileSubheader": null,
            "tileBGImage": null,
            "tileTotalCountText": oSapSplUtils.getBundle().getText("FILTER_LABEL_ACTIVE"),
            "tileService": {
                "primaryService": "/Tours/$count?$filter=(TourStatus eq 'S') or (TourStatus eq 'A') or (TourStatus eq 'L') or (TourStatus eq 'I')",
                "secondaryService": "/Tours/$count/?$filter=(TourStatus eq 'U')"
            },
            "tileScale": oSapSplUtils.getBundle().getText("TOURS_COUNT_TOURS_TILE")
        },
        "incidences": {
            "tileSize": "L",
            "frameType": "OneByOne",
            "tileHeader": null,
            "tileSubheader": null,
            "tileBGImage": null,
            "tileTotalCountText": oSapSplUtils.getBundle().getText("INCIDENTS_CATEGORY_CONTAINER"),
            "tileService": {
                "primaryService": "/IncidentDetails/$count/?$filter=(isDeleted eq '0') and (Category eq 'C')",
                "secondaryService": "/IncidentDetails/$count/?$filter=(isDeleted eq '0') and (Category eq 'I')",
                "secondaryService1": "/IncidentDetails/$count/?$filter=(isDeleted eq '0') and (Category eq 'P')"
            },
            "tileScale": oSapSplUtils.getBundle().getText("INCIDENTS_CATEGORY_INTERFERENCE"),
            "tileScale1": oSapSplUtils.getBundle().getText("INCIDENTS_CATEGORY_PARKING")
        },
        "liveApp": {
            "tileSize": "L",
            "frameType": "OneByOne",
            "tileHeader": null,
            "tileSubheader": null,
            "tileBGImage": null,
            "tileTotalCountText": oSapSplUtils.getBundle().getText("SPL_TOTAL_COUNT_TEXT"),
            "tileService": {
                "primaryService": "/OccurredIncidents/$count",
                "secondaryService": "/OccurredIncidents/$count/?$filter=(Priority eq '1')"
            },
            "tileScale": oSapSplUtils.getBundle().getText("PRIORITY_LABEL_LIVEAPP_TILE")
        },
        "reporting": {
            "tileSize": "L",
            "frameType": "OneByOne",
            "tileHeader": null,
            "tileSubheader": null,
            "tileBGImage": null,
            "tileTotalCountText": oSapSplUtils.getBundle().getText("SPL_TOTAL_COUNT_TEXT"),
            "tileService": {
                "primaryService": "",
                "secondaryService": ""
            },
            "tileScale": null
        },
        "help": {
            "tileSize": "L",
            "frameType": "TwoByOne",
            "tileHeader": null,
            "tileSubheader": null,
            "tileBGImage": "./resources/icons/tile_help_image.jpg",
            "tileTotalCountText": oSapSplUtils.getBundle().getText("SPL_TOTAL_COUNT_TEXT"),
            "tileService": {
                "primaryService": null,
                "secondaryService": null
            },
            "tileScale": null
        },
        "userNotification": {
            "tileSize": "L",
            "frameType": "OneByOne",
            "tileHeader": null,
            "tileSubheader": null,
            "tileBGImage": null,
            "tileTotalCountText": oSapSplUtils.getBundle().getText("SPL_TOTAL_COUNT_TEXT"),
            "tileService": {
                "primaryService": "/MyFeed/$count/?$filter=(isNotification eq '1')",
                "secondaryService": "/MyFeed/$count/?$filter=(isNotification eq '1' and isActive eq '1')"
            },
            "tileScale": oSapSplUtils.getBundle().getText("USER_NOTIFICATION_ACTIVE_LABEL")
        },
        "usageLog": {
            "tileSize": "L",
            "frameType": "TwoByOne",
            "tileHeader": null,
            "tileSubheader": null,
            "tileBGImage": "./resources/icons/tile_help_image.jpg",
            "tileTotalCountText": oSapSplUtils.getBundle().getText("SPL_TOTAL_COUNT_TEXT"),
            "tileService": {
                "primaryService": null,
                "secondaryService": null
            },
            "tileScale": null
        },
        "communicationLog": {
            "tileSize": "L",
            "frameType": "OneByOne",
            "tileHeader": null,
            "tileSubheader": null,
            "tileBGImage": null,
            "tileTotalCountText": oSapSplUtils.getBundle().getText("SPL_TOTAL_COUNT_TEXT"),
            "tileService": {
                "primaryService": null,
                "secondaryService": null
            },
            "tileScale": null
        }

    },

    resultVisualizerFactory: function (sEntityType, pageId, iCount, oModel, contextObject) {
        if (sEntityType === "myBusinessPartners") {
            oSapSplTileRefresher.buPaResultVisualizer(pageId, oModel, iCount, contextObject, this.tileConfig["myBusinessPartners"]);
        } else if (sEntityType === "myUsers") {
            oSapSplTileRefresher.usersResultVisualizer(pageId, oModel, iCount, contextObject, this.tileConfig["myUsers"]);
        } else if (sEntityType === "vehicles") {
            oSapSplTileRefresher.trackableObjectResultVisualizer(pageId, oModel, iCount, contextObject, this.tileConfig["vehicles"]);
        } else if (sEntityType === "manageTours") {
            oSapSplTileRefresher.manageToursResultVisualizer(pageId, oModel, iCount, contextObject, this.tileConfig["manageTours"]);
        } else if (sEntityType === "incidences") {
            oSapSplTileRefresher.manageIncidentsResultVisualizer(pageId, oModel, iCount, contextObject, this.tileConfig["incidences"]);
        } else if (sEntityType === "liveApp") {
            oSapSplTileRefresher.liveAppResultVisualizer(pageId, oModel, iCount, contextObject, this.tileConfig["liveApp"]);
        } else if (sEntityType === "reporting") {
            oSapSplTileRefresher.reportResultVisualizer(pageId, oModel, iCount, contextObject, this.tileConfig["reporting"]);
        } else if (sEntityType === "help") {
            oSapSplTileRefresher.helpResultVisualizer(pageId, oModel, iCount, contextObject, this.tileConfig["help"]);
        } else if (sEntityType === "userNotification") {
            oSapSplTileRefresher.userNotificationResultVisualizer(pageId, oModel, iCount, contextObject, this.tileConfig["userNotification"]);
        }else if (sEntityType === "usageLog") {
            oSapSplTileRefresher.manageUsageLogVisualizer(pageId, oModel, iCount, contextObject, this.tileConfig["usageLog"]);
        }else if (sEntityType === "communicationLog") {
            oSapSplTileRefresher.communicationLogVisualizer(pageId, oModel, iCount, contextObject, this.tileConfig["communicationLog"]);
        }else {
            sap.ui.getCore().byId(pageId + iCount).setProperty("state", SapSplEnums.TILESTATELOADED);
            oModel.refresh();
        }

    },

    refreshAllTiles: function () {
        for (var iCount = 0; iCount < this.oTileModel.getData().results.length; iCount++) {

            //that.resultVisualizerFactory(oResult.d.results[iCount].AppID, pageId, iCount, oModel,oResult.d.results[iCount]);
            if (this.oTileModel.getData().results[iCount].hasOwnProperty("count")) {
                sap.ui.getCore().byId(this.sPageId + this.oTileModel.getData().results[iCount].count).setProperty("state", SapSplEnums.TILESTATELOADING);
            }
            oSapSplTileRefresher.resultVisualizerFactory(this.oTileModel.getData().results[iCount].AppID, this.sPageId, iCount, this.oTileModel, this.oTileModel.getData().results[iCount]);
        }
    },

    refreshTiles: function (sEntityType) {
        var count = 0;

        function getAppCount(oModel) {
            for (var i = 0; i < oModel.getData().results.length; i++) {
                if (oModel.getData().results[i].AppID === sEntityType) {
                    count = i;
                    break;
                }
            }
        }

        getAppCount(this.oTileModel);

        if (!sEntityType || sEntityType === null) {
            this.oTileModel.refresh();
        }
        if (this.oTileModel.getData().results[count].hasOwnProperty("count")) {
            sap.ui.getCore().byId(this.sPageId + this.oTileModel.getData().results[count].count).setProperty("state", SapSplEnums.TILESTATELOADING);
        }
        this.resultVisualizerFactory(sEntityType, this.sPageId, count, this.oTileModel, this.oTileModel.getData().results[count]);
    },

    buPaResultVisualizer: function (pageId, oModel, iCount, contextObject, oTileConfig) {
        this.getFilteredValue(oSapSplUtils.getServiceMetadata("app", true) + oTileConfig["tileService"]["primaryService"], iCount, null, oTileConfig["tileTotalCountText"], contextObject, function (oResult, oContext) {
            oModel.refresh();
            sap.ui.getCore().byId(pageId + oContext.count)
                .setProperty("size", oTileConfig["tileSize"])
                .setProperty("frameType", oTileConfig["frameType"])
                .setProperty("state", SapSplEnums.TILESTATELOADED);
            $.sap.log.info("Rendering of BuPa results completed successfully", "BuPa Result visualizer", "SAPSCL");
        }, function (oError, oContext) {
            $.sap.log.error("Error: " + oError.toString(), "BuPa Result visualizer error", "SAPSCL");
            oModel.refresh();
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATEFAILED);
        });
        this.getFilteredValue(oSapSplUtils.getServiceMetadata("app", true) + oTileConfig["tileService"]["secondaryService"], iCount, oTileConfig["tileScale"], oTileConfig["tileTotalCountText"], contextObject, function () {
            oModel.refresh();
        }, function (oError, oContext) {
            $.sap.log.error("Error: " + oError.toString(), "BuPa Result visualizer", "SAPSCL");
            oModel.refresh();
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATEFAILED);
        });
        
        /* Fix for incident : 1580113930 */
        if (sap.ui.getCore().byId(pageId + iCount).getTileContent().length > 1) {
            sap.ui.getCore().byId(pageId + iCount).removeTileContent(1);
            sap.ui.getCore().byId(pageId + iCount).removeTileContent(1);
        }
        
        //break;
    },

    manageToursResultVisualizer: function (pageId, oModel, iCount, contextObject, oTileConfig) {
        this.getFilteredValue(oSapSplUtils.getServiceMetadata("app", true) + oTileConfig["tileService"]["primaryService"], iCount, null, oTileConfig["tileTotalCountText"], contextObject, function (oResult, oContext) {
            oModel.refresh();

            /*Tile type changed to 1x1 as per feedback*/
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("frameType", oTileConfig["frameType"]);

            /*Removing numeric tile content to only show the comparison chart*/
            /*Removing numeric tile content to only show the comparison chart*/
            if (sap.ui.getCore().byId(pageId + iCount).getTileContent().length > 1) {
                sap.ui.getCore().byId(pageId + iCount).removeTileContent(2);
                sap.ui.getCore().byId(pageId + iCount).removeTileContent(0);
            }
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATELOADED);
            
            sap.ui.getCore().byId(pageId + oContext.count).getTileContent()[0].getContent().setProperty("colorPalette", ["#61a656", "#d32030"]);
            
            $.sap.log.info("Rendering of Manage Tours results completed successfully", "Manage Tours Result visualizer", "SAPSCL");
        }, function (oError, oContext) {
            $.sap.log.error("Error: " + oError.toString(), "Manage Tours Result visualizer error", "SAPSCL");
            oModel.refresh();
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATEFAILED);
        });
        this.getFilteredValue(oSapSplUtils.getServiceMetadata("app", true) + oTileConfig["tileService"]["secondaryService"], iCount, oTileConfig["tileScale"], oTileConfig["tileTotalCountText"], contextObject, function () {
            oModel.refresh();
        }, function (oError, oContext) {
            $.sap.log.error("Error: " + oError.toString(), "Manage Tours Result visualizer error", "SAPSCL");
            oModel.refresh();
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATEFAILED);
        });
    },

    usersResultVisualizer: function (pageId, oModel, iCount, contextObject, oTileConfig) {
        this.getFilteredValue(oSapSplUtils.getServiceMetadata("app", true) + oTileConfig["tileService"]["primaryService"], iCount, null, oTileConfig["tileTotalCountText"], contextObject, function (oResult, oContext) {
            oModel.refresh();
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("size", oTileConfig["tileSize"]);
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("frameType", oTileConfig["frameType"]);
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATELOADED);
            $.sap.log.info("Rendering of Users results completed successfully", "Users Result visualizer", "SAPSCL");
        }, function (oError, oContext) {
            $.sap.log.error("Error: " + oError.toString(), "Users Result visualizer error", "SAPSCL");
            oModel.refresh();
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATEFAILED);
        });
        this.getFilteredValue(oSapSplUtils.getServiceMetadata("app", true) + oTileConfig["tileService"]["secondaryService"], iCount, oTileConfig["tileScale"], oTileConfig["tileTotalCountText"], contextObject, function () {
            oModel.refresh();
        }, function (oError, oContext) {
            $.sap.log.error("Error: " + oError.toString(), "Users Result visualizer error", "SAPSCL");
            oModel.refresh();
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATEFAILED);
        });
        
        /* Fix for incident 1580113930 */
        if (sap.ui.getCore().byId(pageId + iCount).getTileContent().length > 1) {
            sap.ui.getCore().byId(pageId + iCount).removeTileContent(1);
            sap.ui.getCore().byId(pageId + iCount).removeTileContent(1);
        }
        
    },
    
    userNotificationResultVisualizer: function (pageId, oModel, iCount, contextObject, oTileConfig) {
        this.getFilteredValue(oSapSplUtils.getServiceMetadata("app", true) + oTileConfig["tileService"]["primaryService"], iCount, null, oTileConfig["tileTotalCountText"], contextObject, function (oResult, oContext) {
            oModel.refresh();
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("size", oTileConfig["tileSize"]);
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("frameType", oTileConfig["frameType"]);
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATELOADED);
            $.sap.log.info("Rendering of User Notificatins results completed successfully", "User Notificatins Result visualizer", "SAPSCL");
        }, function (oError, oContext) {
            $.sap.log.error("Error: " + oError.toString(), "User Notificatins Result visualizer error", "SAPSCL");
            oModel.refresh();
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATEFAILED);
        });
        
        this.getFilteredValue(oSapSplUtils.getServiceMetadata("app", true) + oTileConfig["tileService"]["secondaryService"], iCount, oTileConfig["tileScale"], oTileConfig["tileTotalCountText"], contextObject, function () {
            oModel.refresh();
        }, function (oError, oContext) {
            $.sap.log.error("Error: " + oError.toString(), "User Notificatins Result visualizer error", "SAPSCL");
            oModel.refresh();
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATEFAILED);
        });
        
        /* Fix for incident 1580113930 */
        if (sap.ui.getCore().byId(pageId + iCount).getTileContent().length > 1) {
            sap.ui.getCore().byId(pageId + iCount).removeTileContent(1);
            sap.ui.getCore().byId(pageId + iCount).removeTileContent(1);
        }
        
    },

    manageIncidentsResultVisualizer: function (pageId, oModel, iCount, contextObject, oTileConfig) {
        this.getFilteredValue(oSapSplUtils.getServiceMetadata("app", true) + oTileConfig["tileService"]["primaryService"], iCount, null, oTileConfig["tileTotalCountText"], contextObject, function (oResult, oContext) {
            oModel.refresh();
            
            /*Tile type changed to 1x1 as per feedback*/
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("frameType", oTileConfig["frameType"]);
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATELOADED);

            /*Removing numeric tile content to only show the comparison chart*/
            if (sap.ui.getCore().byId(pageId + iCount).getTileContent().length > 1) {
                sap.ui.getCore().byId(pageId + iCount).removeTileContent(0);
                sap.ui.getCore().byId(pageId + iCount).removeTileContent(0);
            }
            
            sap.ui.getCore().byId(pageId + oContext.count).getTileContent()[0].getContent().setProperty("colorPalette", ["#5cbae6", "#fac364", "#b6d957"]);

            $.sap.log.info("Rendering of Manage Incidents results completed successfully", "Manage Incidents Result visualizer", "SAPSCL");
        }, function (oError, oContext) {
            $.sap.log.error("Error: " + oError.toString(), "Manage Incidents Result visualizer error", "SAPSCL");
            oModel.refresh();
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATEFAILED);
        });
        this.getFilteredValue(oSapSplUtils.getServiceMetadata("app", true) + oTileConfig["tileService"]["secondaryService"], iCount, oTileConfig["tileScale"], oTileConfig["tileTotalCountText"], contextObject, function () {
            oModel.refresh();
        }, function (oError, oContext) {
            $.sap.log.error("Error: " + oError.toString(), "Manage Incidents Result visualizer error", "SAPSCL");
            oModel.refresh();
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATEFAILED);
        });
        this.getFilteredValue(oSapSplUtils.getServiceMetadata("app", true) + oTileConfig["tileService"]["secondaryService1"], iCount, oTileConfig["tileScale1"], oTileConfig["tileTotalCountText"], contextObject, function () {
            oModel.refresh();
        }, function (oError, oContext) {
            $.sap.log.error("Error: " + oError.toString(), "Manage Incidents Result visualizer error", "SAPSCL");
            oModel.refresh();
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATEFAILED);
        });
    },

    liveAppResultVisualizer: function (pageId, oModel, iCount, contextObject, oTileConfig) {
        this.getFilteredValue(oSapSplUtils.getServiceMetadata("app", true) + oTileConfig["tileService"]["primaryService"], iCount, null, oTileConfig["tileTotalCountText"], contextObject, function (oResult, oContext) {
            oModel.refresh();

            /*Tile type changed to 1x1 as per feedback*/
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("frameType", oTileConfig["frameType"]);
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATELOADED);
            $.sap.log.info("Rendering of Live App results completed successfully", "Live App Result visualizer", "SAPSCL");
        }, function (oError, oContext) {
            $.sap.log.error("Error: " + oError.toString(), "Live App Result visualizer error", "SAPSCL");
            oModel.refresh();
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATEFAILED);
        });
        this.getFilteredValue(oSapSplUtils.getServiceMetadata("app", true) + oTileConfig["tileService"]["secondaryService"], iCount, oTileConfig["tileScale"], oTileConfig["tileTotalCountText"], contextObject, function () {
            oModel.refresh();
        }, function (oError, oContext) {
            $.sap.log.error("Error: " + oError.toString(), "Live App Result visualizer error", "SAPSCL");
            oModel.refresh();
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATEFAILED);
        });
        
        /* Fix for incident 1580113930 */
        if (sap.ui.getCore().byId(pageId + iCount).getTileContent().length > 1) {
            sap.ui.getCore().byId(pageId + iCount).removeTileContent(1);
            sap.ui.getCore().byId(pageId + iCount).removeTileContent(1);
        }
        
    },

    reportResultVisualizer: function (pageId, oModel, iCount, contextObject, oTileConfig) {

        $.sap.log.info("SAP SCL Report Result visualizer", "Tile configuration " + oTileConfig.toString(), "SAPSCL");
        sap.ui.getCore().byId(pageId + iCount).setProperty("state", SapSplEnums.TILESTATELOADED);

        /*HOTFIX To ensure that the Reporting tile is clickable even if there is no underlying service it talks to*/
        contextObject.state = SapSplEnums.TILESTATELOADED;
        oModel.refresh();
    },

    helpResultVisualizer: function (pageId, oModel, iCount, oContext, oTileConfig) {
        /* Fix for 1570005107 */
        sap.ui.getCore().byId(pageId + iCount).addStyleClass("sapSplHelpTile");
        sap.ui.getCore().byId(pageId + iCount).setProperty("frameType", oTileConfig["frameType"]); //Set Frame type to 2x1
        sap.ui.getCore().byId(pageId + iCount).setProperty("state", SapSplEnums.TILESTATELOADED); //Set frame state to Loaded
        sap.ui.getCore().byId(pageId + iCount).setHeader(oTileConfig["tileHeader"]); //Remove the header of Help Tile
        sap.ui.getCore().byId(pageId + iCount).setProperty("subheader", oTileConfig["tileSubHeader"]); //Remove the sub-header of help tile
        sap.ui.getCore().byId(pageId + iCount).removeTileContent(0); //Remove the numeric content aggregation
        sap.ui.getCore().byId(pageId + iCount).setProperty("backgroundImage", oTileConfig["tileBGImage"]); //Apply the background image for help tile
        sap.ui.getCore().byId(pageId + iCount).addTileContent(new sap.suite.ui.commons.TileContent({ //Make the tile content as News
            content: new sap.suite.ui.commons.NewsContent({
                /*CSNFIX 676549 2014*/
                contentText: oSapSplUtils.getBundle().getText("SPL_HELPTILE_DESCRIPTION")
            })
        }));

        sap.ui.getCore().byId(pageId + iCount).removeTileContent(0); //Remove the comparison chart
        sap.ui.getCore().byId(pageId + iCount).removeTileContent(0); //Remove the comparison chart

        oContext.state = SapSplEnums.TILESTATELOADED; //Set context object loaded state
        oModel.refresh(); //Finally refresh the model
    },
    manageUsageLogVisualizer:function(pageId, oModel, iCount, oContext){
         
        sap.ui.getCore().byId(pageId + iCount).setProperty("state", SapSplEnums.TILESTATELOADED); //Set frame state to Loaded
        oContext.state = SapSplEnums.TILESTATELOADED; //Set context object loaded state
        oModel.refresh(); //Finally refresh the model
        
        /* Fix for incident 1580113930 */
        if (sap.ui.getCore().byId(pageId + iCount).getTileContent().length > 1) {
            sap.ui.getCore().byId(pageId + iCount).removeTileContent(1);
            sap.ui.getCore().byId(pageId + iCount).removeTileContent(1);
        }
      
    },
    communicationLogVisualizer:function(pageId, oModel, iCount, oContext){
        
        sap.ui.getCore().byId(pageId + iCount).setProperty("state", SapSplEnums.TILESTATELOADED); //Set frame state to Loaded
        oContext.state = SapSplEnums.TILESTATELOADED; //Set context object loaded state
        oModel.refresh(); //Finally refresh the model
      
        /* Fix for incident 1580113930 */
        if (sap.ui.getCore().byId(pageId + iCount).getTileContent().length > 1) {
            sap.ui.getCore().byId(pageId + iCount).removeTileContent(1);
            sap.ui.getCore().byId(pageId + iCount).removeTileContent(1);
        }
        
      },

    trackableObjectResultVisualizer: function (pageId, oModel, iCount, contextObject, oTileConfig) {
        this.getFilteredValue(oSapSplUtils.getServiceMetadata("app", true) + oTileConfig["tileService"]["primaryService"], iCount, null, oTileConfig["tileTotalCountText"], contextObject, function (oResult, oContext) {
            oModel.refresh();

            /*Tile type changed to 1x1 as per feedback*/
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("frameType", oTileConfig["frameType"]);

            /*Removing numeric tile content to only show the comparison chart*/
            /*Removing numeric tile content to only show the comparison chart*/
            if (sap.ui.getCore().byId(pageId + iCount).getTileContent().length > 1) {
                sap.ui.getCore().byId(pageId + iCount).removeTileContent(0);
                sap.ui.getCore().byId(pageId + iCount).removeTileContent(0);
            }
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATELOADED);
            
            sap.ui.getCore().byId(pageId + oContext.count).getTileContent()[0].getContent().setProperty("colorPalette", ["#61a656", "#d32030", "848f94"]);
            
            $.sap.log.info("Rendering of Trucks results completed successfully", "Trucks Result visualizer", "SAPSCL");
        }, function (oError, oContext) {
            //$.sap.log.error("Error: " + oError.toString(),"Trucks Result visualizer error","SAPSCL" );
            oModel.refresh();
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATEFAILED);
        });
        /* CSNFIX : 0120031469 634770     2014 */
        this.getFilteredValue(oSapSplUtils.getServiceMetadata("app", true) + oTileConfig["tileService"]["secondaryService"], iCount, oTileConfig["tileScale"], oTileConfig["tileTotalCountText"], contextObject, function () {
            oModel.refresh();
        }, function (oError, oContext) {
            //$.sap.log.error("Error: " + oError.toString(),"Trucks Result visualizer","SAPSCL" );
            oModel.refresh();
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATEFAILED);
        });
        this.getFilteredValue(oSapSplUtils.getServiceMetadata("app", true) + oTileConfig["tileService"]["secondaryService1"], iCount, oTileConfig["tileScale1"], oTileConfig["tileTotalCountText"], contextObject, function () {
            oModel.refresh();
        }, function (oError, oContext) {
            //$.sap.log.error("Error: " + oError.toString(),"Trucks Result visualizer","SAPSCL" );
            oModel.refresh();
            sap.ui.getCore().byId(pageId + oContext.count).setProperty("state", SapSplEnums.TILESTATEFAILED);
        });
    },

    getFilteredValue: function (sUrl, iCount, scale, totalText, oContext, successHandler, errorHandler) {
        $.ajax({
            url: sUrl,
            method: "GET",
            dataType: "json",
            context: oContext,
            success: function (oResult) {
                this.state = SapSplEnums.TILESTATELOADED;
                this.count = iCount;

                this.totalText = totalText;
                if (scale === null) {
                    this.result = oResult;
                }
                if (scale === oSapSplUtils.getBundle().getText("INCIDENTS_CATEGORY_PARKING") || scale === oSapSplUtils.getBundle().getText("SPL_TOTAL_COUNT_TEXT")) {
                    this.scaleText1 = scale;
                    this.scaleCount1 = oResult;
                } else if (scale !== null) {
                    this.scale = oResult + "\t" + scale;
                    this.scaleText = scale;
                    this.scaleCount = oResult;
                }
                
                successHandler(oResult, oContext);
            },
            error: function (xhr, textStatus, errorThrown) {
                oContext.count = iCount;
                errorHandler(xhr, oContext, textStatus, errorThrown);
            }
        });
    }

};
