angular.module('LearnMemory', ['hSweetAlert', 'ngSanitize', 'ngRoute', 'hc.marked'])
.config(['$routeProvider', function($routeProvider){
    $routeProvider
     .when('/lesson/:id', {
      templateUrl: 'vendor/views/lesson.html',
      controller: 'LearnMemoryLessonCtrl'
    })
     .when('/', {
      templateUrl: 'vendor/views/list.html',
      controller: 'LearnMemoryListCtrl'
    })
    .when('/creation', {
      templateUrl: 'vendor/views/creation.html',
      controller: 'LearnMemoryCreationCtrl'
    })
    .otherwise({
        redirectTo: '/'
      });
}])
.controller('LearnMemoryLessonCtrl', ['$scope', '$location', '$http', 'sweet', '$routeParams', 'marked', function($scope, $location, $http, sweet, $routeParams, marked) {
        $http.get('http://localhost:9999/api/'+ $routeParams.id).success(function(data) {
                        $scope.currentItem = data;

                        $scope.editing = false;

                         $scope.displayPreview = function() {
                                   $scope.currentItem.content = marked($scope.currentItem.markdown);
                         };

                        $scope.removeLesson = function() {
                                    sweet.show({
                                        title: 'Confirm',
                                        text: 'Delete this lesson?',
                                        type: 'warning',
                                        showCancelButton: true,
                                        confirmButtonColor: '#DD6B55',
                                        confirmButtonText: "Yes, delete it!",
                                        closeOnConfirm: false
                                    }, function() {
                                        $http.delete('http://localhost:9999/api/'+$scope.currentItem.id).success(function() {
                                            sweet.show('Deleted!', 'The lesson has been deleted.', 'success');
                                            $location.path('/');
                                        });
                                    });
                        };

                        $scope.print = function() {
                                window.print();
                        };


                        $scope.displayLesson = function() {
                                $scope.displayPreview();
                                $http.put('http://localhost:9999/api/'+$scope.currentItem.id, $scope.currentItem).success(function() {
                                            $scope.editing = false;
                                            sweet.show('The lesson has been saved.', '', 'success');
                                });
                 };
         });
}])
.controller('LearnMemoryCreationCtrl', ['$scope', '$location', '$http', 'sweet', 'marked', function($scope, $location, $http, sweet, marked) {
        $scope.newItem = {
                content: '',
                markdown: ''
        };

        $scope.displayPreview = function() {
                $scope.newItem.content = marked($scope.newItem.markdown);
        };

        $scope.displayLesson = function() {
                $scope.displayPreview();
                $http.post('http://localhost:9999/api', $scope.newItem).success(function(data) {
                    sweet.show('The lesson has been saved.', '', 'success');
                    $location.path('/lesson/' + data.id.toString());
                    }).error(function() {
                    sweet.show('Oops...', 'Something went wrong!', 'error');
                });
        };
}])
.controller('LearnMemoryListCtrl', ['$scope', '$location', '$http', 'sweet', function($scope, $location, $http, sweet) {
        $scope.loading = true;
        $http.get('http://localhost:9999/api').success(function(data) {
            $scope.loading = false;
            
            $scope.items = data;

            $scope.goItem = function (item) {
                $location.path('/lesson/' + item.id);
            };
        });
}]);