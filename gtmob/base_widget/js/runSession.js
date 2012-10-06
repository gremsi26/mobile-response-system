$("#runPage").live("pageinit",function(event){
	var runList = $("#runList","#runPage");
	var testLI = $("<li>").append("A session");
	var testLI2 = $("<li>").append("Another Session");
	runList.append(testLI,testLI2);
	//runList.trigger("create");
	//testLI.trigger("create");
});