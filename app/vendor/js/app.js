angular.module('LearnMemory', ['hSweetAlert', 'ngSanitize', 'ngRoute', 'textAngular'])
.config(['$routeProvider', function($routeProvider){
        $routeProvider
        .when('/', {
            templateUrl: 'vendor/views/lessons-list.html',
            controller: 'LearnMemoryLessonsListCtrl'
        })
        .when('/lessons/new', {
            templateUrl: 'vendor/views/lessons-new.html',
            controller: 'LearnMemoryLessonsNewCtrl'
        })
        .when('/lessons/:id', {
            templateUrl: 'vendor/views/lessons-id.html',
            controller: 'LearnMemoryLessonsIdCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]).run(['$rootScope', '$location', function($rootScope, $location){
    $rootScope.$location = $location;
}]).directive('toolbarTip', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).toolbar(scope.$eval(attrs.toolbarTip));
        }
    };
}).controller('LearnMemoryLessonsIdCtrl', ['$scope', '$location', '$http', '$routeParams', '$rootScope', 'sweet', function($scope, $location, $http, $routeParams, $rootScope, sweet) {
        $rootScope.nav = 'lesson';

        $http.get('http://localhost:7772/api/'+ $routeParams.id).success(function(data) {
            $scope.currentLesson = data;

            $scope.editing = false;

            $scope.removeLesson = function() {
                sweet.show({
                    title: 'Confirm',
                    text: 'Delete this lesson?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: 'Yes, delete it!',
                    closeOnConfirm: false
                }, function() {
                    $http.delete('http://localhost:7772/api/'+$scope.currentLesson.id).success(function() {
                        sweet.show('Deleted!', 'The lesson has been deleted.', 'success');
                        $location.path('/');
                    }).error(function() {
                        sweet.show('Oops...', 'Something went wrong!', 'error');
                    });
                });
            };

            $scope.print = function() {
                window.print();
            };

            $scope.displayLesson = function() {
                $http.put('http://localhost:7772/api/'+$scope.currentLesson.id, $scope.currentLesson).success(function() {
                    $scope.editing = false;
                    sweet.show('The lesson has been saved.', '', 'success');
                }).error(function() {
                    sweet.show('Oops...', 'Something went wrong!', 'error');
                });
            };

            document.getElementById('lesson-content').onclick = function (e) {
                e = e || window.event;
                var element = e.target || e.srcElement;

                if (element.tagName == 'A') {
                    require('nw.gui').Shell.openExternal(element.href);
                    return false;
                }
            };
        }).error(function() {
            sweet.show('Oops...', 'Something went wrong!', 'error');
            $location.path('/');
        });
}]).controller('LearnMemoryLessonsNewCtrl', ['$scope', '$location', '$http', '$rootScope', 'sweet', function($scope, $location, $http, $rootScope, sweet) {
        $rootScope.nav = 'creation';

        $scope.newLesson = {
            content: ''
        };

        $scope.displayLesson = function() {
            $http.post('http://localhost:7772/api', $scope.newLesson).success(function(data) {
                sweet.show('The lesson has been saved.', '', 'success');
                $location.path('/lesson/' + data.id.toString());
            }).error(function() {
                sweet.show('Oops...', 'Something went wrong!', 'error');
            });
        };
}]).controller('LearnMemoryLessonsListCtrl', ['$scope', '$location', '$http', '$rootScope', 'sweet', function($scope, $location, $http, $rootScope, sweet) {
        $rootScope.nav = 'list';
        $rootScope.loading = true;

        $http.get('http://localhost:7772/api').success(function(data) {
            $rootScope.loading = false;
            $scope.lessons = data;
            $scope.short = true;

            $scope.goLesson = function (lesson) {
                $location.path('/lessons/' + lesson.id);
            };

            $scope.advancedSearch = function () {
                $http.get('http://localhost:7772/api/long').success(function(data) {
                    $scope.lessons = data;
                    $scope.short = false;
                }).error(function() {
                    sweet.show('Oops...', 'Something went wrong!', 'error');
                });
            };
        }).error(function() {
            sweet.show('Oops...', 'Something went wrong!', 'error');
        });
}]);
