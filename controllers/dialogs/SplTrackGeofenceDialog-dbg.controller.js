/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.dialogs.SplTrackGeofenceDialog", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {
        this.oViewData = this.getView().getViewData();
        this.oSnlhTrackGeofenceDialogModel = new sap.ui.model.json.JSONModel();
        this.oSnlhTrackGeofenceDialogModel.setData(this.oViewData);
        this.getView().setModel(this.oSnlhTrackGeofenceDialogModel);

        /*Localization*/
        this.fnDefineControlLabelsFromLocalizationBundle();
        
        oSapSplMapsDataMarshal.fnClearMap(sap.ui.getCore().byId("splView.liveApp.liveApp--oSapSplLiveAppMap"));
        
        var combinedArray = [];
        combinedArray = (this.oSnlhTrackGeofenceDialogModel.getData().geofences).concat(this.oSnlhTrackGeofenceDialogModel.getData().containerTerminal);
        oSapSplMapsDataMarshal.fnShowVOsOnMap(combinedArray, sap.ui.getCore().byId("splView.liveApp.liveApp--oSapSplLiveAppMap"));
        
        if( this.oSnlhTrackGeofenceDialogModel.getData().geofences.length > 0 ) {
        	this.fnToZoomToGeofence(this.oSnlhTrackGeofenceDialogModel.getData().geofences[0]);
        }
        
        
        this.byId("SapSnlhTrackGeofenceDialogList").attachBrowserEvent("mouseover", function (oEvent) {
              
              var sId;
              if( oEvent.target.children[0] ) {
                     sId = oEvent.target.children[0].id;
              } else {
                     sId = oEvent.target.id;
              }
              
            if (sap.ui.getCore().byId(sId)) {
                   oSapSplMapsDataMarshal.fnShowFences(sap.ui.getCore().byId(sId).getBindingContext().getProperty(), sap.ui.getCore().byId("splView.liveApp.liveApp--oSapSplLiveAppMap"), "onFocus");
            }

            if (this.getParent().getController().previousFocused) {
                if (sap.ui.getCore().byId(sId) && sap.ui.getCore().byId(sId).getBindingContext() && (this.getParent().getController().previousFocused !== sap.ui.getCore().byId(sId).getBindingContext().getProperty())) {
                     oSapSplMapsDataMarshal.fnShowFences(this.getParent().getController().previousFocused, sap.ui.getCore().byId("splView.liveApp.liveApp--oSapSplLiveAppMap"));
                    oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility("Hide", "Geofence");
                }
            }


            if (sap.ui.getCore().byId(sId)) {
              this.getParent().getController().previousFocused = sap.ui.getCore().byId(sId).getBindingContext().getProperty();
            }

        });
    },
    
    fnToZoomToGeofence : function (oData) {
//    	var sCoords = oSapSplMapsDataMarshal.convertGeoJSONToString ( JSON.parse ( oData["Geometry"] ) );
//		sCoords = oSapSplMapsDataMarshal.fnGetPointFromPolygon ( sCoords );
//		var sLat = sCoords.split ( ";" )[1];
//		var sLong = sCoords.split ( ";" )[0];
//    	sap.ui.getCore().byId ( "splView.liveApp.liveApp--oSapSplLiveAppMap" ).zoomToGeoPosition ( parseFloat ( sLong, 10 ), parseFloat ( sLat, 10 ), parseFloat ( "15", 10 ) );
		/* Fix for incident : 1580086182 */
		if (oData.Geometry && JSON.parse(oData.Geometry).coordinates.length > 0 ) {
			sap.ui.getCore().byId ( "splView.liveApp.liveApp--oSapSplLiveAppMap" ).zoomToAreas ( JSON.parse(oData.Geometry).coordinates[0], true );
		}
    },
    
    /**
     * @description Method to handle localization of all the hard code texts in the view.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnDefineControlLabelsFromLocalizationBundle: function () {
        
    },
    
    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     */
    onAfterRendering: function () {},

    /**
     * @description Method to save dialog instance & set buttons for dialog.
     * @param {Object} oParentDialog.
     * @returns void.
     * @since 1.0
     */
    setParentDialogInstance: function (oParentDialog) {
        this.oParentDialogInstance = oParentDialog;
        this.setButtonForDialog();
    },

    /**
     * @description Method to set End Button for dialog & set localized text for it.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    setButtonForDialog: function () {

        this.oSapSnlhTrackGeofenceDialogCancelButton = new sap.m.Button({
            press: jQuery.proxy(this.fnHandlePressOfTrackGeofenceDialogCancelButton, this)
        });

        this.oSapSnlhTrackGeofenceDialogCancelButton.setText(oSapSplUtils.getBundle().getText("CLOSE"));

        this.oParentDialogInstance.setEndButton(this.oSapSnlhTrackGeofenceDialogCancelButton);
    },

    /**
     * @description Method to handle press of Close button of dialog.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnHandlePressOfTrackGeofenceDialogCancelButton: function () {
       
       oSapSplMapsDataMarshal.fnClearMap(sap.ui.getCore().byId("splView.liveApp.liveApp--oSapSplLiveAppMap"));
       
       sap.ui.getCore().byId("splView.liveApp.liveApp").getController().fnShowAllVisualObjectsOnMap("trackgeofencedialog");
       
       this.getView().getParent().close();
        
    },

    /**
     * @description Called to set isDirtyFlag to true in Utils
     * @returns void.
     * @since 1.0
     * */
    fnToCaptureLiveChangeToSetFlag: function () {
        if (!oSapSplUtils.getIsDirty()) {
            oSapSplUtils.setIsDirty(true);
        }
    },
    
    fnHandlePressList : function () {
       
    },
    
    fnHandlePressAccept : function (oEvent) {
       var x = jQuery.extend(true, {}, oEvent);
       var locationData = oEvent.getSource().getBindingContext().getProperty();
       
       oSapSplBusyDialog.getBusyDialogInstance ( {
			title : oSapSplUtils.getBundle ( ).getText ( "BUSY_DIALOG_MESSAGE" )
	   } ).open ( );
       
       function _acceptCallBack () {
              var modelData = this.oSnlhTrackGeofenceDialogModel.getData();
              modelData.geofences[0].RelationStatus = "1";
              this.oSnlhTrackGeofenceDialogModel.setData(modelData);
              this.fnHandlePressOfTrackGeofenceDialogCancelButton();
              sap.ui.getCore().byId("splView.liveApp.liveApp").getController().fnShowAllVisualObjectsOnMap("trackgeofencedialog");
              jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
       }
           sap.ui.getCore().byId("splView.liveApp.liveApp").getController().fnHandleClickOfRadarGeofenceApprovalIcons(locationData, "1", _acceptCallBack.bind(this));
    },
    
    fnHandlePressReject : function (oEvent) {
    	var x = jQuery.extend(true, {}, oEvent);
        var locationData = x.getSource().getBindingContext().getProperty();
        
    	oSapSplBusyDialog.getBusyDialogInstance ( {
			title : oSapSplUtils.getBundle ( ).getText ( "BUSY_DIALOG_MESSAGE" )
	   } ).open ( );
    	
       function _rejectCallBack () {
              var modelData = this.oSnlhTrackGeofenceDialogModel.getData();
              modelData.geofences = [];
              this.oSnlhTrackGeofenceDialogModel.setData(modelData);
              this.fnHandlePressOfTrackGeofenceDialogCancelButton();
              sap.ui.getCore().byId("splView.liveApp.liveApp").getController().fnShowAllVisualObjectsOnMap("trackgeofencedialog");
              oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility("Hide", "Geofence");
       }
           sap.ui.getCore().byId("splView.liveApp.liveApp").getController().fnHandleClickOfRadarGeofenceApprovalIcons(locationData, "2", _rejectCallBack.bind(this));
    }
});
    
