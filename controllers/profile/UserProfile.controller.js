/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("splReusable.libs.SapSplAppErrorHandler");sap.ui.controller("splController.profile.UserProfile",{oUserProfileModel:{},oUserDetails:{},onInit:function(e){function f(i){var s=new sap.ui.model.json.JSONModel();oSapSplAjaxFactory.fireAjaxCall({url:oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/appl.xsodata/MyThemePreference?$format=json"),method:"GET",async:true,success:function(d){s.setData(d.d.results);i.getView().byId("sapSclThemeGridLayout").setModel(s);},error:function(E){$.sap.log.error("Error: "+E.toString(),"Failure of theme preference list fetch","SAPSCL");}});}f(this);splReusable.libs.SapSplStyleSheetLoader.loadStyle("./resources/styles/sapSplProfile");this.byId("sapSclFollowTrucksTableHeaderText").setText(oSapSplUtils.getBundle().getText("MY_VEHICLES_MASTER_TITLE",[0]));},loadStyleSheet:function(){},onBeforeRendering:function(){},goBackToCaller:function(g){oSplBaseApplication.getAppInstance().back({goBackWithData:g});},onAfterRendering:function(){},onBeforeShow:function(){},handleDeleteOfAccountAction:function(){function _(){oSapSplUtils.sLO4S="app";oSapSplUtils.getStorageInstance("local").put("src",2);window.location.href=SapSplEnums.REDIRPATH;}function a(){var d={"inputHasChangeMode":true,"Header":[{"UUID":sap.ui.getCore().getModel("loggedOnUserModel").getData()["profile"]["UUID"],"BasicInfo.Type":"P","ChangeMode":"D"}]};oSapSplAjaxFactory.fireAjaxCall({url:oSapSplUtils.getServiceMetadata("bupa",true),method:"POST",data:JSON.stringify(d),timeout:60000,beforeSend:function(x){x.setRequestHeader("Content-Type","application/json;charset:utf-8");x.setRequestHeader("X-CSRF-Token",oSapSplUtils.getCSRFToken());},success:function(){sap.m.MessageToast.show(oSapSplUtils.getBundle().getText("USER_PROFILE_UPDATE_SUCCESSFUL"),{duration:2000,onClose:function(){_();}});},error:function(x,t){if(t==="timeout"){sap.m.MessageBox.show(oSapSplUtils.getBundle().getText("SERVICE_TIMEOUT_ERROR"),{icon:sap.m.MessageBox.Icon.ERROR,title:oSapSplUtils.getBundle().getText("ERROR_MESSAGE_HANDLING_TITLE"),actions:[],onClose:function(){jQuery.sap.log.error("SPL User Profile","Profile update failed","SAPSCL");}},null,oSapSplUtils.fnSyncStyleClass("messageBox"));}else{oSapSplAppErrorHandler.show(x,true,null,function(D){jQuery.sap.log.info("SAP Connected Logistics","Dialog close Event fired "+D.m,"SAPSCL");jQuery.sap.log.error("SPL User Profile","Profile update failed.","SAPSCL");});}}});}sap.m.MessageBox.show(oSapSplUtils.getBundle().getText("PROMPT_FOR_DELETION_OF_USER_ACCOUNT",[SapSplEnums.APPNAME]),{icon:sap.m.MessageBox.Icon.WARNING,title:"{splI18NModel>PROMPT_FOR_DELETION_DIALOG_TITLE}",actions:[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],onClose:function(A){if(A===sap.m.MessageBox.Action.NO){return;}else{a();}}});},updateBindings:function(e){oSapSplUtils.showHeaderButton({showButton:true,sNavToPage:"splView.tileContainer.MasterTileContainer",navIcon:"sap-icon://home"});function _(e,i){this.oUserDetails=e.data.cDetails;i.oUserProfileModel.setData(this.oUserDetails);i.byId("userProfilePage").setModel(i.oUserProfileModel);if(i.getView().byId("sapSclThemeGridLayout")&&i.getView().byId("sapSclThemeGridLayout").getBinding("content")){i.getView().byId("sapSclThemeGridLayout").getBinding("content").filter(new sap.ui.model.Filter("Value",sap.ui.model.FilterOperator.EQ,(oSapSplUtils.getLoggedOnUserDetails()["profile"]["Theme"]||"sap_bluecrystal")));}}function a(e,i){if(e.backData&&e.backData.goBackWithData===1){oSapSplAjaxFactory.fireAjaxCall({url:oSapSplUtils.getServiceMetadata(SapSplEnums.RootApp,true)+"/MyUsers/?$filter=(isMyself eq 1)&$format=json",method:"GET",success:function(r){oSapSplUtils.setLoggedOnUserDetails({profile:r.d.results[0]});var m=new sap.ui.model.json.JSONModel();m.setData(r.d.results[0]);i.byId("userProfilePage").setModel(m);},error:function(x){sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:oSapSplUtils.getBundle().getText("GENERIC_ERROR_MESSAGE"),details:oSapSplUtils.getErrorMessagesfromErrorPayload(x.responseText)},function(){});}});}}if(!this.oUserProfileModel.hasOwnProperty("setData")){this.oUserProfileModel=new sap.ui.model.json.JSONModel();}if(e.data&&!e.backData.hasOwnProperty("goBackWithData")){_(e,this);}else{a(e,this);}},handleProfileBackNavigation:function(){oSplBaseApplication.getAppInstance().back();},handleProfileEditActionEvent:function(){if(this.byId("sapSclProfileAndSettingIconTabBar").getSelectedKey()==="sapSclIconTabFilternotifications"){this.getView().byId("sapSclThemeGridLayout").removeStyleClass("sapSplThemePreferenceLayout");this.getView().byId("sapSclThemeGridLayout").getBinding("content").filter([]);this.byId("btnEditUserProfile").setVisible(false);this.byId("sapSclFollowTrucksSaveButton").setVisible(true);this.byId("sapSclFollowTrucksCancelButton").setVisible(true);}else if(this.byId("sapSclProfileAndSettingIconTabBar").getSelectedKey()==="sapSclIconTabFilterFollowTrucks"){this.byId("sapSplFollowTrucksSubscribeCheckBox").setVisible(true);this.byId("sapSplFollowTrucksSubscribeText").setVisible(false);this.byId("btnEditUserProfile").setVisible(false);this.byId("sapSclFollowTrucksSaveButton").setVisible(true);this.byId("sapSclFollowTrucksCancelButton").setVisible(true);if($(".sapSclFollowTrucksColumnListItems")&&$(".sapSclFollowTrucksColumnListItems").not(".SapSplTrucksListDisabled").length>0){($(".sapSclFollowTrucksColumnListItems").not(".SapSplTrucksListDisabled"))[0].focus();}}else{if(!oSplBaseApplication.getAppInstance().getPage("splView.profile.EditUserProfile")){var e=sap.ui.view({viewName:"splView.profile.EditUserProfile",id:"splView.profile.EditUserProfile",type:sap.ui.core.mvc.ViewType.XML});e.addEventDelegate({onBeforeShow:function(E){this.oPayloadObject.Header=[];this.getData(E);}},e.getController());oSplBaseApplication.getAppInstance().addPage(e);}oSplBaseApplication.getAppInstance().to("splView.profile.EditUserProfile",{cDetails:sap.ui.getCore().getModel("loggedOnUserModel").getData()["profile"]});}},fnHandleFollowTrucksViewSettingDialog:function(e){if(!this.oFollowTrucksViewSettingDialog){this.oFollowTrucksViewSettingDialog=sap.ui.xmlfragment("splView.profile.FollowTrucksViewSettingDialog",this);}oSapSplUtils.fnSyncStyleClass(this.oFollowTrucksViewSettingDialog);this.oFollowTrucksViewSettingDialog.open();if(e.getSource().getId().indexOf("sapSclFollowTrucksFilter")>-1){this.oFollowTrucksViewSettingDialog._getFilterButton().firePress();}else{this.oFollowTrucksViewSettingDialog._getGroupButton("group");}},fnHandleSelectOfIconTabFilter:function(e){if(e.getParameters().selectedKey==="sapSclIconTabFilternotifications"){this.getView().byId("sapSclThemeGridLayout").addStyleClass("sapSplThemePreferenceLayout");this.byId("btnEditUserProfile").setVisible(splReusable.libs.SapSplModelFormatters.showEditable(sap.ui.getCore().getModel("loggedOnUserModel").getData().profile.isEditable));this.byId("sapSclFollowTrucksSaveButton").setVisible(false);this.byId("sapSclFollowTrucksCancelButton").setVisible(false);this.getView().byId("sapSclThemeGridLayout").getBinding("content").filter(new sap.ui.model.Filter("Value",sap.ui.model.FilterOperator.EQ,(oSapSplUtils.getLoggedOnUserDetails()["profile"]["Theme"]||"sap_bluecrystal")));}else if(e.getParameters().selectedKey==="sapSclIconTabFilterFollowTrucks"){if(!sap.ui.getCore().getModel("SapSclFollowTrucksOataModel")){var s=new splModels.odata.ODataModel({url:oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/appl.xsodata/"),json:true,headers:{"Cache-Control":"max-age=0"},tokenHandling:true,withCredentials:false,loadMetadataAsync:true,handleTimeOut:true,numberOfSecondsBeforeTimeOut:10000});s.attachRequestCompleted(jQuery.proxy(this.ODataModelRequestCompleted,this));sap.ui.getCore().setModel(s,"SapSclFollowTrucksOataModel");this.getView().byId("sapSplFollowTrucksTab").setModel(sap.ui.getCore().getModel("SapSclFollowTrucksOataModel"));this.oSapSplVehiclesFilterIsValidTruck=new sap.ui.model.Filter("isDeleted",sap.ui.model.FilterOperator.EQ,"0");this.mGroupFunctions={isSharedWithMyOrg:function(c){var i=c.getProperty("isSharedWithMyOrg");if(i===1){return{key:i,text:oSapSplUtils.getBundle().getText("SHARED")};}else{return{key:i,text:oSapSplUtils.getBundle().getText("OWNED")};}},isSubscribed:function(c){var i=c.getProperty("isSubscribed");if(i==="1"){return{key:i,text:oSapSplUtils.getBundle().getText("TRUCKS_SUBSCRIBED")};}else{return{key:i,text:oSapSplUtils.getBundle().getText("TRUCKS_NOT_SUBSCRIBED")};}}};this.aSubscribeTruckList=[];this.aSubscribeTruckRegNoList=[];this.SapSplSearchFilters=[];this.getView().byId("sapSplFollowTrucksTab").getBinding("items").filter([this.oSapSplVehiclesFilterIsValidTruck]);this.aAppliedFilters=this.getView().byId("sapSplFollowTrucksTab").getBinding("items").aFilters;this.aAppliedSorters=this.getView().byId("sapSplFollowTrucksTab").getBinding("items").aSorters;}else{sap.ui.getCore().getModel("SapSclFollowTrucksOataModel").refresh();this.byId("sapSplFollowTrucksSubscribeCheckBox").setVisible(false);this.byId("sapSplFollowTrucksSubscribeText").setVisible(true);this.byId("btnEditUserProfile").setVisible(splReusable.libs.SapSplModelFormatters.showEditable(sap.ui.getCore().getModel("loggedOnUserModel").getData().profile.isEditable));this.byId("sapSclFollowTrucksSaveButton").setVisible(false);this.byId("sapSclFollowTrucksCancelButton").setVisible(false);}this.byId("sapSclFollowTrucksSearchField").focus();}else{this.byId("sapSclFollowTrucksSaveButton").setVisible(false);this.byId("sapSclFollowTrucksCancelButton").setVisible(false);this.byId("btnEditUserProfile").setVisible(true);}},ODataModelRequestCompleted:function(e){if(e.mParameters.success){this.byId("sapSclFollowTrucksTableHeaderText").setText(oSapSplUtils.getBundle().getText("MY_VEHICLES_MASTER_TITLE",[splReusable.libs.Utils.prototype.getListCount(this.byId("sapSplFollowTrucksTab"))]));}if(e.mParameters.errorobject){if(e.mParameters.errorobject.message===SapSplEnums.REQUEST_ABORTED){this.getView().byId("sapSplFollowTrucksTab").setBusy(false);}}},fnHandleConfirmOfViewSettingDialog:function(e){var t=this.getView().byId("sapSplFollowTrucksTab");var p=e.getParameters();var b=t.getBinding("items");var s=[];var g;if(p.groupItem){var P=p.groupItem.getKey();var d=p.groupDescending;g=this.mGroupFunctions[P];s.push(new sap.ui.model.Sorter(P,d,g));}if(s.length>0){b.sort(s);}var f=[];jQuery.each(p.filterItems,function(i,I){var S=I.getKey().split("_");var P=S[0];var v=S[1];f.push(new sap.ui.model.Filter(P,sap.ui.model.FilterOperator.EQ,v));if(S[2]){var a=S[2];var V=S[3];f.push(new sap.ui.model.Filter(a,sap.ui.model.FilterOperator.EQ,V));}});if(f.length===0){f.push(new sap.ui.model.Filter("isDeleted",sap.ui.model.FilterOperator.EQ,"0"));}this.aAppliedFilters=$.extend(true,[],f);if(this.SapSplSearchFilters.length!==0){f.push(this.SapSplSearchFilters);}b.filter(f);this.aAppliedSorters=b.aSorters;},fnHandleUserPreferenceSaveButton:function(){var p={};if(this.byId("sapSclProfileAndSettingIconTabBar").getSelectedKey()==="sapSclIconTabFilternotifications"){this.byId("btnEditUserProfile").setVisible(true);this.byId("sapSclFollowTrucksSaveButton").setVisible(false);this.byId("sapSclFollowTrucksCancelButton").setVisible(false);if(this.selectedThemeFromProfile){oSapSplUserPreference.saveTheme(this.selectedThemeFromProfile);}}else if(this.byId("sapSclProfileAndSettingIconTabBar").getSelectedKey()==="sapSclIconTabFilterFollowTrucks"){p.VehicleSubscription=[];p.VehicleSubscription=this.preparePayload();p.inputHasChangeMode=true;oSapSplBusyDialog.getBusyDialogInstance({title:oSapSplUtils.getBundle().getText("BUSY_DIALOG_MESSAGE")}).open();oSapSplAjaxFactory.fireAjaxCall({url:oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/personPreferences.xsjs"),method:"PUT",data:JSON.stringify(p),timeout:60000,beforeSend:function(x){x.setRequestHeader("Content-Type","application/json;charset:utf-8");x.setRequestHeader("X-CSRF-Token",oSapSplUtils.getCSRFToken());},success:function(d,s,m){oSapSplBusyDialog.getBusyDialogInstance().close();sap.m.MessageToast.show(oSapSplUtils.getBundle().getText("USER_PROFILE_UPDATE_SUCCESSFUL"));sap.ui.getCore().getModel("SapSclFollowTrucksOataModel").refresh();this.aSubscribeTruckList=[];this.aSubscribeTruckRegNoList=[];this.byId("sapSplFollowTrucksSubscribeCheckBox").setVisible(false);this.byId("sapSplFollowTrucksSubscribeText").setVisible(true);this.byId("btnEditUserProfile").setVisible(splReusable.libs.SapSplModelFormatters.showEditable(sap.ui.getCore().getModel("loggedOnUserModel").getData().profile.isEditable));this.byId("sapSclFollowTrucksSaveButton").setVisible(false);this.byId("sapSclFollowTrucksCancelButton").setVisible(false);oSapSplUtils.setIsDirty(false);}.bind(this),error:function(e){oSapSplBusyDialog.getBusyDialogInstance().close();if(e&&e["status"]===500){sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:e["status"]+"\t"+e.statusText,details:e.responseText});}else{sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(e.responseText))["errorWarningString"],details:oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(e.responseText))["ufErrorObject"]});}}});}},preparePayload:function(){var p=[],i,P={},r;for(i=0;i<this.aSubscribeTruckRegNoList.length;i++){r=this.aSubscribeTruckRegNoList[i];if(this.aSubscribeTruckList[r].isValid){P={};P.VehicleUUID=this.aSubscribeTruckList[r].UUID;P.isSubscribed=this.aSubscribeTruckList[r].isSubscribed;P.ChangeMode="U";p.push(P);}}return p;},fnHandleSelectOfTheme:function(e){if(this.byId("sapSclProfileAndSettingIconTabBar").getSelectedKey()==="sapSclIconTabFilternotifications"){this.fnToCaptureLiveChangeToSetFlag();this.selectedThemeFromProfile=e.getSource().getBindingContext().getObject().Value;}},fnHandleUserPreferenceCancelButton:function(){var t=this;if(oSapSplUtils.getIsDirty()){sap.m.MessageBox.show(oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),sap.m.MessageBox.Icon.WARNING,oSapSplUtils.getBundle().getText("WARNING"),[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.CANCEL],function(s){if(s==="YES"){jQuery.proxy(t.fnHandlePerformCancelAction(),t);}});}else{this.fnHandlePerformCancelAction();}},fnHandlePerformCancelAction:function(){if(this.byId("sapSclProfileAndSettingIconTabBar").getSelectedKey()==="sapSclIconTabFilternotifications"){this.getView().byId("sapSclThemeGridLayout").addStyleClass("sapSplThemePreferenceLayout");this.getView().byId("sapSclThemeGridLayout").getBinding("content").filter(new sap.ui.model.Filter("Value",sap.ui.model.FilterOperator.EQ,(oSapSplUtils.getLoggedOnUserDetails()["profile"]["Theme"]||"sap_bluecrystal")));}else if(this.byId("sapSclProfileAndSettingIconTabBar").getSelectedKey()==="sapSclIconTabFilterFollowTrucks"){this.byId("sapSplFollowTrucksSubscribeCheckBox").setVisible(false);this.byId("sapSplFollowTrucksSubscribeText").setVisible(true);sap.ui.getCore().getModel("SapSclFollowTrucksOataModel").refresh(true);}this.byId("btnEditUserProfile").setVisible(splReusable.libs.SapSplModelFormatters.showEditable(sap.ui.getCore().getModel("loggedOnUserModel").getData().profile.isEditable));this.byId("sapSclFollowTrucksSaveButton").setVisible(false);this.byId("sapSclFollowTrucksCancelButton").setVisible(false);oSapSplUtils.setIsDirty(false);},fnHandleSelectOfCheckBox:function(e){var r=e.getSource().getBindingContext().getProperty().RegistrationNumber;var u=e.getSource().getBindingContext().getProperty().UUID;this.fnToCaptureLiveChangeToSetFlag();if(this.aSubscribeTruckList[r]){this.aSubscribeTruckList[r].isSubscribed=e.getParameters().selected?"1":"0";this.aSubscribeTruckList[r].isValid=this.aSubscribeTruckList[r].isValid?false:true;}else{this.aSubscribeTruckList[r]={};this.aSubscribeTruckList[r].UUID=u;this.aSubscribeTruckList[r].isSubscribed=e.getParameters().selected?"1":"0";this.aSubscribeTruckList[r].isValid=true;this.aSubscribeTruckRegNoList.push(r);}},fnToCaptureLiveChangeToSetFlag:function(){if(!oSapSplUtils.getIsDirty()){oSapSplUtils.setIsDirty(true);}},fnHandleRegistrationNumberLink:function(e){var t=this;var a=$.extend(true,{},e);if(oSapSplUtils.getIsDirty()){sap.m.MessageBox.show(oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),sap.m.MessageBox.Icon.WARNING,oSapSplUtils.getBundle().getText("WARNING"),[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.CANCEL],function(s){if(s==="YES"){jQuery.proxy(t.fnHandlePerformRegistrationLinkNavigation(a),t);}});}else{this.fnHandlePerformRegistrationLinkNavigation(a);}},fnHandlePerformRegistrationLinkNavigation:function(e){var n="splView.vehicles.VehicleMasterDetail";var N=null;this.fnHandlePerformCancelAction();if(!sap.ui.getCore().byId("sapSplBaseApplication").getPage(n)){N=sap.ui.view({viewName:n,id:n,type:sap.ui.core.mvc.ViewType.XML});N.addEventDelegate({onBeforeShow:jQuery.proxy(N.getController().onBeforeShow,N.getController())});sap.ui.getCore().byId("sapSplBaseApplication").addPage(N);}var o={};o["FromApp"]="profile";o["RegistrationNumber"]=e.getSource().getBindingContext().getProperty().RegistrationNumber;o["showBackButton"]=true;oSplBaseApplication.getAppInstance().to(n,"slide",o);},fnToHandleSearchOfFollowTrucks:function(e){var s=e.mParameters.query;var S;var p,t=this;S=this.getView().byId("sapSplFollowTrucksTab");if(s.length>2){p=this.prepareSearchPayload(s);this.callSearchService(p);}else if(S.getBinding("items")===undefined||S.getBinding("items").aFilters.length>1||e.mParameters.refreshButtonPressed===true){S.unbindAggregation("items");S.bindItems({path:"/MyTrackableObjects",template:t.getView().byId("sapSclFollowTrucksCloumnListItem")});S.getBinding("items").filter(this.aAppliedFilters);S.getBinding("items").sort(this.aAppliedSorters);this.SapSplSearchFilters=[];}},prepareSearchPayload:function(s){var p={};p.ObjectType="TrackableObject";p.SearchTerm=s;p.FuzzinessThershold=SapSplEnums.fuzzyThreshold;p.MaximumNumberOfRecords=SapSplEnums.numberOfRecords;p.AdditionalCriteria={};p.AdditionalCriteria.IncludeSharedVehicles=true;p.ProvideDetails=false;p.SearchInNetwork=true;return p;},callSearchService:function(p){var t=this;var u=oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/Search.xsjs");var a={url:u,data:JSON.stringify(p),contentType:"json; charset=UTF-8",async:false,beforeSend:function(r){r.setRequestHeader("X-CSRF-Token",oSapSplUtils.getCSRFToken());r.setRequestHeader("Cache-Control","max-age=0");},success:jQuery.proxy(t.onSuccess,t),error:jQuery.proxy(t.onError,t),method:"POST"};oSapSplAjaxFactory.fireAjaxCall(a);},onSuccess:function(d,s,m){var S,o=[],a,i,t=this,b;oSapSplBusyDialog.getBusyDialogInstance().close();a=this.getView().byId("sapSplFollowTrucksTab");b=this.getView().byId("sapSplFollowTrucksTab").getBinding("items");if(d.constructor===String){d=JSON.parse(d);}if(m["status"]===200){a.unbindAggregation("items");if(d.length>0){S=oSapSplUtils.getSearchItemFilters(d);this.SapSplSearchFilters=S;if(S.aFilters.length>0){o.push(S);}for(i=0;i<this.aAppliedFilters.length;i++){o.push(this.aAppliedFilters[i]);}a.bindItems({path:"/MyTrackableObjects",template:t.getView().byId("sapSclFollowTrucksCloumnListItem")});a.getBinding("items").filter(o);a.getBinding("items").sort(this.aAppliedSorters);}else{this.byId("sapSclFollowTrucksTableHeaderText").setText(oSapSplUtils.getBundle().getText("MY_VEHICLES_MASTER_TITLE",[0]));this.SapSplSearchFilters=[];}}else if(d["Error"]&&d["Error"].length>0){var e=oSapSplUtils.getErrorMessagesfromErrorPayload(d)["ufErrorObject"];sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:oSapSplUtils.getErrorMessagesfromErrorPayload(d)["errorWarningString"],details:e});}},onError:function(e){oSapSplBusyDialog.getBusyDialogInstance().close();if(e&&e["status"]===500){sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:e["status"]+"\t"+e.statusText,details:e.responseText});}else{sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(e.responseText))["errorWarningString"],details:oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(e.responseText))["ufErrorObject"]});}}});