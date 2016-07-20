/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.dialogs.SplChangeTourPromptDialog",{onInit:function(){this.byId("sapSplTourValueLabel").setText(this.getView().getViewData()["data"].getProperty("tourName"));},onAfterRendering:function(){}});
