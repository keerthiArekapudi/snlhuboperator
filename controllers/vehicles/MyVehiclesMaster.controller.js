/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.vehicles.MyVehiclesMaster",{onInit:function(){var s=null,S=null,o=null;var t=this;try{s=sap.ui.getCore().getModel("myVehiclesListODataModel");s.setCountSupported(false);s.attachRequestCompleted(jQuery.proxy(this.ODataModelRequestCompleted,this));s.attachRequestFailed(function(){oSapSplBusyDialog.getBusyDialogInstance().close();});o=sap.ui.getCore().getModel("myDriversListODataModel");o.setCountSupported(false);o.attachRequestCompleted(jQuery.proxy(this.ODataModelRequestCompleted,this));o.attachRequestFailed(function(){oSapSplBusyDialog.getBusyDialogInstance().close();if(sap.ui.getCore().getModel("SapSplMyVehicleDetailModel")){oSapSplBusyDialog.getBusyDialogInstance().close();var E={};E["isClicked"]=false;E["noData"]=true;E["showFooterButtons"]=false;E["isEdit"]=false;E["isEditable"]=false;sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(E);}});sap.ui.getCore().setModel(s,"myVehiclesListODataModel");sap.ui.getCore().setModel(s,"myDriversListODataModel");this.getView().byId("SapSplVehiclesList").setModel(sap.ui.getCore().getModel("myVehiclesListODataModel"));this.oSapSplMyVehiclesFilterIsValidTruck=new sap.ui.model.Filter("isDeleted",sap.ui.model.FilterOperator.EQ,"0");this.oSapSplMyVehiclesFilterIsNotSharedTruck=new sap.ui.model.Filter("isSharedWithMyOrg",sap.ui.model.FilterOperator.EQ,0);S=this.getView().byId("SapSplVehiclesList").getBinding("items");S.filter([this.oSapSplMyVehiclesFilterIsValidTruck,this.oSapSplMyVehiclesFilterIsNotSharedTruck]);this.oSapSplDeviceSorterDevice=new sap.ui.model.Sorter("DeviceCategory",true,this.handleGroupingOfTrucks);this.oSapSplRegistrationNumberSorter=new sap.ui.model.Sorter("RegistrationNumber");S.sort([this.oSapSplDeviceSorterDevice,this.oSapSplRegistrationNumberSorter]);this.statusData=[{name:oSapSplUtils.getBundle().getText("FILTER_LABEL_ALL"),selected:true,id:"all"},{name:oSapSplUtils.getBundle().getText("FILTER_LABEL_ACTIVE"),selected:false,id:"active"},{name:oSapSplUtils.getBundle().getText("FILTER_LABEL_INACTIVE"),selected:false,id:"inactive"},{name:oSapSplUtils.getBundle().getText("FILTER_LABEL_DEREGISTERED"),selected:false,id:"dereg"}];this.prepareDialogForFilters();this.preparePopOverForSorters();this.createFiltersAndSorters();this.fnDefineControlLabelsFromLocalizationBundle();this.byId("FilterStatusText").setText(oSapSplUtils.getBundle().getText("FILTER_LABEL_ALL"));this.appliedFilters=[];this.appliedSorters=[];this.appliedFilters=this.byId("SapSplVehiclesList").getBinding("items").aFilters;this.appliedSorters=this.byId("SapSplVehiclesList").getBinding("items").aSorters;this.getView().addEventDelegate({onAfterShow:function(E){window.setTimeout(function(){t.getView().byId("sapSplVehicleSearch").focus();},100);}});}catch(e){if(e instanceof Error){jQuery.sap.log.error(e.message,"MyVehiclesList not defined",this.getView().getControllerName());}}},fireSelectionOfAddTruckMode:function(e){var t=this;var a=jQuery.extend(true,{},e);if(oSapSplUtils.getIsDirty()){sap.m.MessageBox.show(oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),sap.m.MessageBox.Icon.WARNING,oSapSplUtils.getBundle().getText("WARNING"),[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.CANCEL],function(s){if(s==="YES"){oSapSplUtils.setIsDirty(false);oSapSplUtils.oSplitAppBaseVehicle._aMasterPages[0].getContent()[0].getFooter().getContentRight()[2].firePress();t.navigateToAddNewTruck(a);}},null,oSapSplUtils.fnSyncStyleClass("messageBox"));}else{this.navigateToAddNewTruck(e);}},navigateToAddNewTruck:function(){oSapSplUtils.setIsDirty(false);oSapSplUtils.getCurrentMasterPageVehicle().byId("SapSplVehiclesList").removeSelections();if(oSapSplUtils.getCurrentDetailPageVehicle().sId==="MyVehiclesDetailAddVehicle"){var d=sap.ui.getCore().getModel("myVehiclesAddVehicleModel").getData();d["data"]=this.getEmptyAddVehicleData("create");sap.ui.getCore().getModel("myVehiclesAddVehicleModel").setData(d);oSapSplUtils.getCurrentDetailPageVehicle().byId("NewContactRegistrationDetailPage").setTitle(oSapSplUtils.getBundle().getText("ADD_VEHICLE_TITLE"));oSapSplUtils.getCurrentDetailPageVehicle().byId("SapSplNewVehiclesVehicleRegistrationNumber").setEditable(true);oSapSplUtils.getCurrentDetailPageVehicle().byId("sapSplNewVehicleMobileDeviceID").setValue("");oSapSplUtils.getCurrentDetailPageVehicle().getController().mode="Create";oSapSplUtils.getCurrentDetailPageVehicle().getController().updateEnumsWithNone("remove");oSapSplUtils.getCurrentDetailPageVehicle().byId("sapSplNewVehiclesVehicleType").setSelectedItem(null);oSapSplUtils.getCurrentDetailPageVehicle().byId("sapSplNewVehiclesDeviceType").setSelectedItem(null);oSapSplUtils.getCurrentDetailPageVehicle().byId("sapSplNewVehiclesDeviceType").fireChange({selectedItem:oSapSplUtils.getCurrentDetailPageVehicle().byId("sapSplNewVehiclesDeviceType").getItems()[0]});oSapSplUtils.setIsDirty(false);}else{var b=sap.ui.getCore().getEventBus();b.publish("navInDetailVehicle","to",{from:this.byId("SapSplAddNewTruck"),data:{context:this.getEmptyAddVehicleData("create")}});}},getEmptyAddVehicleData:function(m){var e={};e["RegistrationNumber"]="";e["Type"]="";e["VehicleDriverFirstName"]="";e["VehicleDriverLastName"]="";e["PublicName"]="";e["Status"]="";e["DeviceType"]="";e["DevicePublicName"]="Select Device";e["PublicName"]="";e["DeviceStatus"]=null;e["VehicleChangeMode"]="C";e["SelectedKey"]="info";if(m&&m==="create"){e["isClicked"]=true;e["noData"]=false;e["showFooterButtons"]=true;}else{e["isClicked"]=false;e["noData"]=true;e["showFooterButtons"]=false;}return e;},fnDefineControlLabelsFromLocalizationBundle:function(){this.byId("SapSplMyVehiclesMasterPage").setTitle(oSapSplUtils.getBundle().getText("MY_VEHICLES_MASTER_TITLE","0"));this.byId("SapSplVehiclesList").setNoDataText(oSapSplUtils.getBundle().getText("NO_TRUCKS_TEXT"));this.byId("SapSplAddNewTruck").setTooltip(oSapSplUtils.getBundle().getText("MY_VEHICLES_ADD_TRUCK"));this.byId("sapSplFilterVehiclesButton").setTooltip(oSapSplUtils.getBundle().getText("FILTER_BUTTON_TOOLTIP"));this.byId("sapSplGroupVehiclesButton").setTooltip(oSapSplUtils.getBundle().getText("GROUPBY_BUTTON_TOOLTIP"));},prepareDialogForFilters:function(){var t=this;this.oSapSplVehicleDialogForFilters=new sap.m.Dialog({title:oSapSplUtils.getBundle().getText("FILTER_BY"),content:new sap.m.List({mode:"SingleSelectLeft",items:{path:"/items",template:new sap.m.StandardListItem({title:"{name}",selected:"{selected}"})}}),leftButton:new sap.m.Button({text:oSapSplUtils.getBundle().getText("OK_BUTTON_TEXT"),press:function(){t.oSapSplVehicleDialogForFilters.close();}}),rightButton:new sap.m.Button({text:oSapSplUtils.getBundle().getText("MY_COLLEAGUES_CANCEL_BUTTON"),press:function(){t.oSapSplVehicleDialogForFilters.close();t.getView().byId("sapSplVehicleSearch").focus();}})}).addStyleClass("SapSplFilterDialog").attachAfterClose(function(e){if(e.getParameters("origin").origin.getText()!==oSapSplUtils.getBundle().getText("MY_COLLEAGUES_CANCEL_BUTTON")){var i="";i=e.getSource().getContent()[0].getSelectedItems()[0].getBindingContext().getProperty("id");jQuery.proxy(t.handleSelectOfFilter(i),t);}}).attachAfterOpen(function(e){oSapSplUtils.fnSyncStyleClass(e.getSource());});this.oSapSplVehicleDialogForFilters.setModel(new sap.ui.model.json.JSONModel({items:this.statusData}));},preparePopOverForSorters:function(){var s=null;this.oSapSplDevicePopOverForSorters=new sap.m.Popover({placement:sap.m.PlacementType.Top,showHeader:false});s=new sap.ui.commons.layout.VerticalLayout().addStyleClass("sapsplTruckMasterPopover");s.addContent(new sap.m.RadioButton({id:"all"}).setText(oSapSplUtils.getBundle().getText("FILTER_LABEL_NONE")).attachSelect(jQuery.proxy(this.handleSelectOfSorterRadioButton,this)));s.addContent(new sap.m.RadioButton({id:"device",selected:true}).setText(oSapSplUtils.getBundle().getText("SORT_LABEL_DEVICE_TYPE")).attachSelect(jQuery.proxy(this.handleSelectOfSorterRadioButton,this)));this.oSapSplDevicePopOverForSorters.addContent(s);},onSelectOfVehicle:function(e){this.handleMyVehicleSelect(e.getParameter("listItem").getBindingContext().getProperty());},handleMyVehicleSelect:function(s){var t=this,c,m,i;if(oSapSplUtils.getIsDirty()){sap.m.MessageBox.show(oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),sap.m.MessageBox.Icon.WARNING,oSapSplUtils.getBundle().getText("WARNING"),[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.CANCEL],function(a){if(a==="YES"){t.updateVehicleDetailPage(s);oSapSplUtils.setIsDirty(false);}else{c=sap.ui.getCore().getModel("myVehiclesAddVehicleModel").getData().data;if(!c){c=sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData();}m=oSapSplUtils.getCurrentMasterPageVehicle().byId("SapSplVehiclesList");m.removeSelections();if(c.UUID){for(i=0;i<m.getItems().length;i++){if(m.getItems()[i].sId.indexOf("SapSplVehiclesListItem")!==-1){if(m.getItems()[i].getBindingContext().getProperty().UUID===c.UUID){m.setSelectedItem(m.getItems()[i]);break;}}}}else{m.removeSelections();}}},null,oSapSplUtils.fnSyncStyleClass("messageBox"));}else{t.updateVehicleDetailPage(s);}},updateVehicleDetailPage:function(s){try{s["SelectedKey"]="info";s["isClicked"]=true;s["noData"]=false;s["showFooterButtons"]=true;s["isEdit"]=false;s["enableInfo"]=true;s["oSharedPermissionInfo"]={};if(oSapSplUtils.getCurrentDetailPageVehicle()){if(oSapSplUtils.getCurrentDetailPageVehicle().sId==="MyVehiclesDetail"){var S=this.getBupaPermissionsData(s["UUID"]);s["BupaPermissions"]=S.data;s["isClicked"]=true;s["noData"]=false;s["showFooterButtons"]=true;s["isEdit"]=false;s["enableInfo"]=true;if(S.count===0){s["isSharedByMyOrg"]=0;}else{s["isSharedByMyOrg"]=1;}sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(s);var d=oSapSplUtils.getCurrentDetailPageVehicle().getContent()[0].getFooter().getContentRight();var i;if(d.length===5){d[0].setVisible(true);d[1].setVisible(true);d[2].setVisible(true);d[3].setVisible(false);d[4].setVisible(false);}if(d.length>2){if(s["Status"]==="A"){d[1].setText(oSapSplUtils.getBundle().getText("MY_VEHICLES_DEACTIVATE"));}else{d[1].setText(oSapSplUtils.getBundle().getText("MY_VEHICLES_ACTIVATE"));}}if(s["isDeleted"]==="1"){for(i=0;i<d.length;i++){d[i].setEnabled(false);}}else{for(i=0;i<d.length;i++){d[i].setEnabled(true);}}if(sap.ui.getCore().byId("MyVehiclesDetail--sapSplSharePermissionsLayout")){sap.ui.getCore().byId("MyVehiclesDetail--sapSplSharePermissionsLayout").rerender();}}else{var b=sap.ui.getCore().getEventBus();b.publish("navInDetailVehicle","to",{from:this.getView(),data:{context:s}});}}else{throw new Error();}}catch(e){if(e instanceof Error){jQuery.sap.log.error(e.message,"There is no current Detail Page in MyVehicles SplitApp.",this.getView().getControllerName());}}},ODataModelRequestCompleted:function(){if(arguments[0].getParameters().success){oSapSplBusyDialog.getBusyDialogInstance().close();this.onAfterListRendering();}else{if(sap.ui.getCore().getModel("SapSplMyVehicleDetailModel")){oSapSplBusyDialog.getBusyDialogInstance().close();var e={};e["isClicked"]=false;e["noData"]=true;e["showFooterButtons"]=false;e["isEdit"]=false;e["isEditable"]=false;sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(e);}}},onAfterRendering:function(){},onAfterListRendering:function(){oSapSplBusyDialog.getBusyDialogInstance().close();var s=[];var l=(this.byId("SapSplVehiclesList").getCustomData().length>0)?this.byId("SapSplVehiclesList").getCustomData()[this.byId("SapSplVehiclesList").getCustomData().length-1].getKey():null,_=1;try{if(this.byId("SapSplVehiclesList")){s=this.byId("SapSplVehiclesList").getItems();if(s.length){this.byId("SapSplMyVehiclesMasterPage").setTitle(oSapSplUtils.getBundle().getText("MY_VEHICLES_MASTER_TITLE",[splReusable.libs.Utils.prototype.getListCount(this.byId("SapSplVehiclesList"))]));if(l!==null){for(var c=0;c<s.length;c++){if(s[c].constructor!==sap.m.GroupHeaderListItem){if(l===s[c].getBindingContext().getProperty("UUID")){_=c;break;}}}}}if(s.length>0){this.selectFirstItem(_);if(sap.ui.getCore().getModel("SapSplMyVehicleDetailModel")){var m=sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData();m["noData"]=false;m["isClicked"]=true;m["showFooterButtons"]=true;sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(m);}}else{if(sap.ui.getCore().getModel("SapSplMyVehicleDetailModel")){oSapSplBusyDialog.getBusyDialogInstance().close();var E={};E["isClicked"]=false;E["noData"]=true;E["showFooterButtons"]=false;E["isEdit"]=false;E["isEditable"]=false;sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(E);}this.byId("SapSplMyVehiclesMasterPage").setTitle(oSapSplUtils.getBundle().getText("MY_VEHICLES_MASTER_TITLE","0"));}}else{throw new Error();}}catch(e){if(e instanceof Error){jQuery.sap.log.error(e.message,"MyVehiclesList not defined",this.getView().getControllerName());}}this.getView().byId("sapSplVehicleSearch").focus();},handleGroupingOfTrucks:function(c){var k=c.getProperty("DeviceCategory");if(!k){return{key:"No Device",text:oSapSplUtils.getBundle().getText("GROUP_HEADER_NO_DEVICE")};}if(k==="M"){return{key:"MOBILEIF",text:oSapSplUtils.getBundle().getText("GROUP_HEADER_MOBILEIF")};}else{return{key:"On Board Unit",text:oSapSplUtils.getBundle().getText("GROUP_HEADER_OBU")};}},createFiltersAndSorters:function(){this.oSapSplDeviceFilterActive=new sap.ui.model.Filter("Status",sap.ui.model.FilterOperator.EQ,"A");this.oSapSplDeviceFilterInActive=new sap.ui.model.Filter("Status",sap.ui.model.FilterOperator.EQ,"I");this.oSapSplDeviceFilterDeRegistered=new sap.ui.model.Filter("isDeleted",sap.ui.model.FilterOperator.EQ,"1");},handleSelectOfFilter:function(i){var s=null,S=null;if(oSapSplUtils.getCurrentDetailPageVehicle().sId==="MyVehiclesDetail"){sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(this.getEmptyAddVehicleData(true));oSapSplUtils.getCurrentDetailPageVehicle().byId("vehicleDetailEdit").setEnabled(false);oSapSplUtils.getCurrentDetailPageVehicle().byId("vehicleDetailDeRegister").setEnabled(false);oSapSplUtils.getCurrentDetailPageVehicle().byId("vehicleDetailActivate_DeActicate").setEnabled(false);}try{if(this.byId("SapSplVehiclesList")){s=this.byId("SapSplVehiclesList");S=s.getBinding("items");if(S){S.filter([]);}else{throw new Error();}}else{throw new Error();}if(i==="active"){if(this.oSapSplDeviceFilterActive){this.byId("FilterStatusText").setText(oSapSplUtils.getBundle().getText("FILTER_LABEL_ACTIVE"));S.filter([this.oSapSplMyVehiclesFilterIsValidTruck,this.oSapSplDeviceFilterActive,this.oSapSplMyVehiclesFilterIsNotSharedTruck]);}else{throw new Error();}}else if(i==="inactive"){if(this.oSapSplDeviceFilterInActive){this.byId("FilterStatusText").setText(oSapSplUtils.getBundle().getText("FILTER_LABEL_INACTIVE"));S.filter([this.oSapSplMyVehiclesFilterIsValidTruck,this.oSapSplMyVehiclesFilterIsNotSharedTruck,this.oSapSplDeviceFilterInActive]);}else{throw new Error();}}else if(i==="dereg"){if(this.oSapSplDeviceFilterDeRegistered){this.byId("FilterStatusText").setText(oSapSplUtils.getBundle().getText("FILTER_LABEL_DEREGISTERED"));S.filter([this.oSapSplDeviceFilterDeRegistered]);}else{throw new Error();}}else if(i==="all"){this.byId("FilterStatusText").setText(oSapSplUtils.getBundle().getText("FILTER_LABEL_ALL"));S.filter([this.oSapSplMyVehiclesFilterIsValidTruck,this.oSapSplMyVehiclesFilterIsNotSharedTruck]);}else{var l="GROUP_HEADER_"+i;var d=new sap.ui.model.Filter("DeviceType",sap.ui.model.FilterOperator.EQ,i);this.byId("FilterStatusText").setText(oSapSplUtils.getBundle().getText(l));S.filter([this.oSapSplMyVehiclesFilterIsValidTruck,this.oSapSplMyVehiclesFilterIsNotSharedTruck,d]);}this.appliedFilters=S.aFilters;}catch(e){if(e instanceof Error){jQuery.sap.log.error(e.message,"undefined",this.getView().getControllerName());}}},handleSelectOfSorterRadioButton:function(E){var e=jQuery.extend(true,{},E);var t=this;if(E.getParameter("selected")){if(oSapSplUtils.getCurrentDetailPageVehicle().sId==="MyVehiclesDetail"){sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(this.getEmptyAddVehicleData(true));}if(oSapSplUtils.getIsDirty()){sap.m.MessageBox.show(oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),sap.m.MessageBox.Icon.WARNING,oSapSplUtils.getBundle().getText("WARNING"),[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.CANCEL],function(s){if(s==="YES"){oSapSplUtils.setIsDirty(false);t.sortMasterListBasedOnSortTypeSelection(e);}},null,oSapSplUtils.fnSyncStyleClass("messageBox"));}else{this.sortMasterListBasedOnSortTypeSelection(e);}}},sortMasterListBasedOnSortTypeSelection:function(e){var s=null,i="",S=null,a=[];try{if(this.oSapSplDevicePopOverForSorters){this.oSapSplDevicePopOverForSorters.close();}else{throw new Error();}i=e.getSource().sId;if(this.byId("SapSplVehiclesList")){s=this.byId("SapSplVehiclesList");S=s.getBinding("items");a=S.aFilters;this.byId("SapSplVehiclesList").unbindAggregation("items");this.byId("SapSplVehiclesList").bindItems({path:"/MyTrackableObjects",template:this.byId("SapSplVehiclesListItem")});S=this.byId("SapSplVehiclesList").getBinding("items");if(!S){throw new Error();}}else{throw new Error();}if(i==="device"){if(this.oSapSplDeviceSorterDevice){S.sort([this.oSapSplDeviceSorterDevice,this.oSapSplRegistrationNumberSorter]);S.filter(a);}else{throw new Error();}}else{S.filter(a);S.sort(this.oSapSplRegistrationNumberSorter);this.oSapSplVehicleDialogForFilters.getModel().setData({items:this.statusData});}this.appliedSorters=S.aSorters;}catch(b){if(b instanceof Error){jQuery.sap.log.error(b.message,"undefined",this.getView().getControllerName());}}},openSapSplDeviceFilterPopover:function(){var t=this;var i,c,m,b;if(oSapSplUtils.getIsDirty()){sap.m.MessageBox.show(oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),sap.m.MessageBox.Icon.WARNING,oSapSplUtils.getBundle().getText("WARNING"),[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.CANCEL],function(s){if(s==="YES"){oSapSplUtils.setIsDirty(false);b=sap.ui.getCore().getEventBus();b.publish("navInDetailVehicle","to",{from:t.getView(),data:{context:jQuery.extend(true,{},sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData())}});c=sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData();m=oSapSplUtils.getCurrentMasterPageVehicle().byId("SapSplVehiclesList");for(i=0;i<m.getItems().length;i++){if(m.getItems()[i].sId.indexOf("SapSplVehiclesListItem")!==-1){if(m.getItems()[i].getBindingContext().getProperty().UUID===c.UUID){m.setSelectedItem(m.getItems()[i]);break;}}}try{if(t.oSapSplVehicleDialogForFilters){t.oSapSplVehicleDialogForFilters.open();}else{throw new Error();}}catch(e){if(e instanceof Error){jQuery.sap.log.error(e.message,"Filter Dialog not defined",t.getView().getControllerName());}}}},null,oSapSplUtils.fnSyncStyleClass("messageBox"));}else{try{if(this.oSapSplVehicleDialogForFilters){this.oSapSplVehicleDialogForFilters.open();}else{throw new Error();}}catch(e){if(e instanceof Error){jQuery.sap.log.error(e.message,"Filter Dialog not defined",this.getView().getControllerName());}}}},openSapSplDeviceSortPopover:function(e){try{if(this.oSapSplDevicePopOverForSorters){this.oSapSplDevicePopOverForSorters.openBy(e.getSource());}else{throw new Error();}}catch(a){if(a instanceof Error){jQuery.sap.log.error(a.message,"Sort Popover not defined",this.getView().getControllerName());}}},selectFirstItem:function(c){var s=null,v=null,V=[],a;try{v=this.getView().byId("SapSplVehiclesList");V=v.getItems();if(V.length>0){if(c===1&&V[0].constructor===sap.m.StandardListItem){a=V[0].getId();V[0].setSelected(true);s=V[0].getBindingContext().getProperty();}else{a=V[c].getId();V[c].setSelected(true);s=V[c].getBindingContext().getProperty();var p=0;for(var l=1;l<V.length;l++){if(V[l].constructor===sap.m.GroupHeaderListItem){V[p].setCount(l-1-p);p=l;}}if(V[p].constructor===sap.m.GroupHeaderListItem){V[p].setCount(V.length-1-p);}window.setTimeout(function(){V[0].rerender();},100);window.setTimeout(function(){V[p].rerender();},100);if(c===0||c===1){document.getElementById(this.getView().byId("sapSplVehicleSearch").getId()).scrollIntoView(true);}else{window.setTimeout(function(){if(document.getElementById(a)){document.getElementById(a).scrollIntoView(true);}},100);}}}else{throw new Error();}s["rerender"]=true;this.updateVehicleDetailPage(s);}catch(e){if(e instanceof Error){jQuery.sap.log.error(e.message,"Cannot select first item of MyVehiclesList",this.getView().getControllerName());}}},fnHandleNavigationSearch:function(v){if(v){this.byId("sapSplVehicleSearch").setValue(v);var e={};e.mParameters={};e.mParameters.query="";this.fnToHandleSearchOfVehicles(e);e.mParameters.query="*"+v+"*";this.fnToHandleSearchOfVehicles(e);}},fnToHandleSearchOfVehicles:function(e){var s=e.mParameters.query;var S;var p,t=this,m;S=this.getView().byId("SapSplVehiclesList");if(s.length>2){p=this.prepareSearchPayload(s);this.callSearchService(p);}else if(S.getBinding("items")===undefined||S.getBinding("items").aFilters.length>1||(e.mParameters&&e.mParameters.refreshButtonPressed)===true){sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(this.getEmptyAddVehicleData(true));S.unbindAggregation("items");S.bindItems({path:"/MyTrackableObjects",template:t.getView().byId("SapSplVehiclesListItem")});S.getBinding("items").filter(this.appliedFilters);S.getBinding("items").sort(this.appliedSorters);m=sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData();m["noData"]=true;m["isClicked"]=false;m["showFooterButtons"]=false;sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(m);}},prepareSearchPayload:function(s){var p={};p.UserID=oSapSplUtils.getLoggedOnUserDetails().usreID;p.ObjectType="TrackableObject";p.SearchTerm=s;p.FuzzinessThershold=SapSplEnums.fuzzyThreshold;p.MaximumNumberOfRecords=SapSplEnums.numberOfRecords;p.ProvideDetails=false;p.SearchInNetwork=true;return p;},callSearchService:function(p){var t=this,u="",a={};u=oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/Search.xsjs");a={url:u,data:JSON.stringify(p),contentType:"json; charset=UTF-8",async:false,beforeSend:function(r){r.setRequestHeader("X-CSRF-Token",oSapSplUtils.getCSRFToken());r.setRequestHeader("Cache-Control","max-age=0");},success:jQuery.proxy(t.onSuccess,t),error:jQuery.proxy(t.onError,t),method:"POST"};oSapSplAjaxFactory.fireAjaxCall(a);},onSuccess:function(d,s,m){var S,o=[],a;var t=this,b,i;oSapSplBusyDialog.getBusyDialogInstance().close();if(d.constructor===String){d=JSON.parse(d);}if(m["status"]===200){a=t.getView().byId("SapSplVehiclesList");sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(t.getEmptyAddVehicleData(true));a.unbindAggregation("items");if(d.length>0){S=oSapSplUtils.getSearchItemFilters(d);if(S.aFilters.length>0){o.push(S);}for(i=0;i<t.appliedFilters.length;i++){o.push(t.appliedFilters[i]);}a.bindItems({path:"/MyTrackableObjects",template:t.getView().byId("SapSplVehiclesListItem")});a.getBinding("items").filter(o);a.getBinding("items").sort(t.appliedSorters);b=sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData();b["noData"]=false;b["isClicked"]=true;b["showFooterButtons"]=true;sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(b);}else{b=sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData();a.setBusy(false);b["noData"]=true;b["isClicked"]=false;b["showFooterButtons"]=false;b["isEditable"]=0;b["isDeleted"]=0;sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(b);t.byId("SapSplMyVehiclesMasterPage").setTitle(oSapSplUtils.getBundle().getText("MY_VEHICLES_MASTER_TITLE","0"));}}else if(d["Error"]&&d["Error"].length>0){var e=oSapSplUtils.getErrorMessagesfromErrorPayload(d)["ufErrorObject"];sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:oSapSplUtils.getErrorMessagesfromErrorPayload(d)["errorWarningString"],details:e});}},onError:function(e){var m;oSapSplBusyDialog.getBusyDialogInstance().close();m=sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData();m["noData"]=true;m["isClicked"]=false;m["showFooterButtons"]=false;m["isEditable"]=0;m["isDeleted"]=0;sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(m);if(e&&e["status"]===500){sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:e["status"]+"\t"+e.statusText,details:e.responseText});}else{sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(e.responseText))["errorWarningString"],details:oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(e.responseText))["ufErrorObject"]});}},getBupaPermissionsData:function(U){var m=sap.ui.getCore().getModel("myVehiclesListODataModel");var b=[],s=0;var d=null,D=["$filter=UUID eq X"+"'"+oSapSplUtils.base64ToHex(U)+"' and ShareDirection eq 'O' and Role eq 'FREIGHTFWD'"],I=false;var u="/SharedList";if(m){m.read(u,d,D,I,function(r){b=r.results;for(var i=0;i<b.length;i++){if(b[i]["isShared"]===1){b[i]["showBupa"]=true;s++;}else{b[i]["showBupa"]=false;}}},function(){});}if(b){return{data:b,count:s};}},fnHandleBackNavigation:function(){var b=null;b=oSplBaseApplication.getAppInstance();if(b.getPreviousPage()){b.back();}else{b.to("splView.tileContainer.MasterTileContainer");}},refreshAssignmentStatus:function(){oSapSplBusyDialog.getBusyDialogInstance().open();sap.ui.getCore().getModel("myVehiclesListODataModel").attachRequestCompleted(function(){oSapSplBusyDialog.getBusyDialogInstance().close();});sap.ui.getCore().getModel("myVehiclesListODataModel").attachRequestFailed(function(){oSapSplBusyDialog.getBusyDialogInstance().close();});sap.ui.getCore().getModel("myVehiclesListODataModel").refresh();},onBeforeShow:function(){var n="",g="",m=null;n=jQuery.sap.getUriParameters().get("navToHome");g=jQuery.sap.getUriParameters().get("goto");m=this.byId("SapSplMyVehiclesMasterPage");if(g){if(n&&n==="false"){m.setShowNavButton(false);}else if(n&&n==="true"){m.setShowNavButton(true);}else{m.setShowNavButton(false);}}else{m.setShowNavButton(true);}}});
