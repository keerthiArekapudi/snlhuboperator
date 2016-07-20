/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ui.test.Opa5");jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");new sap.ui.test.Opa5.extend("opa5.Actions.actions_tours",{iclickonToursTile:function(){return this.waitFor({id:this.getContext().oUIAppsObject.manageTours.sId,check:function(u){return u.getState()==="Loaded";},success:function(t){t.firePress();ok(t,"Tours tile is loaded and fired press"+t);},errorMessage:"The Tours tile did not load",});},iclickonCreateNewTours:function(){return this.waitFor({controlType:"sap.m.Button",success:function(b){b[3].firePress();ok(b,"Clicked on the 'Create New Tours' button"+b[3]);},errorMessage:"Did not click on the 'Create New Button'",});},iclickonAddFreightItemsLink:function(){return this.waitFor({id:"CreateNewTour--sapSplAddFreightItemLink",success:function(l){l.firePress();ok(l,"Clicked on the 'Add freight items' link"+l);},errorMessage:"Did not click on the 'Add freight items' link",});},iEnterValues:function(){return this.waitFor({controlType:"sap.m.Dialog",success:function(d){d[0].getContent()[0].getContent()[0].getContent()[0].getContent()[3].setValue("1234"),d[0].getContent()[0].getContent()[0].getContent()[0].getContent()[5].setValue("Heavy goods"),container_code="1234";container_type="Heavy goods";ok(true,"Freight item details entered");},errorMessage:"Did not enter freight item values",});},iClickOnOkButton:function(){return this.waitFor({controlType:"sap.m.Button",success:function(b){b[0].firePress();ok(b,"Clicked on the Ok button"+b[0]);},errorMessage:"Did not click on the Ok button",});},iClickOnStopInputField:function(){return this.waitFor({id:"CreateNewTour--AddStopsLayout",check:function(l){return l.getContent()[index].getContent()[0].getContent()[1].getContent()[0];},success:function(l){l.getContent()[index].getContent()[0].getContent()[1].getContent()[0].fireValueHelpRequest();ok(l,"Clicked on stop input field"+l.getContent()[index].getContent()[0].getContent()[1].getContent()[0]);},errorMessage:"Did not click on stop input field",});},iClickOnCTButton:function(){return this.waitFor({controlType:"sap.m.Button",check:function(b){return b[1].getText()==="Container Terminals"},success:function(b){b[1].firePress();ok(b,"Clicked on the container terminal button button"+b[3]);},errorMessage:"Did not click on the container terminal button",});},iClickOnTableRow:function(){var r=0;return this.waitFor({controlType:"sap.m.Dialog",check:function(d){return d[0].getContent()[0].getContent()[1].getRows()[0].getBindingContext()!==undefined;},success:function(d){r=d[0].getContent()[0].getContent()[1].getRows().length;d[0].getContent()[0].getContent()[1].setSelectedIndex(Math.ceil(Math.random()*r));ok(true,"Stop Selected"+d);},errorMessage:"Did not select a stop"});},iclickOnAssignFreightItem:function(){return this.waitFor({id:"CreateNewTour--AddStopsLayout",check:function(l){return l.getContent()[index].getContent()[3].getContent()[0].getText()==="Assign freight item";},success:function(l){l.getContent()[index].getContent()[3].getContent()[0].firePress();ok(l,"Clicked on the 'Assign Freight Items' link"+l.getContent()[index].getContent()[3].getContent()[0]);},errorMessage:"Did not click on the 'Assign Freight Items' link",});},iClickOnPickUp:function(){return this.waitFor({controlType:"sap.m.Button",success:function(b){b[1].firePress();ok(b,"Clicked on the 'Pick Up' button"+b[1]);},errorMessage:"Did not click on the 'Pick Up' button",});},iClickOnDrop:function(){return this.waitFor({controlType:"sap.m.Button",success:function(b){b[2].firePress();ok(b,"Clicked on the 'Pick Up' button"+b[2]);},errorMessage:"Did not click on the 'Pick Up' button",});},iEnterOrderIdAndDestination:function(){return this.waitFor({controlType:"sap.m.Dialog",success:function(d){d[0].getContent()[0].getContent()[0].getItems()[0].getCells()[6].setValue("ORD-ID-41"+Math.ceil(Math.random()*50));d[0].getContent()[0].getContent()[0].getItems()[0].getCells()[7].setValue("LOADSTN-C61N"+Math.ceil(Math.random()*50));ok(true,"Entered Order Id and Destination description");},errorMessage:"Did not enter Order Id and Destination description",});},iClickOnCloseButton:function(){return this.waitFor({controlType:"sap.m.Button",success:function(b){b[3].firePress();ok(b,"Clicked on the Close button"+b[3]);},errorMessage:"Did not click on the Close button",});},iClickOnSaveForLaterButton:function(){return this.waitFor({controlType:"sap.m.Button",success:function(b){b[17].firePress();ok(b,"Clicked on the 'Save For Later' button"+b[17]);},errorMessage:"Did not click on the 'Save For Later' button",});},});
