'use strict';

angular.module('smartAdminApp').factory('StudentsFactory', function($q, $http, SignInFactory) {
    var factory = {
        persistSelectedValues: {}
    };

    var URL = SignInFactory.getBaseUrl() + '/secure';

    factory.getAllByCourseBranchSem = function(collegeId, courseId, branchId, semesterId, classId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/student/getAllByCourseBranchSem/' + collegeId + '/' + courseId + '/' + branchId + '/' + semesterId + '/' + classId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllBySubject = function(classId, subjectId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/student/getAllBySubject/' + classId + '/' + subjectId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getStudentCount = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/student/getAllByCollege/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getStudentById = function(studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/student/getById/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getDeactivatedStudents = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/student/getDeactivatedStudents/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllFeesCollected = function(collegeId, courseId, branchId, semesterId, classId) {
        var obj = {
            CollegeId: collegeId,
            CourseId: courseId,
            BranchId: branchId,
            SemesterId: semesterId,
            ClassId: classId
        };
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/student/getAllFeesCollected/',
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

    factory.assignStudentsToElectives = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/assignStudentToSubject',
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

    factory.admitStudent = function(newAdmission) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/student',
            data: newAdmission,
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

    factory.updateStudent = function(newStudent) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/student',
            data: newStudent,
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

    factory.deleteStudent = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/student',
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

    factory.approve = function(student) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/student/approve',
            data: student,
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

    factory.reject = function(student) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/student/reject',
            data: student,
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

    factory.assignStudentsToElectiveSubject = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/assignStudentToElectiveSubject',
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