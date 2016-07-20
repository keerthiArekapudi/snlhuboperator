/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
/*GLOBALS. Accessor*/
(function () {

    splReusable.libs.SplTracer.trace(0, "App Container initializer");

    function handleStyleChangeOnUnifiedShell(oEvent, bApply) {

        oSapSplQuerySelectors.getInstance().changeUnifiedShellStyle(bApply);

    }

    function checkAndUpdateCountOnTile(oToPage, oFromPage) {

        var oMasterTileData;

        if (oToPage.sId === "splView.tileContainer.MasterTileContainer" && oFromPage.getCustomData().length > 0 && oFromPage.getCustomData()[0].getValue() === true) {

            oMasterTileData = oToPage.getModel().getData().results;

            for (var i = 0; i < oMasterTileData.length; i++) {
                if (oMasterTileData[i]["AppPath"] === oFromPage.sId) {
                    oSapSplTileRefresher.refreshTiles(oMasterTileData[i]["AppID"]);
                    oFromPage.destroyCustomData();
                }
            }
        }

    }

    /**
     * @private
     * @since 1.0
     */
    function handleOnCleanUp(oEvent) {
        if (oEvent.getParameter("from").getController().getChildInstance) {

            if (oEvent.getParameter("from").getController().getChildInstance().getController().onCleanUp) {
                oEvent.getParameter("from").getController().getChildInstance().getController().onCleanUp();
            }
        }
    }

    function handleDirtyState(oEvent) {

        var oNavigateEvent = jQuery.extend(true, {}, oEvent);

        if (oSapSplUtils.getIsDirty()) {

            /*
             * Variable hoisting. Scope of oNavigateEvent is overwritten within close handler of dialog
             * Hence scoping it in global to specify hierarchy
             */
            window["oSapSplNavigateEvent"] = jQuery.extend(true, {}, oEvent);

            sap.m.MessageBox.show(

                oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),

                sap.m.MessageBox.Icon.WARNING,

                oSapSplUtils.getBundle().getText("WARNING"),

                [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],

                function (selection) {

                    if (selection === "YES") {

                        oSapSplUtils.setIsDirty(false);

                        oSapSplBusyDialog.getBusyDialogInstance({
                            type: "fiori"
                        }).open();

                        handleOnCleanUp(window["oSapSplNavigateEvent"]);

                        /*CSNFIX 642421 2014*/
                        if (window["oSapSplNavigateEvent"].getParameter("direction") === "back") {
                            oSplBaseApplication.getAppInstance().back({
                                goBackWithData: 0
                            }); //Revert your changes. Go back to home
                        } else {
                            oSplBaseApplication.getAppInstance().to(window["oSapSplNavigateEvent"].getParameter("toId"), {
                                goBackWithData: 0
                            });
                        }



                        if (window["oSapSplNavigateEvent"].getParameter("toId") === SapSplEnums.HomePage) {

                            sap.ui.getCore().byId("sapSplBaseUnifiedShell").removeAllHeadItems();

                        }

                        jQuery(".sapMDialogBlockLayerInit").css("display", "none");

                        /* CSNFIX : 0120031469 638398     2014 */

                        if (oNavigateEvent.getParameters().toId === SapSplEnums.HomePage) {

                            handleStyleChangeOnUnifiedShell(oNavigateEvent, true);

                        } else {
                            handleStyleChangeOnUnifiedShell(oNavigateEvent, false);
                        }

                    } else {

                        //Do Nothing. Let the user modify the page
                        jQuery.sap.log.info("Navigate out Action cancelled");

                        jQuery(".sapMDialogBlockLayerInit").css("display", "none");

                    }

                },null, oSapSplUtils.fnSyncStyleClass( "messageBox" )

            );

            oEvent.preventDefault();

        } else {

            if (oEvent.getParameters().toId === "splView.tileContainer.MasterTileContainer") {
                sap.ui.getCore().byId("sapSplBaseUnifiedShell").removeAllHeadItems();
            }

        }
    }


    function handleCloseAllDialogs(oEvent) {

        /*CSNFIX 599888 2014*/
        if ((oEvent.getParameter("toId") === SapSplEnums.HomePage)) {

            jQuery.sap.log.info("SAP SCL App Container", "Close All Dialogs", "Closing Open Dialogs and Popovers");

            sap.ui.getCore().byId("sapSplBaseUnifiedShell").removeAllHeadItems();

        }

        sap.m.InstanceManager.closeAllDialogs(function () {

            sap.m.InstanceManager.closeAllPopovers();

        });

    }

    /**
     * @private
     * @since 1.0
     * @description Helper to reset intervals on nav back
     */
    function handleClearAllIntervals(oEvent) {

        if ((oEvent.getParameter("direction") === "back") || (oEvent.getParameter("direction") === "backToTop") || (oEvent.getParameter("toId") === "splView.tileContainer.MasterTileContainer")) {

            jQuery.sap.log.debug("SAP SCL App Container", "Clear Interval ID for " + oSapSplUtils.getIntervalIds().length + " Intervals", "SAP SCL App Container");

            for (var i = 0; i < oSapSplUtils.getIntervalIds().length; i++) {

                window.clearInterval(oSapSplUtils.getIntervalIds()[i]);

            }

        }

    }

    

    window["oSplBaseApplication"] = {

        getAppInstance: function () {

            return sap.ui.getCore().byId("sapSplBaseApplication");

        },

        getData: function () {

            return new sap.m.App("sapSplBaseApplication", {

                orientationChange: jQuery.proxy(this.handleOrientationChange, this),

                afterNavigate: jQuery.proxy(this.handleAfterNavigate, this),

                navigate: jQuery.proxy(this.handleNavigate, this)

            });

        },

        handleOrientationChange: function (oEvent) {

            jQuery.sap.log.info(oEvent.toString());

        },

        /*By default hide the help button. Only if setAppHelpInfo is called, make it visible*/
        handleHelpButtonHide: function (oEvent) {
            $.sap.log.info("SAP SCL App Container", "Help Button Hide Event fired" + oEvent.toString(), "SAPSCL");
            sap.ui.getCore().getModel("helpModel").getData()["helpVisible"] = false;
            sap.ui.getCore().getModel("helpModel").refresh();
        },

        handleAfterNavigate: function (oEvent) {

            jQuery.sap.log.info(oEvent.toString());

            $.sap.log.info("SCL App Container After Navigate", "App navigation complete", "SAPSCL");

            if (oEvent.getParameters().toId === SapSplEnums.HomePage) {

                checkAndUpdateCountOnTile(oEvent.getParameter("to"), oEvent.getParameter("from"));

            }


            oSapSplQuerySelectors.getInstance().setBackButtonTooltip();



            oSapSplBusyDialog.getBusyDialogInstance({
                type: "fiori"
            }).close();

        },

        handleNavigate: function (oEvent) {

            /* When navigate trigger = true, check for dirty state. If dirty state, reset dirty state
             * set busy dialog and navigate back to main page
             * If dirty state is true, action is cancel, stay where you are.
             * If dirty state is false, close all dialogs on page navigate
             */

            if (oSapSplUtils.getIsDirty()) {

                handleDirtyState(oEvent);

            } else {

                handleCloseAllDialogs(oEvent);

                /* CSNFIX : 0120031469 638398     2014 */

                if (oEvent.getParameters().toId === SapSplEnums.HomePage) {

                    handleStyleChangeOnUnifiedShell(oEvent, true);

                }

            }

            /* CSNFIX : 0120031469 638398     2014 */

            if (oEvent.getParameters().toId !== SapSplEnums.HomePage) {

                handleStyleChangeOnUnifiedShell(oEvent, false);

            }

            handleClearAllIntervals(oEvent);

            this.handleHelpButtonHide(oEvent);

        }

    };

    splReusable.libs.SplTracer.trace(1, "App Container initializer");

}());
