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
        element.bind('dragleave', function(e) {
          angular.element(element).removeClass('on-drag-hover');
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
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/html', this.innerHTML);
        });
      }
    };
  });

})(window.angular);
