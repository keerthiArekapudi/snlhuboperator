/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("OPA5TestScript.Assertions.follow_trucks_assertions");jQuery.sap.require("sap.ui.test.Opa5");jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");new sap.ui.test.Opa5.extend("opa5.Assertions.assertions",{iShouldSeeTiles:function(){return this.waitFor({id:"masterTileContainerPage",viewName:"splView.tileContainer.MasterTileContainer",check:function(){return this.getContext().oAppsPage&&this.getContext().oAppsPage.getContent().length>0;},success:function(p){this.getContext().oShell=p.getParent().getParent().getParent().getParent();var P=this.getContext().oAppsPage.getContent();var o={};for(var i=0;i<P.length;i++){o[P[i].getBindingContext().getProperty().AppID]=P[i];}this.getContext().oUIAppsObject=o;console.log(o);ok(p,"Found the apps tiles : "+this.getContext().oAppsPage.getContent().length+" tiles");},errorMessage:"The apps tiles did not contain entries",});},iShouldSeeFollowTrucks:function(){return this.waitFor({id:"sapSplBaseUnifiedShell",success:function(p){ok(true,"follow trucks found");},errorMessage:"follow trucks found",});},iShouldSeeTable:function(){return this.waitFor({controlType:"sap.m.Table",success:function(t){ok(true,"table found");},errorMessage:"table not found",});},iShouldOnlyViewSettingsDialog:function(){return this.waitFor({controlType:"sap.m.Dialog",success:function(t){ok(true,"filter dialog found");},errorMessage:"filter dialog not found",});},iSeeToastMessage:function(){return this.waitFor({"class":"sapMMessageToast",success:function(m){ok(true,"Message Toast Successfully displayed!");},errorMessage:"Toast Message was not displayed!"});},iShouldSeeFilterByStatus:function(){},iShouldOnlyActiveTrucks:function(){},iShouldSeeTableWithMatchingResults:function(){return this.waitFor({controlType:"sap.m.Table",success:function(t){var a=t[0].getItems().length;var b=[];for(var i=0;i<a;i++){b.push(t[0].getItems()[i].getCells()[0].getText());}ok(true,"The matching results are "+a+" in number");},errorMessage:"Table is not found!"});}});