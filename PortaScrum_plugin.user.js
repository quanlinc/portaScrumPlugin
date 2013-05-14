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

    return {
        init:init
    }
    
    var initListener = function(){
        $('input[value="copy"]').click(function(e){
            var targetId = e.target.id;
        });
    };
    
    //div id which contains the information of a story
    var copy = function(story){
        var storyName=$('#' + story.attr("id") + '> h3 > span[id^="story_description"]').text();
        var tasks = new Array();
        
        $(story).find('table').find('tr[class$="taskInProgress"]').each(function(){
            var taskName = $(this).find('span').text();
            var owner = $(this).find('td[class^="worker"]').text();
        });
    };
    
    var constructData = function(storyName, tasks, owner){
        var story = {
            "storyName": storyName,
            "tasks": []
        };
        for(var i in tasks){
            var task = tasks[i];
            story.tasks.push({
                "task"+i: task,
                "owner": owner
            });
        }
        
        return story;
    }

})(jQuery, document)


plugin.init();

