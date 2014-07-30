(function(angular, jQuery) {
  'use strict';

  if (jQuery && (-1 == jQuery.event.props.indexOf("dataTransfer"))) {
    // Originally solved by Tim Branyen in his drop file plugin
    // http://dev.aboutnerd.com/jQuery.dropFile/jquery.dropFile.js
    jQuery.event.props.push('dataTransfer');
  }


  var app = angular.module('whiteboard', ['rx', 'uuid'])
    .config(function($sceDelegateProvider) {
      var whiteList = $sceDelegateProvider.resourceUrlWhitelist();
      whiteList.push('data:image**');
      $sceDelegateProvider.resourceUrlWhitelist(whiteList)
    });

  /**
   * Main Controller
   *
   */
  app.controller('MainCtrl', function($scope, rx, uuid) {

    $scope.images = [];

    var fileStream = new rx.Subject();
    $scope.fileStream = fileStream;
    fileStream.subscribe(function(file) {
      console.log(file);
    });

    var fileDataStream = $scope.fileDataStream = new rx.Subject();
    fileDataStream.subscribe(function(result) {

      console.log(result);

      $scope.$apply(function() {
        $scope.images.push({
          _id: uuid.new(),
          file: result.file,
          data: result.data
        });
      });

    });
  });


  /**
   * Progress directive.
   *
   * This directive does the actual loading.
   * When finished, an event is published on `fileDataStream`, con-
   * sisting of a result object of the form:
   *    var obj = {
   *        file: <File> fileObject,
   *        data: <String> binaryImageData
   *    }
   */
  app.directive('uiProgress', function($compile) {
    return {
      restrict: 'EA',
      scope: {
        file: '='
      },
      compile: function(elem) {
        var html = elem.html();
        return function(scope, element) {
          element.html($compile(html)(scope));
        };
      },
      controller: function($scope, rx) {
        $scope.percentage = 0;
        var file = $scope.file,
          fileDataStream = $scope.$parent.fileDataStream,
          reader = new FileReader();

        var updatePercentage = function(percentage) {
          $scope.$apply(function() {
            $scope.percentage = percentage;
          });
        };

        // track progress
        reader.onprogress = function(e) {
          if (!e.lengthComputable) {
            return;
          }
          updatePercentage(Math.round((e.loaded / e.total) * 100));
        };

        // finalize progress
        rx.Observable.fromEvent(reader, 'load')
          .map(function(e) {
            updatePercentage(100);
            return {
              file: file,
              data: e.target.result
            };
          })
          .subscribe(fileDataStream);

        // reader.onloadstart = this.onLoadStart;

        reader.readAsDataURL(file);
      }
    };
  });

  /**
   * Upload directive
   *
   */
  app.directive('uiUpload', function($compile) {
    return {
      restrict: 'E',
      scope: {
        fileStream: '=',
        filter: '=',
        fileDataStream: '='
      },
      compile: function(elem) {
        var html = elem.html();
        return function(scope, element, attrs, controller) {
          var filter = new RegExp(scope.filter);
          scope.fileStream
            .filter(function(file) {
              return file.type.match(filter);
            })
            .subscribe(function(file) {
              controller.addFile(file);
            });
          element.html($compile(html)(scope));
        };
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
        fileStream: '=uiDropFileStream'
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

})(window.angular, window.jQuery);
