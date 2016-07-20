/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("OPA5TestScript.Assertions.toursTAT_assertions");
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
              

                ok(oPage, "Found the apps tiles : "+this.getContext().oAppsPage.getContent().length+" tiles");
            },
            errorMessage : "The apps tiles did not contain entries",
        });
    },
    iShouldSeeIconTab : function(){
    	return this.waitFor({
    		id:"ToursOverview--idIconTabBar",
    		success : function(oIconTabBar)
    		{
    			ok(true,"IconTab Bar Visible");
    		},
    		errorMessage : "The icontab bar not loaded",
		
    	});
    },
    iShouldSeeCompletedTourList : function()
    {
    	return this.waitFor({
    		id:"ToursOverview--SapSplToursOverView",
    		success : function(oTable)
    		{
    			ok(true,"Completed tour list Available");
    		},
    		errorMessage : "Completed tour list is not visible",
    	});
    },
    iNavigatetoTourDetails : function()
    {
    	return this.waitFor({
    		controlType :"sap.suite.ui.commons.BulletChart",
    		check : function(oBulletChart)
    		{
    			var size = oBulletChart.length;
    			var colorMin = oBulletChart[size-2].getActual().mProperties.color;
    			var valueMin = oBulletChart[size-2].getActual().mProperties.value;
    			var targetMin = oBulletChart[size-2].getTargetValue();
    			var pos = oBulletChart[size-2].getTooltip_AsString().search("Delta");
    			var pos1 = oBulletChart[size-2].getTooltip_AsString().search("%");
    			var deltaMin = parseInt(oBulletChart[size-2].getTooltip_AsString().substring(pos+6, pos1));
    			var exceptedDeltaMin = Math.abs(valueMin - targetMin);
    			var colorMax = oBulletChart[size-1].getActual().mProperties.color;
    			var valueMax = oBulletChart[size-1].getActual().mProperties.value;
    			var targetMax = oBulletChart[size-1].getTargetValue();
    			var pos2 = oBulletChart[size-1].getTooltip_AsString().search("Delta");
    			var pos3 = oBulletChart[size-1].getTooltip_AsString().search("%");
    			var deltaMax = parseInt(oBulletChart[size-1].getTooltip_AsString().substring(pos2+6, pos3));
    			var exceptedDeltaMax = Math.abs(valueMax - targetMax);
    			var expectedcolorMin;
    			var expectedcolorMax;
    			if (valueMin<targetMin)
    				{
    				 expectedcolorMin = "Good";
    				}
    			else
    				{
    				expectedcolorMin = "Error";
    				}
    			if (valueMax<targetMax)
				{
				 expectedcolorMax = "Good";
				}
			else
				{
				expectedcolorMax = "Error";
				}
    			if(expectedcolorMax === colorMax && expectedcolorMin === colorMin && exceptedDeltaMin === deltaMin && exceptedDeltaMax === deltaMax)
    				{
    				ok(true,"BulletChart for Max TAT and Min TAT are present and color is correct with correct delta values");
    				return expectedcolorMax === colorMax && expectedcolorMin === colorMin && exceptedDeltaMin === deltaMin && exceptedDeltaMax === deltaMax;
    				}
    			else
    				{
    					ok(true,"BulletChart is Present and Color is not correct or delta value is not correct");
    					return expectedcolorMax === colorMax && expectedcolorMin === colorMin && exceptedDeltaMin === deltaMin && exceptedDeltaMax === deltaMax;
    				}
    			
    		},
    		success : function(oBulletChart)
    		{
    			ok(true,"Navigation successfull to tour details page");
    		},
    		errorMessage : "Could not navigate to tour details page",
    	});
    },
    iNavigatetoTours : function()
    {
    	return this.waitFor({
    		id:"ToursOverview--idIconTabBar",
    		success : function(oIconTabBar)
    		{
    			ok(true,"IconTab Bar Visible and navigated to tours page");
    		},
    		errorMessage : "The icontab bar not loaded",
		
    	});
    },
    iShouldSeeActiveTourList : function()
    {
    	return this.waitFor({
    		id :"ToursOverview--SapSplToursOverView",
    		success : function(oTable)
    		{
    			
    			ok(true,"Active tour list Available");
    		},
    		errorMessage : "Active tour list is not visible",
    	});
    },
    iShouldNotSeeTATBulletChart : function()
    {
    	return this.waitFor({
    		controlType : "sap.suite.ui.commons.HeaderCell",
    		check : function(oHeaderCell)
    		{
    			
    			if(oHeaderCell.length>1)
    				{
    					return false;
    				}
    			else
    				return true;
    		},
    		success : function(flag)
    		{
    			if(flag)
    				{
    					ok(true,"TAT bulletChart not present");
    				}
    			else
    				ok(true,"TAT bulletChart present and should not be");
    		},
    		errorMessage : "TAT bulletChart present and should not be",
    	});
    }
});

    