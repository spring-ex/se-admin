'use strict';

angular.module('smartAdminApp').factory('SuperUserFactory', function($q, $http, SignInFactory) {
    var factory = {};

    var URL = SignInFactory.getBaseUrl() + '/secure';

    factory.getAllStates = function() {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/state'
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllPackages = function() {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/package'
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllProgramOutcomes = function(collegeId, courseId, branchId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllProgramOutcomes/' + collegeId + '/' + courseId + '/' + branchId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllProgramOutcomesForSubject = function(collegeId, courseId, subjectId, isElective) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllProgramOutcomesForSubject/' + collegeId + '/' + courseId + '/' + subjectId + '/' + isElective
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllQuestionsForChapter = function(chapterId, subjectId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllQuestionsForChapter/' + chapterId + '/' + subjectId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSmartTestForChapter = function(chapterId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllSmartTestsForChapter/' + chapterId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllOptionsForQuestion = function(questionId, packageCode) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getOptionsForQuestion/' + questionId + '/' + packageCode
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllColleges = function() {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/college'
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllCourses = function() {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/course'
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllBranches = function() {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/branch'
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSubjects = function() {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/subject'
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSpecialSubjects = function(collegeId, courseId, semesterId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/specialSubject/' + collegeId + '/' + courseId + '/' + semesterId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllChaptersForSubject = function(subjectId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/chapter/getBySubject/' + subjectId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllTopicsForChapter = function(chapterId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/topic/getAllByChapter/' + chapterId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllBlooms = function() {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllBlooms'
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllCriteria = function(chapterId, topicId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllCriteria/' + chapterId + '/' + topicId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSubTopics = function(topicIds) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getAllSubTopics',
            data: topicIds,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addSubTopics = function(newSubTopic) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/addSubTopics',
            data: newSubTopic,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addProgramOutcome = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/addProgramOutcome',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.updateProgramOutcome = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/updateProgramOutcome',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.deleteProgramOutcome = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/deleteProgramOutcome',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addCourseOutcome = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/addCourseOutcome',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.assignQuestionToTopic = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/assignQuestionToTopic',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.updateTimeToSolveForQuestion = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/updateTimeToSolveForQuestion',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.updateOption = function(option) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/options',
            data: option,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.deleteQuestion = function(question) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/question',
            data: question,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.removeQuestionImage = function(question) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/removeQuestionImage',
            data: question,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.updateQuestion = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/updateQuestion',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.deleteSubTopic = function(subTopic) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/deleteSubTopic',
            data: subTopic,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSemesters = function() {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/semester'
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllCoursesForCollege = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/course/getAllByCollege/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllBranchesForCourse = function(courseId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/branch/getAll/' + courseId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSemestersForBranch = function(branchId, collegeId, courseId, universityId, stateId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/semester/getAllByBranch/' + branchId + '/' + collegeId + '/' + courseId + '/' + universityId + '/' + stateId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllClassesForSemester = function(branchId, semesterId, collegeId, courseId, universityId, stateId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/class/getAllBySemester/' + branchId + '/' + semesterId + '/' + collegeId + '/' + courseId + '/' + universityId + '/' + stateId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllUniversities = function(stateId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/university/' + stateId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSemestersForBranchAndCourse = function(branchId, courseId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/semester/getAllByBranchAndCourse/' + branchId + '/' + courseId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllTopics = function() {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/topic'
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllCategories = function() {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/testCategory'
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addCollege = function(newCollege) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/college',
            data: newCollege,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addCourse = function(newCourse) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/course',
            data: newCourse,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.assignCoursesToCollege = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/assignCoursesToCollege',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addBranch = function(newBranch) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/branch',
            data: newBranch,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.assignBranchesToCollege = function(assignBranch) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/assignBranchesToCollege',
            data: assignBranch,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.assignSemestersToBranch = function(assignSemesters) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/semester',
            data: assignSemesters,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addClasses = function(newClass) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/class',
            data: newClass,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addSubject = function(newSubject) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/subject',
            data: newSubject,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addSpecialSubject = function(newSubject) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/specialSubject',
            data: newSubject,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addSpecialClass = function(newClass) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/specialClass',
            data: newClass,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.createChapters = function(chapter) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/chapter',
            data: chapter,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.linkSubjects = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/linkSubjects',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSpecialClassesForSpecialSubject = function(subjectId, collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/specialClass/getAllBySpecialSubject/' + subjectId + '/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllStudentsInCourseAndSem = function(collegeId, courseId, semesterId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllStudentsInCourseAndSem/' + collegeId + '/' + courseId + '/' + semesterId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addTopics = function(topics) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/topic',
            data: topics,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.createTopicsAndAssignToChapter = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/createTopicsAndAssignToChapter',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.assignTopics = function(newAssign) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/topic/assignToChapter',
            data: newAssign,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.assignVideosToTopics = function(newAssign) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/assignVideosToTopics',
            data: newAssign,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.assignQPToTopics = function(newAssign) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/assignQPToTopics',
            data: newAssign,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.assignCategory = function(newAssign) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/assignCategoriesToSubject',
            data: newAssign,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addCategories = function(categories) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/testCategory',
            data: categories,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addQuestion = function(question) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/addQuestion',
            data: question,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.createSmartTest = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/createSmartTest',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.editChapter = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/editChapter',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.editTopic = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/editTopic',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.editSubTopic = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/editSubTopic',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.deleteTopic = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/deleteTopic',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.deleteQuiz = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/deleteSmartTest',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllTags = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getAllTags',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addSearchword = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/addSearchword',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.deleteSearchword = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/deleteSearchword',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.updateSearchword = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/updateSearchword',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.updateTagsForQuestion = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/updateTagsForQuestion',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getTinyURL = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getShortURL',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});