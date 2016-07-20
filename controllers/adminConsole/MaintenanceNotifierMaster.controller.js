/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.adminConsole.MaintenanceNotifierMaster",{onInit:function(){var s=null,S=null;try{s=sap.ui.getCore().getModel("UserNotificationListODataModel");s.setCountSupported(false);s.attachRequestCompleted(jQuery.proxy(this.ODataModelRequestCompleted,this));s.attachRequestFailed(function(){oSapSplBusyDialog.getBusyDialogInstance().close();if(sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel")){oSapSplBusyDialog.getBusyDialogInstance().close();var E={};E["isClicked"]=false;E["noData"]=true;E["showFooterButtons"]=false;sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(E);}});sap.ui.getCore().setModel(s,"UserNotificationListODataModel");this.getView().byId("SapSplMaintenanceNotifierList").setModel(sap.ui.getCore().getModel("UserNotificationListODataModel"));this.oSapSplNotificationFilterIsNotification=new sap.ui.model.Filter("isNotification",sap.ui.model.FilterOperator.EQ,"1");S=this.byId("SapSplMaintenanceNotifierList").getBinding("items");S.filter([this.oSapSplNotificationFilterIsNotification]);this.oSapSplNotificationSorter=new sap.ui.model.Sorter("isActive",true,this.handleGroupingOfNotifications);S.sort([this.oSapSplNotificationSorter]);this.statusData=[{name:oSapSplUtils.getBundle().getText("FILTER_LABEL_ALL"),selected:true,id:"all"},{name:oSapSplUtils.getBundle().getText("FILTER_LABEL_DB_UPGRADE"),selected:true,id:"dbupgrade"},{name:oSapSplUtils.getBundle().getText("FILTER_LABEL_CRITICAL_HOTFIX"),selected:true,id:"criticalhotfix"},{name:oSapSplUtils.getBundle().getText("FILTER_LABEL_PATCH"),selected:true,id:"patch"},{name:oSapSplUtils.getBundle().getText("FILTER_LABEL_OS_UPGRADE"),selected:true,id:"osupgrade"}];this.prepareDialogForFilters();this.preparePopOverForSorters();this.createFiltersAndSorters();this.fnDefineControlLabelsFromLocalizationBundle();this.byId("FilterStatusText").setText(oSapSplUtils.getBundle().getText("FILTER_LABEL_ALL"));this.appliedFilters=[];this.appliedSorters=[];this.appliedFilters=this.byId("SapSplMaintenanceNotifierList").getBinding("items").aFilters;this.appliedSorters=this.byId("SapSplMaintenanceNotifierList").getBinding("items").aSorters;}catch(e){if(e instanceof Error){jQuery.sap.log.error(e.message,"MyNotificationsList not defined",this.getView().getControllerName());}}},createFiltersAndSorters:function(){this.oSapSplNotificationFilterDBUpgrade=new sap.ui.model.Filter("MessageType",sap.ui.model.FilterOperator.EQ,"DUN");this.oSapSplNotificationFilterPatch=new sap.ui.model.Filter("MessageType",sap.ui.model.FilterOperator.EQ,"PAN");this.oSapSplNotificationFilterCriticalHotfix=new sap.ui.model.Filter("MessageType",sap.ui.model.FilterOperator.EQ,"CHN");this.oSapSplNotificationFilterOSUpgrade=new sap.ui.model.Filter("MessageType",sap.ui.model.FilterOperator.EQ,"OUN");},handleGroupingOfNotifications:function(c){var k=c.getProperty("isActive");if(k==="1"){return{key:"Active",text:oSapSplUtils.getBundle().getText("ACTIVE")};}else{return{key:"Expired",text:oSapSplUtils.getBundle().getText("EXPIRED")};}},fnHandleBackNavigation:function(){var b=null;b=oSplBaseApplication.getAppInstance();if(b.getPreviousPage()){b.back();}else{b.to("splView.tileContainer.MasterTileContainer");}},fnHandleAddNotication:function(){var t=this;var v={context:{type:"new"}};this.byId("SapSplMaintenanceNotifierList").removeSelections();if(this.getView().getParent().getParent().getCurrentDetailPage().sId==="MaintenanceNotifierDetail"){this.getView().getParent().getParent().toDetail("MaintenanceNotifierAddNotificationDetail","",v);}else{if(oSapSplUtils.getIsDirty()){sap.m.MessageBox.show(oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),sap.m.MessageBox.Icon.WARNING,oSapSplUtils.getBundle().getText("WARNING"),[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.CANCEL],function(s){if(s==="YES"){oSapSplUtils.setIsDirty(false);sap.ui.getCore().getModel("SapSplMaintenanceNotifierAddNotificationModel").setData(t.getEmptyAddNotificationData("create"));this.getView().getParent().getParent().getCurrentDetailPage().byId("sapSplMaintenanceNotifierDetailAddNotificationPage").setTitle(oSapSplUtils.getBundle().getText("NEW_NOTIFICATION"));}},null,oSapSplUtils.fnSyncStyleClass("messageBox"));}else{sap.ui.getCore().getModel("SapSplMaintenanceNotifierAddNotificationModel").setData(this.getEmptyAddNotificationData("create"));this.getView().getParent().getParent().getCurrentDetailPage().byId("sapSplMaintenanceNotifierDetailAddNotificationPage").setTitle(oSapSplUtils.getBundle().getText("NEW_NOTIFICATION"));}}},fnDefineControlLabelsFromLocalizationBundle:function(){this.byId("sapSplStartTime").setTitle(oSapSplUtils.getBundle().getText("STARTS"));this.byId("sapSplExpiryTime").setTitle(oSapSplUtils.getBundle().getText("EXPIRES"));this.byId("SapSplGroupNotificationsButton").setTooltip(oSapSplUtils.getBundle().getText("GROUP_BY"));this.byId("SapSplFilterNotificationsButton").setTooltip(oSapSplUtils.getBundle().getText("FILTER"));this.byId("SapSplAddNotificationsButton").setTooltip(oSapSplUtils.getBundle().getText("ADD_NOTIFICATION"));this.byId("sapSplMaintenanceNotifierMasterSearch").setTooltip(oSapSplUtils.getBundle().getText("SEARCH"));},prepareDialogForFilters:function(){var t=this;this.oSapSplNotificationDialogForFilters=new sap.m.Dialog({title:oSapSplUtils.getBundle().getText("FILTER_BY"),content:new sap.m.List({mode:"MultiSelect",select:t.fnHandleFilterSelect,items:{path:"/items",template:new sap.m.StandardListItem({title:"{name}",selected:"{selected}"})}}),leftButton:new sap.m.Button({text:oSapSplUtils.getBundle().getText("OK_BUTTON_TEXT"),press:function(){t.oSapSplNotificationDialogForFilters.close();}}),rightButton:new sap.m.Button({text:oSapSplUtils.getBundle().getText("MY_COLLEAGUES_CANCEL_BUTTON"),press:function(){t.oSapSplNotificationDialogForFilters.close();}})}).addStyleClass("SapSplFilterDialog").attachAfterClose(function(e){if(e.getParameters("origin").origin.getText()!==oSapSplUtils.getBundle().getText("MY_COLLEAGUES_CANCEL_BUTTON")){jQuery.proxy(t.handleSelectOfFilter(e.getSource().getContent()[0].getSelectedItems()),t);}}).attachBeforeOpen(function(){oSapSplUtils.fnSyncStyleClass(t.oSapSplNotificationDialogForFilters);}).attachAfterClose(function(){t.getView().byId("sapSplMaintenanceNotifierMasterSearch").focus();});this.oSapSplNotificationDialogForFilters.setModel(new sap.ui.model.json.JSONModel({items:this.statusData}));},fnHandleFilterSelect:function(e){var l=$.extend(true,[],e.getSource().getModel().getData().items),i,f=1;if(e.getParameters().listItem.getBindingContext().getProperty().id==="all"){for(i=0;i<l.length;i++){if(e.getParameters().listItem.getBindingContext().getProperty().selected){e.getSource().getItems()[i].setSelected(true);}else{e.getSource().getItems()[i].setSelected(false);}}}else{if(!e.getParameters().listItem.getBindingContext().getProperty().selected){if(l[0].selected){e.getSource().getItems()[0].setSelected(false);}}else{for(i=1;i<l.length;i++){if(!e.getSource().getItems()[i].getSelected()){f=0;break;}}if(f){e.getSource().getItems()[0].setSelected(true);}else{e.getSource().getItems()[0].setSelected(false);}}}},handleSelectOfFilter:function(i){var s=null,S=null;var f=[],a,b="";f.push(this.oSapSplNotificationFilterIsNotification);try{if(this.byId("SapSplMaintenanceNotifierList")){s=this.byId("SapSplMaintenanceNotifierList");S=s.getBinding("items");if(S){S.filter([]);}else{throw new Error();}}else{throw new Error();}for(a=0;a<i.length;a++){if(i[a].getBindingContext().getProperty("id")==="all"){this.byId("FilterStatusText").setText(oSapSplUtils.getBundle().getText("FILTER_LABEL_ALL"));break;}else{if(i[a].getBindingContext().getProperty("id")==="dbupgrade"){if(this.oSapSplNotificationFilterDBUpgrade){f.push(this.oSapSplNotificationFilterDBUpgrade);if(b.length!==0){b=b+", "+oSapSplUtils.getBundle().getText("FILTER_LABEL_DB_UPGRADE");}else{b=oSapSplUtils.getBundle().getText("FILTER_LABEL_DB_UPGRADE");}}else{throw new Error();}}else if(i[a].getBindingContext().getProperty("id")==="criticalhotfix"){if(this.oSapSplNotificationFilterCriticalHotfix){f.push(this.oSapSplNotificationFilterCriticalHotfix);if(b.length!==0){b=b+", "+oSapSplUtils.getBundle().getText("FILTER_LABEL_CRITICAL_HOTFIX");}else{b=oSapSplUtils.getBundle().getText("FILTER_LABEL_CRITICAL_HOTFIX");}}else{throw new Error();}}else if(i[a].getBindingContext().getProperty("id")==="patch"){if(this.oSapSplNotificationFilterPatch){f.push(this.oSapSplNotificationFilterPatch);if(b.length!==0){b=b+", "+oSapSplUtils.getBundle().getText("FILTER_LABEL_PATCH");}else{b=oSapSplUtils.getBundle().getText("FILTER_LABEL_PATCH");}}else{throw new Error();}}else if(i[a].getBindingContext().getProperty("id")==="osupgrade"){if(this.oSapSplNotificationFilterDBUpgrade){f.push(this.oSapSplNotificationFilterOSUpgrade);if(b.length!==0){b=b+", "+oSapSplUtils.getBundle().getText("FILTER_LABEL_OS_UPGRADE");}else{b=oSapSplUtils.getBundle().getText("FILTER_LABEL_OS_UPGRADE");}}else{throw new Error();}}this.byId("FilterStatusText").setText(b);}}S.filter(f);this.appliedFilters=S.aFilters;}catch(e){if(e instanceof Error){jQuery.sap.log.error(e.message,"undefined",this.getView().getControllerName());}}},preparePopOverForSorters:function(){var s=null;this.oSapSplNotificationPopOverForSorters=new sap.m.Popover({placement:sap.m.PlacementType.Top,showHeader:false});s=new sap.ui.commons.layout.VerticalLayout().addStyleClass("sapsplTruckMasterPopover");s.addContent(new sap.m.RadioButton({id:"none"}).setText(oSapSplUtils.getBundle().getText("FILTER_LABEL_NONE")).attachSelect(jQuery.proxy(this.handleSelectOfSorterRadioButton,this)));s.addContent(new sap.m.RadioButton({id:"state",selected:true}).setText(oSapSplUtils.getBundle().getText("SORT_LABEL_STATE_TYPE")).attachSelect(jQuery.proxy(this.handleSelectOfSorterRadioButton,this)));this.oSapSplNotificationPopOverForSorters.addContent(s);},handleSelectOfSorterRadioButton:function(E){var e=jQuery.extend(true,{},E);var t=this;if(E.getParameter("selected")){if(this.getView().getParent().getParent().getCurrentDetailPage().sId==="MaintenanceNotifierDetail"){sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(this.getEmptyAddNotificationData("nodata"));}if(oSapSplUtils.getIsDirty()){sap.m.MessageBox.show(oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),sap.m.MessageBox.Icon.WARNING,oSapSplUtils.getBundle().getText("WARNING"),[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.CANCEL],function(s){if(s==="YES"){oSapSplUtils.setIsDirty(false);t.sortMasterListBasedOnSortTypeSelection(e);}},null,oSapSplUtils.fnSyncStyleClass("messageBox"));}else{this.sortMasterListBasedOnSortTypeSelection(e);}}},sortMasterListBasedOnSortTypeSelection:function(e){var s=null,i="",S=null,a=[];try{if(this.oSapSplNotificationPopOverForSorters){this.oSapSplNotificationPopOverForSorters.close();}else{throw new Error();}i=e.getSource().sId;if(this.byId("SapSplMaintenanceNotifierList")){s=this.byId("SapSplMaintenanceNotifierList");S=s.getBinding("items");a=S.aFilters;this.byId("SapSplMaintenanceNotifierList").unbindAggregation("items");this.byId("SapSplMaintenanceNotifierList").bindItems({path:"/MyFeed",template:this.byId("oSapSplNotificationListItem")});S=this.byId("SapSplMaintenanceNotifierList").getBinding("items");if(!S){throw new Error();}}else{throw new Error();}if(i==="state"){if(this.oSapSplNotificationSorter){S.sort([this.oSapSplNotificationSorter]);S.filter(a);}else{throw new Error();}}else{S.filter(a);this.oSapSplNotificationDialogForFilters.getModel().setData({items:this.statusData});}this.appliedSorters=S.aSorters;}catch(b){if(b instanceof Error){jQuery.sap.log.error(b.message,"undefined",this.getView().getControllerName());}}},getEmptyAddNotificationData:function(m){var e={};e.Validity_StartTime=new Date();e.Validity_EndTime=new Date();e.Validity_StartTime1=new Date();e.Validity_EndTime1=new Date();e.Text1="";if(m&&m==="create"){e["noData"]=false;e["isClicked"]=true;e["showFooterButtons"]=true;}else{e["noData"]=true;e["isClicked"]=false;e["showFooterButtons"]=false;}return e;},fnHandleSortNotification:function(e){try{if(this.oSapSplNotificationPopOverForSorters){this.oSapSplNotificationPopOverForSorters.openBy(e.getSource());}else{throw new Error();}}catch(a){if(a instanceof Error){jQuery.sap.log.error(a.message,"Sort Popover not defined",this.getView().getControllerName());}}},ODataModelRequestCompleted:function(){if(arguments[0].getParameters().success){oSapSplBusyDialog.getBusyDialogInstance().close();this.onAfterListRendering();}else{oSapSplBusyDialog.getBusyDialogInstance().close();var e={};e["isClicked"]=false;e["noData"]=true;e["showFooterButtons"]=false;if(sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel")){sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(e);}}},onAfterListRendering:function(){oSapSplBusyDialog.getBusyDialogInstance().close();var s=[];var l=(this.byId("SapSplMaintenanceNotifierList").getCustomData().length>0)?this.byId("SapSplMaintenanceNotifierList").getCustomData()[this.byId("SapSplMaintenanceNotifierList").getCustomData().length-1].getKey():null,_=1;try{if(this.byId("SapSplMaintenanceNotifierList")){s=this.byId("SapSplMaintenanceNotifierList").getItems();if(s.length){this.byId("sapSplMaintenanceNotifierMasterPage").setTitle(oSapSplUtils.getBundle().getText("NOTIFICATION_TITLE",[splReusable.libs.Utils.prototype.getListCount(this.byId("SapSplMaintenanceNotifierList"))]));if(l!==null){for(var c=0;c<s.length;c++){if(s[c].constructor!==sap.m.GroupHeaderListItem){if(l===s[c].getBindingContext().getProperty("MessageUUID")){_=c;break;}}}}}if(s.length>0){this.selectFirstItem(_);if(sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel")){var m=sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").getData();m["noData"]=false;m["isClicked"]=true;m["showFooterButtons"]=true;sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(m);}}}else{throw new Error();}}catch(e){if(e instanceof Error){jQuery.sap.log.error(e.message,"Notification not defined",this.getView().getControllerName());}}this.getView().byId("sapSplMaintenanceNotifierMasterSearch").focus();},selectFirstItem:function(c){var s=null,n=null,N=[],a;try{n=this.getView().byId("SapSplMaintenanceNotifierList");N=n.getItems();a=N[c].getId();if(N.length>0){if(c===1&&N[0]instanceof sap.m.ObjectListItem){N[0].setSelected(true);s=N[0].getBindingContext().getProperty();}else{N[c].setSelected(true);s=N[c].getBindingContext().getProperty();var p=0;for(var l=1;l<N.length;l++){if(N[l]instanceof sap.m.GroupHeaderListItem){N[p].setCount(l-1-p);p=l;}}if(N[p].constructor===sap.m.GroupHeaderListItem){N[p].setCount(N.length-1-p);}window.setTimeout(function(){N[0].rerender();},100);window.setTimeout(function(){N[p].rerender();},100);if(c===0||c===1){document.getElementById(this.getView().byId("sapSplMaintenanceNotifierMasterSearch").getId()).scrollIntoView(true);}else{window.setTimeout(function(){if(document.getElementById(a)){document.getElementById(a).scrollIntoView(true);}},100);}}}else{throw new Error();}this.updateNotificationDetailPage(s);}catch(e){if(e instanceof Error){jQuery.sap.log.error(e.message,"Cannot select first item of MyNotificationsList",this.getView().getControllerName());}}},fnHandleSelectOfMaintenanceNotification:function(E){var t=this,i;var e=jQuery.extend(true,{},E);if(oSapSplUtils.getIsDirty()){sap.m.MessageBox.show(oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),sap.m.MessageBox.Icon.WARNING,oSapSplUtils.getBundle().getText("WARNING"),[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.CANCEL],function(s){if(s==="YES"){t.updateNotificationDetailPage(e.getParameter("listItem").getBindingContext().getProperty());oSapSplUtils.setIsDirty(false);}else{var c=sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").getData().data;if(!c){c=sap.ui.getCore().getModel("SapSplMaintenanceNotifierAddNotificationModel").getData();}var m=t.byId("SapSplMaintenanceNotifierList");m.removeSelections();if(c.MessageUUID){for(i=0;i<m.getItems().length;i++){if(m.getItems()[i].sId.indexOf("oSapSplNotificationListItem")!==-1){if(m.getItems()[i].getBindingContext().getProperty().MessageUUID===c.MessageUUID){m.setSelectedItem(m.getItems()[i]);break;}}}}else{m.removeSelections();}}},null,oSapSplUtils.fnSyncStyleClass("messageBox"));}else{t.updateNotificationDetailPage(E.getParameter("listItem").getBindingContext().getProperty());}},updateNotificationDetailPage:function(s){try{s["isClicked"]=true;s["noData"]=false;s["showFooterButtons"]=true;var v={context:$.extend(true,{},s)};if(this.getView().getParent().getParent()){if(this.getView().getParent().getParent().getCurrentDetailPage().sId==="MaintenanceNotifierDetail"){sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(s);}else{this.getView().getParent().getParent().toDetail("MaintenanceNotifierDetail","",v);}}else{throw new Error();}}catch(e){if(e instanceof Error){jQuery.sap.log.error(e.message,"There is no current Detail Page in Notification SplitApp.",this.getView().getControllerName());}}},fnHandleFilterNotification:function(){var t=this;if(oSapSplUtils.getIsDirty()){sap.m.MessageBox.show(oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),sap.m.MessageBox.Icon.WARNING,oSapSplUtils.getBundle().getText("WARNING"),[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.CANCEL],function(s){if(s==="YES"){oSapSplUtils.setIsDirty(false);try{if(t.oSapSplNotificationDialogForFilters){t.oSapSplNotificationDialogForFilters.open();}else{throw new Error();}}catch(e){if(e instanceof Error){jQuery.sap.log.error(e.message,"Filter Dialog not defined",t.getView().getControllerName());}}}},null,oSapSplUtils.fnSyncStyleClass("messageBox"));}else{try{if(this.oSapSplNotificationDialogForFilters){this.oSapSplNotificationDialogForFilters.open();}else{throw new Error();}}catch(e){if(e instanceof Error){jQuery.sap.log.error(e.message,"Filter Dialog not defined",this.getView().getControllerName());}}}},fnToHandleSearchOfNotications:function(e){var s=e.getParameters().query;var S;var p,t=this,m;oSapSplUtils.setIsDirty(false);S=this.getView().byId("SapSplMaintenanceNotifierList");if(s.length>2){p=t.prepareSearchPayload(s);t.callSearchService(p);}else if(S.getBinding("items")===undefined||S.getBinding("items").aFilters.length>0||e.getParameters().refreshButtonPressed===true){sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(t.getEmptyAddNotificationData("nodata"));S.unbindAggregation("items");S.bindItems({path:"/MyFeed",template:t.getView().byId("oSapSplNotificationListItem")});S.getBinding("items").filter(this.appliedFilters);S.getBinding("items").sort(this.appliedSorters);m=sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").getData();m["noData"]=true;m["isClicked"]=false;m["showFooterButtons"]=false;sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(m);}},prepareSearchPayload:function(s){var p={};p.ObjectType=["Message"];p.SearchTerm=s;p.FuzzinessThershold=SapSplEnums.fuzzyThreshold;p.MaximumNumberOfRecords=SapSplEnums.numberOfRecords;p.ProvideDetails=true;p.SearchInNetwork=false;p.AdditionalCriteria={};p.AdditionalCriteria.MessageObjectType="M";p.AdditionalCriteria.isNotification="1";return p;},callSearchService:function(p){var s,S=[],o;var t=this,m,i;oSapSplAjaxFactory.fireAjaxCall({url:oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/Search.xsjs"),method:"POST",async:false,data:JSON.stringify(p),success:function(d,a,b){oSapSplBusyDialog.getBusyDialogInstance().close();if(d.constructor===String){d=JSON.parse(d);}if(b["status"]===200){o=t.getView().byId("SapSplMaintenanceNotifierList");sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(t.getEmptyAddNotificationData("nodata"));o.unbindAggregation("items");if(d.length>0){s=oSapSplUtils.getSearchItemFilters(d,"MessageUUID");if(s.aFilters.length>0){S.push(s);}for(i=0;i<t.appliedFilters.length;i++){S.push(t.appliedFilters[i]);}o.bindItems({path:"/MyFeed",template:t.getView().byId("oSapSplNotificationListItem")});o.getBinding("items").filter(S);o.getBinding("items").sort(t.appliedSorters);m=sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").getData();m["noData"]=false;m["isClicked"]=true;m["showFooterButtons"]=false;sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(m);}else{m=sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").getData();m["noData"]=true;m["isClicked"]=false;m["showFooterButtons"]=false;sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(m);t.byId("sapSplMaintenanceNotifierMasterPage").setTitle(oSapSplUtils.getBundle().getText("NOTIFICATION_TITLE","0"));}}else if(d["Error"]&&d["Error"].length>0){var e=oSapSplUtils.getErrorMessagesfromErrorPayload(d)["ufErrorObject"];sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:oSapSplUtils.getErrorMessagesfromErrorPayload(d)["errorWarningString"],details:e});}},error:function(e){oSapSplBusyDialog.getBusyDialogInstance().close();m=sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").getData();m["noData"]=true;m["isClicked"]=false;m["showFooterButtons"]=false;sap.ui.getCore().getModel("SapSplMaintenanceNotifierDetailModel").setData(m);if(e&&e["status"]===500){sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:e["status"]+"\t"+e.statusText,details:e.responseText});}else{sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(e.responseText))["errorWarningString"],details:oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(e.responseText))["ufErrorObject"]});}},complete:function(){}});},onAfterRendering:function(){this.getView().byId("sapSplMaintenanceNotifierMasterSearch").focus();}});
