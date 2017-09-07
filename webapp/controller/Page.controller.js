sap.ui.define([
		'jquery.sap.global',
		'sap/ui/core/mvc/Controller',
		    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
		"sap/ui/core/UIComponent",
		"sap/ui/core/routing/History",
		'sap/m/MessageToast'
	], function(jQuery, Controller , ODataModel, JSONModel, UIComponent ,History,MessageToast) {
	"use strict";
    
	Controller.extend("webapp.controller.Page", {
 
		onInit: function () {
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.getRoute("Page").attachPatternMatched(this._onObjectMatched, this);	
				                // Application model
                var sServiceUrl = "https://cors-anywhere.herokuapp.com/"//代理服务器，需要遵循了Same-origin 策略
                    + "http://services.odata.org/V3/Northwind/Northwind.svc/";
                    //从odata官方提供的API中获取到数据，服务器名为northwind
                var oModel = new ODataModel(sServiceUrl);
                oModel.setUseBatch(false);

                this.getView().setModel(oModel);
		},
		
		onNavPress: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			
			if (sPreviousHash !== undefined){
				window.history.go(-1);
			}else{
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("Table",{}, true);
			}
		},
		_onObjectMatched: function (event) {			
				var sPath = decodeURIComponent(
						event.getParameter("arguments").SuppliersPath);
						
				this.getView().bindElement({path: sPath});
		}
		
	});
 
 
	return Controller;
 
});