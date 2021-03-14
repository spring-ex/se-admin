'use strict';

/**
 * @ngdoc overview
 * @name smartAdminApp
 * @description
 * # smartAdminApp
 *
 * Main module of the application.
 */
angular
    .module('smartAdminApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngTouch',
        'ui.router',
        'ui.bootstrap',
        'toastr',
        'ui.select',
        'mgo-angular-wizard',
        'daterangepicker',
        'highcharts-ng',
        'angular-svg-round-progressbar',
        'xeditable'
    ])
    .run(function($rootScope, $state, SignInFactory, editableOptions) {

        editableOptions.theme = 'bs3';

        $rootScope.$on('loading-show', function() {
            $('.spinner').css("display", "block");
        });
        $rootScope.$on('loading-hide', function() {
            $('.spinner').css("display", "none");
        });
        $rootScope.$on('$stateChangeStart', function(e, to) {
            if (to.secure) {
                if (!SignInFactory.isAuthenticated) {
                    e.preventDefault();
                    $state.go('SignIn');
                }
            }
        });
    })
    .config(function($stateProvider, $urlRouterProvider, $httpProvider, uiSelectConfig, $sceDelegateProvider) {

        uiSelectConfig.theme = 'bootstrap';

        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'http://res.cloudinary.com/**',
            'https://res.cloudinary.com/**'
        ]);

        $httpProvider.interceptors.push(function($rootScope) {
            return {
                'request': function(config) {
                    $rootScope.$broadcast('loading-show');
                    return config;
                },
                'requestError': function(rejection) {
                    $rootScope.$broadcast('loading-hide');
                    return $q.reject(rejection);
                },
                'response': function(response) {
                    $rootScope.$broadcast('loading-hide');
                    return response;
                },
                'responseError': function(rejection) {
                    $rootScope.$broadcast('loading-hide');
                    return $q.reject(rejection);
                }
            };
        });

        $stateProvider
            .state('SignIn', {
                url: "/SignIn",
                secure: false,
                templateUrl: "/views/SignIn.html",
                controller: "SignInController"
            })
            .state('Dashboard', {
                url: "/Dashboard",
                secure: true,
                templateUrl: "/views/Dashboard.html",
                controller: "DashboardController"
            })
            .state('Users', {
                url: "/Users",
                secure: true,
                templateUrl: "/views/Users.html",
                controller: "UsersController"
            })
            .state('AddOrEditUser', {
                url: "/AddOrEditUser/:isAdd/:userId",
                secure: true,
                templateUrl: "/views/AddOrEditUser.html",
                controller: "AddOrEditUserController"
            })
            .state('Students', {
                url: "/Students/:isPersisted",
                secure: true,
                templateUrl: "/views/Students.html",
                controller: "StudentsController"
            })
            .state('AddOrEditStudent', {
                url: "/AddOrEditStudent/:param/:studentId",
                secure: true,
                templateUrl: "/views/AddOrEditStudent.html",
                controller: "AddOrEditStudentController"
            })
            .state('Enquiries', {
                url: "/Enquiries",
                secure: true,
                templateUrl: "/views/Enquiries.html",
                controller: "EnquiriesController"
            })
            .state('AddEnquiry', {
                url: "/AddEnquiry",
                secure: true,
                templateUrl: "/views/AddEnquiry.html",
                controller: "AddEnquiryController"
            })
            .state('ViewUser', {
                url: "/ViewUser/:userId",
                secure: true,
                templateUrl: "/views/ViewUser.html",
                controller: "ViewUserController"
            })
            .state('ViewStudent', {
                url: "/ViewStudent/:studentId",
                secure: true,
                templateUrl: "/views/ViewStudent.html",
                controller: "ViewStudentController"
            })
            .state('Attendance', {
                url: "/Attendance",
                secure: true,
                templateUrl: "/views/Attendance.html",
                controller: "AttendanceController"
            })
            .state('DeleteAttendance', {
                url: "/DeleteAttendance",
                secure: true,
                templateUrl: "/views/DeleteAttendance.html",
                controller: "DeleteAttendanceController"
            })
            .state('AddCollege', {
                url: "/AddCollege",
                secure: true,
                templateUrl: "/views/AddCollege.html",
                controller: "AddCollegeController"
            })
            .state('Courses', {
                url: "/Courses",
                secure: true,
                templateUrl: "/views/Courses.html",
                controller: "CoursesController"
            })
            .state('Branches', {
                url: "/Branches",
                secure: true,
                templateUrl: "/views/Branches.html",
                controller: "BranchesController"
            })
            .state('AssignSemesters', {
                url: "/AssignSemesters",
                secure: true,
                templateUrl: "/views/AssignSemesters.html",
                controller: "AssignSemestersController"
            })
            .state('AddClass', {
                url: "/AddClass",
                secure: true,
                templateUrl: "/views/AddClass.html",
                controller: "AddClassController"
            })
            .state('Subjects', {
                url: "/Subjects",
                secure: true,
                templateUrl: "/views/Subjects.html",
                controller: "SubjectsController"
            })
            .state('AssignStudents', {
                url: "/AssignStudents",
                secure: true,
                templateUrl: "/views/AssignStudents.html",
                controller: "AssignStudentsController"
            })
            .state('AssignStudentsToElectives', {
                url: "/AssignStudentsToElectives",
                secure: true,
                templateUrl: "/views/AssignStudentsToElectives.html",
                controller: "AssignStudentsToElectivesController"
            })
            .state('Chapters', {
                url: "/Chapters",
                secure: true,
                templateUrl: "/views/Chapters.html",
                controller: "ChaptersController"
            })
            .state('Topics', {
                url: "/Topics",
                secure: true,
                templateUrl: "/views/Topics.html",
                controller: "TopicsController"
            })
            .state('CopyTopics', {
                url: "/CopyTopics",
                secure: true,
                templateUrl: "/views/CopyTopics.html",
                controller: "CopyTopicsController"
            })
            .state('TopicVideos', {
                url: "/TopicVideos",
                secure: true,
                templateUrl: "/views/TopicVideos.html",
                controller: "TopicVideosController"
            })
            .state('TopicQP', {
                url: "/TopicQP",
                secure: true,
                templateUrl: "/views/TopicQP.html",
                controller: "TopicQPController"
            })
            .state('Questions', {
                url: "/Questions",
                secure: true,
                templateUrl: "/views/Questions.html",
                controller: "QuestionsController"
            })
            .state('Expenses', {
                url: "/Expenses",
                secure: true,
                templateUrl: "/views/Expenses.html",
                controller: "ExpensesController"
            })
            .state('FeesCollected', {
                url: "/FeesCollected",
                secure: true,
                templateUrl: "/views/FeesCollected.html",
                controller: "FeesCollectedController"
            })
            .state('ActivateStudents', {
                url: "/ActivateStudents",
                secure: true,
                templateUrl: "/views/ActivateStudents.html",
                controller: "ActivateStudentsController"
            })
            .state('AssignQuestions', {
                url: "/AssignQuestions",
                secure: true,
                templateUrl: "/views/AssignQuestions.html",
                controller: "AssignQuestionsController"
            })
            .state('AssignPPT', {
                url: "/AssignPPT",
                secure: true,
                templateUrl: "/views/AssignPPT.html",
                controller: "AssignPPTController"
            })
            .state('TestCategory', {
                url: "/TestCategory",
                secure: true,
                templateUrl: "/views/TestCategory.html",
                controller: "TestCategoryController"
            })
            .state('TreeView', {
                url: "/TreeView",
                secure: true,
                templateUrl: "/views/TreeView.html",
                controller: "TreeViewController"
            })
            .state('SpecialSubjects', {
                url: "/SpecialSubjects",
                secure: true,
                templateUrl: "/views/SpecialSubjects.html",
                controller: "SpecialSubjectsController"
            })
            .state('LinkSpecialSubjects', {
                url: "/LinkSpecialSubjects",
                secure: true,
                templateUrl: "/views/LinkSpecialSubjects.html",
                controller: "LinkSpecialSubjectsController"
            })
            .state('SpecialClass', {
                url: "/SpecialClass",
                secure: true,
                templateUrl: "/views/SpecialClass.html",
                controller: "SpecialClassController"
            })
            .state('CreateSmartTest', {
                url: "/CreateSmartTest",
                secure: true,
                templateUrl: "/views/CreateSmartTest.html",
                controller: "CreateSmartTestController"
            })
            .state('AssignDefaultPPT', {
                url: "/AssignDefaultPPT",
                secure: true,
                templateUrl: "/views/AssignDefaultPPT.html",
                controller: "AssignDefaultPPTController"
            })
            .state('TakeAttendance', {
                url: "/TakeAttendance",
                secure: true,
                templateUrl: "/views/TakeAttendance.html",
                controller: "TakeAttendanceController"
            })
            .state('DeleteSmartTest', {
                url: "/DeleteSmartTest",
                secure: true,
                templateUrl: "/views/DeleteSmartTest.html",
                controller: "DeleteSmartTestController"
            })
            .state('ProgramOutcome', {
                url: "/ProgramOutcome",
                secure: true,
                templateUrl: "/views/ProgramOutcomes.html",
                controller: "ProgramOutcomesController"
            })
            .state('CourseOutcome', {
                url: "/CourseOutcome",
                secure: true,
                templateUrl: "/views/CourseOutcomes.html",
                controller: "CourseOutcomesController"
            })
            .state('CreateCriteria', {
                url: "/CreateCriteria",
                secure: true,
                templateUrl: "/views/CreateCriteria.html",
                controller: "CreateCriteriaController"
            })
            .state('ViewCriteria', {
                url: "/ViewCriteria",
                secure: true,
                templateUrl: "/views/ViewCriteria.html",
                controller: "ViewCriteriaController"
            })
            .state('Searchword', {
                url: "/Searchword",
                secure: true,
                templateUrl: "/views/Searchword.html",
                controller: "SearchwordController"
            })
            .state('CollegeDocuments', {
                url: "/CollegeDocuments",
                secure: true,
                templateUrl: "/views/AddDocumentsToCollege.html",
                controller: "AddDocumentsToCollegeController"
            });

        $urlRouterProvider.otherwise("/SignIn");
    });