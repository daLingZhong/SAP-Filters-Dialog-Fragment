sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/core/UIComponent",
    'sap/m/MessageToast'
    ],

    function (Controller, ODataModel, JSONModel, Sorter, Filter, UIComponent,MessageToast) {
        "use strict";

        return Controller.extend("webapp.controller.Table", {

            // -------------------------------
            // Initialization event
            // -------------------------------
            onInit: function () {
                // Application model
                var sServiceUrl = "https://cors-anywhere.herokuapp.com/"
                    + "http://services.odata.org/V3/Northwind/Northwind.svc/";
                    //从odata官方提供的API中获取到数据，服务器名为northwind
                var oModel = new ODataModel(sServiceUrl);
                oModel.setUseBatch(false);

                this.getView().setModel(oModel);
            },
            
	        onListPress: function(event) {
	    		 var oRouter = UIComponent.getRouterFor(this);
	    		 var oItem = event.getSource();
	    		 var sPath = oItem.getBindingContext();
	    		 //MessageToast.show(sPath);
	    		 oRouter.navTo("Page", {
	    			 SuppliersPath: encodeURIComponent(sPath)
	    		});
        	},
        	
            // ---------------------------------------------
            // 设置 Table 的 排序，分组和筛选
            // 由于分组和筛选都是改变了下面表格的格局，所以我们要新建立一个数组去储存结果集
            // ---------------------------------------------
            onTableSettings: function () {
                var oDialog = this.getView().byId("SettingsDialog");
                //这个id不代表标签ID，代表的是fragment的名称
                if (!oDialog) {
                    oDialog = sap.ui.xmlfragment("webapp.view.SettingsDialog", this);
                }
				//声明路径
                oDialog.open();
            },

            onConfirm: function (oEvent) {//fragment中的方法
                var oBinding = this.getView().byId("idTable").getBinding("items");//获取需要排序的整个table的列表items绑定值
                var mParams = oEvent.getParameters();//获取点击事件中的值，用if判断点击按钮所提供的类型

                // Apply grouping分组
                var aSorters = [];
                if (mParams.groupItem) {
                    var sGroupKey = mParams.groupItem.getKey();//key详见fragment的标签中，代表了排序所遵循的标准
                    var bDescending = mParams.groupDescending;

                    aSorters.push(new Sorter(sGroupKey, bDescending, true));
                }

                // Apply sorter排序
                if (mParams.sortItem) {
                    var sSortKey = mParams.sortItem.getKey();
                    
                    aSorters.push(new Sorter(sSortKey, bDescending)); //由于js特性，所以var声明后的变量相当于全局变量，在这里不需要再次声明bDescending
                }
                oBinding.sort(aSorters);

                // Apply filters筛选
                var aFilters = [];
                if (mParams.filterItems) {
                    var count = mParams.filterItems.length;//遍历筛选过后的数组长度
                    for (var i = 0; i < count; i++) {
                        var oFilterItem = mParams.filterItems[i];
                        var oFilter = new Filter(oFilterItem.getKey(),
                            sap.ui.model.FilterOperator.EQ, oFilterItem.getText());

                        aFilters.push(oFilter);
                    }
                }
                oBinding.filter(aFilters);
            } // end of onConfirm
        });
    });