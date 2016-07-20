/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("opa5.Assertions.assertions");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");


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
                console.log(oObject);

                ok(oPage, "Found the apps tiles : "+this.getContext().oAppsPage.getContent().length+" tiles");
            },
            errorMessage : "The apps tiles did not contain entries",
        });
    },

    saveShellInstance : function(){

        return this.waitFor({
            id : "sapSplBaseUnifiedShell",
            //viewName : "splView.tileContainer.MasterTileContainer",
            success : function(oShellInstance) {

                this.getContext().oShellGInstance = oShellInstance;
                ok(true,"shell instance saved!");
            },
            errorMessage : "Failed!"
        });
    },



    iShouldNavigateToUsersApp : function() {
        return this;
    },
    iClickOnUsersTile: function() {
        return this.waitFor({
            id: "MyContactsMaster--MyContactsMasterPage-title",
            success : function(oLabel)
            {
                ok(true, "The users page is displayed"+oLabel);
            },
            errorMessage : "The users page didnt load"
        });

    },

    isAddDriverOptionClicked : function()
    {
        return this.waitFor({
            id: "NewContactRegistrationDetail--NewContactRegistrationDetailPage-title",
            success : function(){

                //addDriver.firePress();
                ok(true, "Add driver button clicked");
            },
            errorMessage : "did not find the button"
        });
    },

    iseeSuccessToastMessage : function(sText)
    {

        return this.waitFor({
            /*check : function() {
                return jQuery(".sapMMessageToast").length > 0;
            },*/
            "class" : "sapMMessageToast",
            success : function(){
                ok(true, sText +" added successfully");
            },
            errorMessage : "Error in adding" +sText
        });
    },

    iAmLoggedOutFromTheApp : function()
    {
        return this.waitFor({
            /*var    oLabel = oPage.getContent()[0].getContent()[0].getContent()[0].getText();*/
//            id : "views.WelcomePage",
            check: function () {
                alert($("#sapSplSelfRegAppContainer").length);
                if ($("#sapSplSelfRegAppContainer").length > 0) {
                    return true;
                } else {
                    return false;
                }
            },
            /*matchers : new sap.ui.test.matchers.PropertyStrictEquals({
                name : "text",
                value : otext
            }),*/
            success : function (page) {
                var otext = page.getContent()[0].getContent()[0].getContent()[0].getText();
                if(page.getContent()[0].getContent()[0].getContent()[0].isActive()){
                    ok(true, "Found the text " +otext);
                }
            },
            errorMessage : "Logout unsuccessful"
        });
    },

    incidentsTileIsLoaded : function()
    {
        return this.waitFor({
            id : "IncidentsDetails--SapSplIncidentsDetailPage-title",
            success : function()
            {
                ok(true, "Incidents tile is opened");
            },
            errorMessage : "Incidents Tile not loaded"
        });
    },

    /* Help,Logout,add hub,edit subscription,deregister, help  */
    pdfLoaded : function(){
        return this.waitFor({
            id: "splView.help.Help--sapSplHelpPage-title",
            success : function(oLabel)
            {
                ok(true, "The users page is displayed"+oLabel);
            },
            errorMessage : "The users page didnt load"
        });
    },

    iclickonTSTile : function(){
        var titleId = $(".trafficStatusTitle").attr("id");
        return this.waitFor({
            id: titleId,
            success : function(oLabel)
            {
                ok(true, "The live app page is displayed"+oLabel);
            },
            errorMessage : "The live app page didn't load!"
        });
    },

    iclickonBPDialog : function(){
        var titleBPDialog = $(".splSendMessageBusinessPartnerDialog").attr("id");
        return this.waitFor({
            id : titleBPDialog,
            success : function(){
                ok(true,"dialog has been opened!"+titleBPDialog);
            },
            errorMessage : "The dialog hasn't appeared!"
        });
    },

    iclickonF4HelpList : function(){
        var selectBPDialogView = $(".sendMessageBusinessPartnerDialogContainerView").attr("id");
        var selBPDialogViewID = sap.ui.getCore().byId(selectBPDialogView);

        return this.waitFor({
            id : selBPDialogViewID,
            success : function(){
                ok(true,"The view has been opened!");
            },
            errorMessage : "The view could not be opened!"
        });
    },

    iSeeCarrierDialog : function(){

        return this.waitFor({
            controlType: "sap.m.Dialog",
            success : function(oDialog1){
                var oLabel = oDialog1[0].getContent()[0].getContent()[0].getContent()[0].getCurrentPage().getCustomHeader().getContentMiddle()[0].getText();
                ok(true,"The carrier page has opened! "+oLabel);
            },
            errorMessage : "The carrier page didn't open!"
        });
    },

    iSeeBPDialog : function(){
        return this.waitFor({
            controlType : "sap.m.Dialog",
            success : function(oDialog1){
                var oLabel = oDialog1[0].getContent()[0].getContent()[0].getContent()[0].getCurrentPage().getTitle();
                ok(true, "BP Dialog back again "+oLabel);
            },
            errorMessage:"BP Dialog couldn't be loaded!"
        });
    },

    iSeeToastMessage : function(){
        return this.waitFor({
            "class" : "sapMMessageToast",
            success : function(oMessageToast){
                ok(true,"Message Toast Successfully displayed!");
            },
            errorMessage : "Toast Message was not displayed!"
        });
    },

    helpPDFLoaded : function(){
        return this.waitFor({
            controlType: "sap.m.Dialog",
            success : function(oDialog1){
                var dlgTitle = oDialog1[0].getTitle();
                ok(true,"pdf loaded! The dialog title is "+dlgTitle);
            },
            errorMessage:"PDF didn't load!"
        });
    },

    iSeeAPopover : function(){
        return this.waitFor({
            controlType : "sap.m.Popover",
            success : function(){
                ok(true,"Popover appears!");
            },
            errorMessage: "Popover doesn't appear!"
        });
    },
    iSeeAddHubDialog:function(){
        return this.waitFor({
            controlType : "sap.m.Dialog",
            success : function(oDialog){
                var hubTitle = oDialog[0].getTitle();
                ok(true,"title is "+hubTitle);
            },
            errorMessage : "Dialog wasn't found!"
        });
    },

    iseeConfirmationDialog : function(){
        return this.waitFor({
            controlType : "sap.m.Dialog",
            success : function(oDialog){
                var oDialogTitle = oDialog[1].getTitle();
                ok(true,"Edit dialog has been opened : "+ oDialogTitle);
            },
            errorMessage : "Edit Dialog could not be opened!"
        });
    },

    iSeeLogOutDialog: function(){
        return this.waitFor({
            controlType : "sap.m.Dialog",
            success : function(oDialog){
                var title = oDialog[0].getTitle();
                ok(true,"Logout alert has been opened!" + title);
            },
            errorMessage : "Logout Alert could not be opened!"
        });
    },

    iSeeLogOutPage : function(){

        return this.waitFor({
            controlType : "sap.m.Panel",
            success : function () {
                ok(true, "Found the text ");
            },
            errorMessage : "Logout unsuccessful"
        });

    },

    iSeeDeregistrationDialog : function(){
        return this.waitFor({
            controlType : "sap.m.Dialog",
            success : function(oDialog){
                var oDeregTitle = oDialog[1].getTitle();
                ok(true,"Deregistration Dialog appeared : "+oDeregTitle);
            },
            errorMessage : "Deregistration Dialog isn't appearing!"
        });
    },

    iSeeComLogTileLoaded : function(){
        return this.waitFor({
            id: "splView.communicationLog.communicationLog--sapSplCommunicationLogPage-title",
            success : function()
            {
                ok(true, "The Communication Log app page is displayed");
                this.iSeeFocus();
            },
            errorMessage : "The  Communication Log app page didn't load!"
        });
    },

    iSelectDataFromComboBox: function(){
        return this.waitFor({
            controlType: "sap.m.MultiComboBox",
            success: function(oEvent){
                oEvent[0].setSelectedItems([oEvent[0].getItems()[0]]);
                ok(true, "Option Selected from Response Code");
            },
            errorMessage: "Option not selected from response Code"
        });
    },
    iClickonGo: function(){
        return this.waitFor({
            controlType: "sap.m.Button",
            matchers : new sap.ui.test.matchers.PropertyStrictEquals({
                name : "text",
                value : "Go"
            }),
            success : function (oButtons) {
                oButtons[0].$().trigger("tap");
                ok(true, "Go button pressed");
            },
            errorMessage: "Button not found"
        });
    },
    iSeeTheResults:function(){
        var data = null;
        return this.waitFor({
            id: "splView.communicationLog.communicationLog--SapSplCommunicationLogTable",
            success: function(oTable){
                data =    oTable.getItems().length;               
                if(data>0){
                this.iSelectDataFromComboBox().and.iClickonGo();
                ok(true, "Records found "+data);
                }
                else
                ok(true, "Record  not found ");    
            },
        });
    },

    iSeeResultsSortedOrGrouped: function(){
        return this.waitFor({
            id: "splView.communicationLog.communicationLog--SapSplCommunicationLogTable",
            success: function(oTable){
                var a =    oTable.getBinding("items");
                var bDesc = a.aSorters[0].bDescending;
                if(bDesc){
                    ok(true, "Sorted by "+a.aSorters[0].sPath+ "in Descending Order");}
                else{
                    ok(true, "Sorted by "+a.aSorters[0].sPath+ "in Ascending Order");
                }
            },
            error: "Not Sorted",
        });
    },
    
    iSeeFocus : function(){
        return this.waitFor({
               id:"splView.communicationLog.communicationLog--timeHorizonSelect",
              // viewName : "splView.communicationLog.communicationLog",
               check: function(oInput){
                      return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==='splView.communicationLog.communicationLog--timeHorizonSelect';
               },
               success : function(oInput){
                      ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==='splView.communicationLog.communicationLog--timeHorizonSelect',"Focus is on the right input element"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId());
                      },
        errorMessage : "Focus on the wrong input "+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()
        });
  },


});