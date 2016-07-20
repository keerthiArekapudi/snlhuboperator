/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.dialogs.SplLeftPanelGroupByDialog",{onInit:function(){this.oViewData=this.getView().getViewData();this.oSnlhLeftPanelGroupByDialogModel=new sap.ui.model.json.JSONModel();this.oSnlhLeftPanelGroupByDialogModel.setData(this.oViewData);this.getView().setModel(this.oSnlhLeftPanelGroupByDialogModel);this.fnDefineControlLabelsFromLocalizationBundle();},fnDefineControlLabelsFromLocalizationBundle:function(){},onAfterRendering:function(){},setParentDialogInstance:function(p){this.oParentDialogInstance=p;this.setButtonForDialog();},setButtonForDialog:function(){this.oSapSnlhLeftPanelGroupByDialogOkButton=new sap.m.Button({press:jQuery.proxy(this.fnHandlePressOfLeftPanelGroupByDialogOkButton,this)});this.oSapSnlhLeftPanelGroupByDialogCancelButton=new sap.m.Button({press:jQuery.proxy(this.fnHandlePressOfLeftPanelGroupByDialogCancelButton,this)});this.oSapSnlhLeftPanelGroupByDialogOkButton.setText(oSapSplUtils.getBundle().getText("Ok"));this.oSapSnlhLeftPanelGroupByDialogCancelButton.setText(oSapSplUtils.getBundle().getText("CANCEL"));this.oParentDialogInstance.setBeginButton(this.oSapSnlhLeftPanelGroupByDialogOkButton);this.oParentDialogInstance.setEndButton(this.oSapSnlhLeftPanelGroupByDialogCancelButton);},fnHandlePressOfLeftPanelGroupByDialogCancelButton:function(){this.getView().getParent().close();this.getView().getParent().destroy();},fnHandlePressOfLeftPanelGroupByDialogOkButton:function(){var s=new sap.ui.model.Sorter(this.byId("SapSnlhTrackGeofenceDialogList").getSelectedItem().getBindingContext().getProperty().FieldName,true,sap.ui.getCore().byId("splView.liveApp.liveApp").getController().handleGroupingOfLocations);var n=new sap.ui.model.Sorter("Name",false);sap.ui.getCore().byId("splView.liveApp.liveApp--SapSplLeftPanelList").getBinding("items").sort([]);sap.ui.getCore().byId("splView.liveApp.liveApp--SapSplLeftPanelList").getBinding("items").sort([s,n]);if(this.byId("SapSnlhTrackGeofenceDialogList").getSelectedItem().getBindingContext().getProperty().FieldName==="isPublic"){sap.ui.getCore().byId("splView.liveApp.liveApp--sapSnlhGroupTitlelabelInfoToolBar").setText(oSapSplUtils.getBundle().getText("GROUPED_BY_SHARING"));}else if(this.byId("SapSnlhTrackGeofenceDialogList").getSelectedItem().getBindingContext().getProperty().FieldName==="OwnerName"){sap.ui.getCore().byId("splView.liveApp.liveApp--sapSnlhGroupTitlelabelInfoToolBar").setText(oSapSplUtils.getBundle().getText("GROUPED_BY_COMPANY"));}else if(this.byId("SapSnlhTrackGeofenceDialogList").getSelectedItem().getBindingContext().getProperty().FieldName==="isRadar"){sap.ui.getCore().byId("splView.liveApp.liveApp--sapSnlhGroupTitlelabelInfoToolBar").setText(oSapSplUtils.getBundle().getText("GROUPED_BY_TYPE"));}this.getView().getParent().close();this.getView().getParent().destroy();},handleGroupingOfLocations:function(){},fnToCaptureLiveChangeToSetFlag:function(){if(!oSapSplUtils.getIsDirty()){oSapSplUtils.setIsDirty(true);}},fnHandleSelectOfGeofenceGroupType:function(){}});
