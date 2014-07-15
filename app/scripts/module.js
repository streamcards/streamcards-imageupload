(function(angular) {
  'use strict';

  var app = angular.module('whiteboard', []);

  app.controller('MainCtrl', function($scope) {

    $scope.onDrop = function() {
      console.log('test');
    };
  });

  app.directive('uiDrop', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.bind('dragover', function(e) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
          angular.element(element).addClass('on-drag-hover');
          return false;
        });

        element.bind('dragleave drop', function(e) {
          angular.element(element).removeClass('on-drag-hover');
        });

        element.bind('drop', function(e) {
        	e.preventDefault();
        	if(e.dataTransfer.types.indexOf('Files') === -1) {
        		return;
        	}

        	// handle file upload
        	// get FileList
        	var files = e.dataTransfer.files;
        	for(var i=0, f; f=files[i]; i++) {
        		console.log(f.name + ': ' + 'size: ' + f.size + '; type: ' + f.type);
        	}

        	return false;
        });
      }
    };
  });

  app.directive('uiDraggable', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        angular.element(element).attr('draggable', 'true');
        element.bind('dragstart', function(e) {
          e.dataTransfer.effectAllowed = 'copy';
          e.dataTransfer.setData('text/html', this.innerHTML);
        });
      }
    };
  });

})(window.angular);
