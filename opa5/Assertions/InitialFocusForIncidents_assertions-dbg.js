/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("opa5.Assertions.InitialFocusForIncidents_assertions");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");
//sap.ui.test.Opa5.getWindow().sap.ui.getCore();

new sap.ui.test.Opa5.extend("opa5.Assertions.assertions",{

       iShouldSeeTiles : function () {
             return this.waitFor({
            	 id : "masterTileContainerPage",
                 viewName : "splView.tileContainer.MasterTileContainer",
                 check : function () {
                	 return this.getContext().oAppsPage && this.getContext().oAppsPage.getContent().length > 0;
                 },
                 success : function (oPage) {
                	 this.getContext().oShell = oPage.getParent().getParent().getParent().getParent();
                     var aPageTiles = this.getContext().oAppsPage.getContent();
                     var oObject = {};
                     for (var i=0; i< aPageTiles.length; i++) {
                    	 oObject[aPageTiles[i].getBindingContext().getProperty().AppID] = aPageTiles[i];
                     }
                     this.getContext().oUIAppsObject = oObject;
                     ok(oPage, "Found the apps tiles : "+this.getContext().oAppsPage.getContent().length+" tiles");
                 },
                 errorMessage : "The apps tiles did not contain entries",
             });
       },
       
       iSeeFocusOnSearchField : function(){
           return this.waitFor({
               controlType : "sap.m.SearchField",
               check : function(oSearchField){
                      return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==="IncidentsMasters--sapSplIncidentSearch";
               },
               success : function(){
                      ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==='IncidentsMasters--sapSplIncidentSearch',"Focus is on the element"+ " " +"- Search Field");
               },
               errorMessage : "Focus on the wrong element" + " " + sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()
           });
       },
       
       iSeeFocusOnNameField : function() {
           return this.waitFor({
               controlType : "sap.m.Input",
               check : function(oInput){
                   return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==="IncidentsDetails--SapSplIncidentsNameInput";
               },
               success : function(oInput){
                   ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==='IncidentsDetails--SapSplIncidentsNameInput',"Focus is on the right element"+ " " +"- Name Field");
               },
               errorMessage :"Focus on the wrong element" + " " +sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()
           });
       },

});