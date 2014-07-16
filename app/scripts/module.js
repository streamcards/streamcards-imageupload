(function(angular) {
  'use strict';

  var app = angular.module('whiteboard', ['rx']);

  /**
   * Main Controller
   *
   */
  app.controller('MainCtrl', function($scope, rx) {

    var fileStream = new rx.Subject();
    $scope.fileStream = fileStream;
    fileStream.subscribe(function(file) {
      console.log(file);
    });

  });


  /**
   * Upload directive
   *
   */
  app.directive('uiUpload', function() {
    return {
      restrict: 'E',
      template: '<li ng-repeat="f in files">{{f.name}}</li>',
      scope: {
        fileStream: '=',
        filter: '='
      },
      link: function(scope, element, attrs, controller) {
        var filter = new RegExp(scope.filter);
        scope.fileStream
          .filter(function(file) {
            return file.type.match(filter);
          })
          .subscribe(function(file) {
            controller.addFile(file);
          });
      },
      controller: function($scope) {
        $scope.files = [];
        this.addFile = function(file) {
          $scope.$apply(function() {
            $scope.files.push(file);
          });
        };
      }
    };
  });


  /**
   * Drop directive
   *
   */
  app.directive('uiDrop', function(rx) {
    return {
      restrict: 'A',
      scope: {
        fileStream: '=uiDropFiles'
      },
      link: function(scope, element) {

        // bind dragover
        element.bind('dragover', function(e) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
          angular.element(element).addClass('on-drag-hover');
          return false;
        });

        // bind dragleave, drop
        element.bind('dragleave drop', function() {
          angular.element(element).removeClass('on-drag-hover');
        });

        // bind drop - cast to rx.subject
        rx.Observable.fromEvent(element, 'drop')
          .flatMap(function(e) {
            e.preventDefault();
            var files = [];
            if (e.dataTransfer.types.indexOf('Files') !== -1) {
              for (var i = 0, f;
                (f = e.dataTransfer.files[i]); i++) {
                files.push(f);
              }
            }
            return rx.Observable.fromArray(files);
          })
          .subscribe(scope.fileStream);
      }
    };
  });


  /**
   * Draggable directive
   *
   */
  app.directive('uiDraggable', function() {
    return {
      restrict: 'A',
      link: function(scope, element) {

        // add draggable attr
        angular.element(element).attr('draggable', 'true');

        // bind dragstart
        element.bind('dragstart', function(e) {
          e.dataTransfer.effectAllowed = 'copy';
          e.dataTransfer.setData('text/html', this.innerHTML);
        });
      }
    };
  });

})(window.angular);
