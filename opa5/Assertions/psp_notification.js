/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("opa5.Assertions.psp_notification");jQuery.sap.require("sap.ui.test.Opa5");new sap.ui.test.Opa5.extend("opa5.Assertions.assertions",{iShouldSeeTiles:function(){return this.waitFor({id:"masterTileContainerPage",viewName:"splView.tileContainer.MasterTileContainer",check:function(){return this.getContext().oAppsPage&&this.getContext().oAppsPage.getContent().length>0;},success:function(p){this.getContext().oShell=p.getParent().getParent().getParent().getParent();var P=this.getContext().oAppsPage.getContent();var o={};for(var i=0;i<P.length;i++){o[P[i].getBindingContext().getProperty().AppID]=P[i];}this.getContext().oUIAppsObject=o;console.log(o);ok(p,"Found the apps tiles : "+this.getContext().oAppsPage.getContent().length+" tiles");},errorMessage:"The apps tiles did not contain entries",});},iSeeNotificationPageLoaded:function(){return this.waitFor({id:"MaintenanceNotifierDetail--sapSplMaintenanceNotifierDetailPage-title",success:function(t){this.iSeeFocus("MaintenanceNotifierMaster--sapSplMaintenanceNotifierMasterSearch");ok(true,"Notification page is loaded");},errorMessage:"Notification Page not loaded"});},iSeeFocus:function(i){return this.waitFor({id:i,check:function(I){return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()===i;},success:function(I){ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()===i,"Focus is on the right input element"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId());},errorMessage:"Focus on the wrong input "+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()});},iSeeButtons:function(){return this.waitFor({controlType:"sap.m.Button",success:function(b){ok(true,"Button found!");},errorMessage:"Button not found!"});},iSeeSuccessToastMsg:function(t){return this.waitFor({"class":"sapMMessageToast",success:function(){ok(true,t+" added successfully");},errorMessage:"Error in adding"+t});},iSeeSaveButtonEnabled:function(){return this.waitFor({controlType:"sap.m.Button",success:function(b){if(b[4].getEnabled()){ok(true,"Save Button is enabled");}},errorMessage:"Save button not enabled"});},});
