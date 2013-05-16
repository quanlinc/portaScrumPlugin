var plugin = (function($, doc){

    var init = function(){
      //jQuery(document).ready(function(){alert("hello");})
      initUI();
    };
    
    var initUI = function(){
      $('img[alt="Back"]').each(function(){
        var backlogLink = $(this).parent();
        $(backlogLink).before('<input type="button" value="copy"/>');
      });
    };

    
    var initListener = function(){
        $('input[value="copy"]').click(function(e){
            var targetId = e.target.id;
        });
    };
    
    //div id which contains the information of a story
    //copy the info inside a story, get ready for posting
    var copy = function(story){
        var storyName=$('#' + story.attr("id") + '> h3 > span[id^="story_description"]').text();
        var tasks = new Array();
        
        $(story).find('table').find('tr[class$="taskInProgress"]').each(function(){
            var taskName = $(this).find('span').text();
            var owner = $(this).find('td[class^="worker"]').text();
        });
    };
    
    //construct a data structure that will be passed to post data agaist next sprint
    //TODO:need to think about what to pass in and how to put into data structure
    var constructData = function(storyName, tasks, owner){
        var story = {
            "storyName": storyName,
            "tasks": []
        };
        for(var i in tasks){
            var task = tasks[i];
            story.tasks.push({
                "task": task,
                "owner": owner
		"estimate":estimate
            });
        }
        
        return story;
    }

    var postData = function(storyName, tasks){
	//TODO: 1.find the next sprint url
	//      2.post against that url, creat story first
	//      3.locate the new story that has been created, adding new tasks to it
	var targetURL;
	
	if(hasNextSrint()){
	    //route to sprint list page, find the url of last sprint
	} else {//TODO: probably popover a input dialogue to get new sprint name
	    targetURL = createNewSprint(sprintName);
	}

	$.ajax(
	    url: targetURL,
	    type: "POST",
	    data: storyName,
	    success:function(html){//successfully created new story
		//add new tasks
		var newStoryLocation = $(html).find('');
		//might need to do $.each for tasks
		$.ajax(
		    url: targetURL,
		    type: "POST",
		    data: tasks,
		    success:function(html){

		    },
		    error: function(XMLHttpRequest, textStatus, errorThrown){

		    }
		);
	    },
	    error: function(XMLHttpRequest, textStatus, errorThrown){

	    }
	);
    };

    //verify if we have a new sprint to copy our story over
    //@return yes or no
    var hasNextSprint = function(){

    };
    
    //If we don't have a sprint to copy our data to, create a new one.
    //@return url of the new sprint
    var createNewSprint = function(sprintName){
	return url;
    };

    return {
        init:init
    }

})(jQuery, document)


plugin.init();

