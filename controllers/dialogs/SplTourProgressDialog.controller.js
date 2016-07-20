/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.dialogs.SplTourProgressDialog",{onInit:function(){this.oViewData=this.getView().getViewData();this.oSplTourProgressModel=new sap.ui.model.json.JSONModel();this.oSplTourProgressModel.setData(this.oViewData);this.getView().setModel(this.oSplTourProgressModel);this.oSapSplTourStopDelaySorter1=new sap.ui.model.Sorter("StopName",true,this.handleGroupingOfStops);this.oSapSplTourStopDelaySorter2=new sap.ui.model.Sorter("ReportedTime");this.byId("SapSclTourPrgressDetailsTable").getBinding("items").sort([this.oSapSplTourStopDelaySorter1,this.oSapSplTourStopDelaySorter2]);this.byId("SapSclTourPrgressDetailsTable").getBinding("items").filter(new sap.ui.model.Filter("EventType",sap.ui.model.FilterOperator.EQ,"S"));this.fnDefineControlLabelsFromLocalizationBundle();},handleGroupingOfStops:function(c){var n=c.getProperty("StopName");var k=c.getProperty("StopName");return{key:k,text:n};},fnDefineControlLabelsFromLocalizationBundle:function(){this.byId("SapSclTourProgressTableStatus").setText(oSapSplUtils.getBundle().getText("STATUS"));this.byId("SapSclTourProgressTableTime").setText(oSapSplUtils.getBundle().getText("TIME"));},onAfterRendering:function(){},setParentDialogInstance:function(p){this.oParentDialogInstance=p;this.setButtonForDialog();},setButtonForDialog:function(){this.oSapSplTourProgressCancelButton=new sap.m.Button({press:jQuery.proxy(this.fnHandlePressOfTourProgressDialogCancel,this)});this.oSapSplTourProgressCancelButton.setText(oSapSplUtils.getBundle().getText("CLOSE"));this.oParentDialogInstance.setEndButton(this.oSapSplTourProgressCancelButton);},fnHandlePressOfTourProgressDialogCancel:function(){this.getView().getParent().close();this.getView().getParent().destroy();}});