/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.tileContainer.MasterTileContainer", {

    /**
     * @description Master Tile Container controller
     * @this splController.tileContainer.MasterTileContainer
     */
    onInit: function () {

        var oModel = new sap.ui.model.json.JSONModel(),

            pageId = "__tile0-splView.tileContainer.MasterTileContainer--masterTileContainerPage-",
            
            _aAllowedTilesList = oSapSplUtils.getAllowedTilesList(); 	//Get List of allowed Tiles and apply as Model. Avoid one more call to get sorted list

        this.getView().setModel(oModel);

        this.getView().addEventDelegate({
            onBeforeShow: function (oEvent) {
                this.onBeforeShow(oEvent);
            }
        }, this);

        oModel.setData({
            results: _aAllowedTilesList
        });
        
        oSapSplTileRefresher.oTileModel = oModel;

        for (var iCount = 0; iCount < _aAllowedTilesList.length; iCount++) {

            oSapSplTileRefresher.resultVisualizerFactory(_aAllowedTilesList[iCount].AppID, pageId, iCount, oModel, _aAllowedTilesList[iCount]);
        }
        jQuery.sap.log.info("Master Container Initializer", "Result Visualizer Factory executed", "SAPSCL");
        
        this.bIsTilePressed = true;

        /*CSNFIX 276879 2014
         * Will be switched on, only in case of displaying logger UI*/
        this.byId("masterTileContainerPage").setShowFooter(window.location.search.indexOf("spl-show-log=1") > -1);
        
        if (jQuery.sap.getUriParameters().get("goto")) {
        	oSapSplQuerySelectors.getInstance().changeUnifiedShellStyle(false);
        } else {
        	oSapSplQuerySelectors.getInstance().changeUnifiedShellStyle(true);
        }
    },

    /*Event delegate to register application help information*/
    onBeforeShow: function (oEvent) {
        oSapSplHelpHandler.setAppHelpInfo({
            iUrl: "./help/SCLLaunchpad.pdf",
            eUrl: "http://help.sap.com/saphelp_scl10/helpdata/en/c9/50e853c0bb9438e10000000a44176d/content.htm?frameset=/en/54/ec1054b76b8b24e10000000a4450e5/frameset.htm&current_toc=/en/b7/8ee25341d61e4ee10000000a423f68/plain.htm&node_id=7"
        }, oEvent);
    },

    getData: function (sUrl, successHandler, errorHandler) {
        oSapSplAjaxFactory.fireAjaxCall({
            url: sUrl,
            method: "GET",
            dataType: "json",
            success: function (oResult) {
                successHandler(oResult);
            },
            error: function (xhr, textStatus, errorThrown) {
                errorHandler(xhr, textStatus, errorThrown);
            }
        });
    },

    /**
     * @description Method to read company details of the logged in user.
     * @returns void.
     * @since 1.0
     * @param void.
     * */
    fetchCompanyDetailsOfLoggedInUser: function () {
        this.oSapSplMyContactModel.read("/MyOrganization", null, null, true, jQuery.proxy(this.fnSuccessOfCompanyData, this), jQuery.proxy(this.fnFailOfCompanyData, this));
    },

    /***
     * @description Success handler of the read for MyOrganization entity.
     * @param result company data of the logged in user.
     * @returns void.
     * @since 1.0
     */
    fnSuccessOfCompanyData: function (result) {
        oSapSplUtils.setCompanyDetails(result.results[0]);
    },

    /***
     * @description Failure handler of the read for MyOrganization entity.
     * @param error error object.
     * @returns void.
     * @since 1.0
     */
    fnFailOfCompanyData: function () {

    },

    onBeforeRendering: function () {

    },

    onAfterRendering: function () {

        oSapSplBusyDialog.getBusyDialogInstance({
            type: "fiori"
        }).close();

    },

    onExit: function () {

    },

    /**
     * @description Event handler for movement of tiles in the container
     * @returns void
     * @since 1.0
     * @params oEvent {object} Event Object
     * @this splController.tileContainer.MasterTileContainer
     */
    handleSplMasterTileContainerTileMoveEvent: function (oEvent) {
        jQuery.sap.log.info(oEvent.toString());

        /*Handle Tile Move*/
        oEvent.preventDefault();
    },

    /**
     * @description Event handler to handle press of tile (movement to second level navigation)
     * @returns void
     * @params oEvent {object} The event Object being passed
     * @example oEvent.oSource.getBindingContext(); //Returns a binding context path. Use this to fetch the associated properties from Model
     * @this splController.tileContainer.MasterTileContainer
     */
    handleSplStandardTilePressEvent: function (oEvent) {

        /*In the event that the underlying count and filtered count have responded with 5xx, disable operations and notify*/
        if (oEvent.getSource().getBindingContext().getProperty("state") === undefined || oEvent.getSource().getBindingContext().getProperty("state").toLowerCase() === "failed") {
            oEvent.preventDefault(); /*Display message if tile failed*/
            sap.ca.ui.message.showMessageBox({
                type: sap.ca.ui.message.Type.ERROR,
                message: oSapSplUtils.getBundle().getText("TILE_CANNOT_BE_LOADED")
            }, function () {

            });
            return;
        }
        this.oEvent = oEvent;

        oSapSplUtils.showHeaderButton({
            showButton: true,
            sNavToPage: "splView.tileContainer.MasterTileContainer",
            navIcon: "sap-icon://home"
        });

        function loadApplication(oEvent) {
            jQuery.sap.log.info(oEvent.toString());
            this.oBaseView = null;
            if (!sap.ui.getCore().byId("sapSplBaseApplication").getPage((oEvent.getSource().getBindingContext().getProperty().AppPath))) {
                this.oBaseView = sap.ui.view({
                    viewName: oEvent.getSource().getBindingContext().getProperty().AppPath,
                    id: oEvent.getSource().getBindingContext().getProperty().AppPath,
                    type: sap.ui.core.mvc.ViewType.XML,
                    viewData: oEvent.getSource().getBindingContext() //Pass the tile context as View Data for apps to use
                });

                this.oBaseView.addEventDelegate({
                    onBeforeShow: jQuery.proxy(this.oBaseView.getController().onBeforeShow, this.oBaseView.getController())
                }, this.oBaseView.getController());

                if (this.oBaseView.getController().onAfterShow) {
                    this.oBaseView.addEventDelegate({
                        onAfterShow: jQuery.proxy(this.oBaseView.getController().onAfterShow, this.oBaseView.getController())
                    }, this.oBaseView.getController());
                }

                sap.ui.getCore().byId("sapSplBaseApplication").addPage(this.oBaseView);
            }

            oSplBaseApplication.getAppInstance().to(oEvent.getSource().getBindingContext().getProperty().AppPath, "slide", {
                data: oEvent.getSource().getBindingContext().getProperty().AppName,
                context: oEvent.getSource().getBindingContext()
            });

        }

        /*QUICKFIX*/
        window.setTimeout(loadApplication(oEvent), 20);

    },

    refreshTiles: function () { /*Only in support mode*/
        oSapSplTileRefresher.refreshAllTiles();
    }

});
