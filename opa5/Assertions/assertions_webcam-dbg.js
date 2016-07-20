/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("OPA5TestScript.Assertions.assertions_webcam");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");


new sap.ui.test.Opa5.extend("opa5.Assertions.assertions_webcam",{

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

    iSeeTrafficStatusPage : function() {
    	  return this.waitFor({
              id : "splView.liveApp.liveApp--sapSplTrafficStatusMapContainer",
              success : function()
              {
                  ok(true, "Traffic status page is loaded");
              },
              errorMessage : "Traffic status page is not loaded"
          });
    },
    
    iSeeAllEntities : function(){
        return this.waitFor({
            controlType : "sap.m.IconTabBar",
            check : function (oIconTabBar) {
                return oIconTabBar[0];
            },
            success : function(oIconTabbar){
                ok(true,"I see all the entities" + oIconTabbar[0]);
            },
            errorMessage : "Did not load the icon tab bar for entities"
        });
    },
    
    iSeeEntityList : function() {
    	 return this.waitFor({
             controlType : "sap.m.List",
             check : function (olist) {
               return olist[1]
           },
             success : function(oList){
                 ok(oList,"I see the list for the selected entity" + oList[1]);
             },
             errorMessage : "Did not load the list for the selected entity"
       });
    }, 
    
    
    iSeePopover : function() {
   	 return this.waitFor({
   		 controlType  : "sap.m.Popover",
   	   	 check : function (oPopover) {
            return oPopover;
         },
            success : function(opopover){
            	ok(true,"Popover is visible" + opopover);
            },
            errorMessage : "Did not load the popover"
      });
   },
   
	   iClickOnWebCamUrl : function() {
	      	 return this.waitFor({
	      		 controlType  : "sap.m.Link",
	      		check : function(oLink){
	 			   return oLink;
	 		   },
	               success : function(oLink){
	               	for(var i=0; i < oLink.length ; i++) {
	               		if(oLink[i].sId === webcamlink_id){
	               			if(oLink[i].getText() !== ""){
	               				oLink[i].firePress();
	               				ok(true, "Clicked on the webcam url link" + oLink[i].getText());
	               				break;
	               			}
	               			else{
	               				ok(true, "Link for the webcam was not present");
	               			}
	               			break;
	               		}
	               	}
	               },
	               errorMessage : "Did not click on the link for webcam"
	         });
	      },
});