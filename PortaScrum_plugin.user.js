var plugin = (function($, doc){

    //global variables
    var protocol = doc.location.protocol + "//";
    var host = doc.location.host;
    var sprintListURL = protocol + host + "/sprints/list";
    // for cache service
    var cachedObj = new Array();

    //end of global variables
    var init = function(){
	initUI();
	initListener();
    };

    var initUI = function(){
	$('img[alt="Back"]').each(function(){
	    var backlogLink = $(this).parent();
	    $(backlogLink).before('<input type="button" value="copy"/>');
	});
    };

    var initListener = function(){
	$('input[value="copy"]').click(function(e){
            var story = $(e.target).parent().parent();     
            copy(story,null);
	});
    };

    //div id which contains the information of a story
    //copy the info inside a story, get ready for posting
    var copy = function(story, callback){

	var storyName = story.find('> h3').find(' > span[id^="story_description"]').text();
	var tasks = new Array();

	story.find('table').find('tr[class$="taskInProgress"], tr[class$="row_task"]').each(function(){
            var taskName = $(this).find('span').text().trim();
            var owner = $(this).find('td[class^="worker"]').text().trim();
            var estimate = $(this).find('td:last-child').text().trim();
            var task = {
		"taskName": taskName,
		"owner": owner,
		"estimate": estimate
            };
            tasks.push(task);
	});
	var storyData = constructData(storyName, tasks);
	postData(storyData);
    };

    //construct a data structure that will be passed to post data agaist next sprint
    var constructData = function(storyName, tasks){
	var story = {
            "storyName": storyName,
            "tasks": [],
            "estimate": 0
	};
	for(var i in tasks){
            var task = tasks[i];
            story.tasks.push({
		"task": task.taskName,
		"owner": task.owner,
		"estimate": task.estimate
            });
	}
	return story;
    }

    var postData = function(storyData){

	var targetURL;
	var result = hasNextSprint();
	if(result.hasNext){
	    //route to sprint list page, find the url of last sprint
	    targetURL = result.nextURL;
	} else {//TODO: probably popover a input dialogue to get new sprint name
	    targetURL = createNewSprint(sprintName);
	}

	$.ajax({
	    url: targetURL,
	    type: "GET",
	    success:function(html){//get next sprint page first and populate data for creating new story
		//prepare data for new story
		$(html).find('#add_story').find('textArea').val(storyData.storyName);
		$(html).find('#story_estimate').val(storyData.estimate);
		var sprintId = $(html).find('#story_sprint_id').val().trim();
		//create story
		var targetURL = protocol + host + "/stories/create";
		var data = {
		    "commit": "Add Story",
		    "story[description]": storyData.storyName,
		    "story[estimate]": storyData.estimate,
		    "story[sprint_id]": sprintId
		};
		//finish create story          
		$.post(targetURL,data, function(){
		    var newStoryLocation = $(html).find('#add_story').prevAll('div:first');
		    var taskStoryId = newStoryLocation.find('#task_story_id').val().trim();
		    targetURL = protocol + host + "/tasks/create";
		    for(var i in storyData.tasks){
			var task = storyData.tasks[i];
			// construct task data
			var taskData = {
			    "commit": "Add Task",
			    "task[estimate]": task.estimate,
			    "task[title]": task.task,
			    "task[story_id]": taskStoryId
			};
			
			$.post(targetURL, taskData);
		    }
		});
	    },
	    error: function(XMLHttpRequest, textStatus, errorThrown){
		console.log(textStatus);
		console.log(errorThrown);
	    }
	});
    };

    //verify if we have a new sprint to copy our story over
    //@return yes or no
    var hasNextSprint = function(){
	var currentLocation = doc.location.pathname;
	var result = {
            hasNext: false,
            nextURL: ""
	};
	$.ajax({
            url: sprintListURL,
            type: "GET",
            async: false, //performance issue, pulling the information is very slow, though the function works.
            success:function(html){
		var target = $(html).find('a[href=' + currentLocation +']').parent().parent()//locate current sprint link on list page, <tr> level
		var hasNext = $(target).next().length;
		var nextURL = protocol + host + $(target).next().find('a').attr("href");
		
		if(hasNext == 1){
                    result.hasNext = true;
                    result.nextURL = nextURL;
		}
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
		console.log(textStatus);
		console.log(errorThrown);
            }
	});
	return result;
    };

    //If we don't have a sprint to copy our data to, create a new one.
    //@return url of the new sprint
    //TODO: popover window to create new sprint
    var createNewSprint = function(sprintName){
	return url;
    };

    //TODO: need a service to cache the hasNextSprint method, the call is too expensive
    var cache = function(obj){
        if($.inArray(obj, cachedObj) != -1){
            return true;
        }
        return false;
    };

    return {
	init: init      
    }

})(jQuery, document)

plugin.init();
