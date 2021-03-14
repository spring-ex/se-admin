'use strict';

/**
 * @ngdoc function
 * @name smartAdminApp.controller:AddOrEditUserController
 * @description
 * # AddOrEditUserController
 * Controller of the smartAdminApp
 */
angular.module('smartAdminApp')
    .controller('AddOrEditUserController', function($scope, RoleFactory, toastr, DashboardFactory, SuperUserFactory, SignInFactory, $stateParams, UsersFactory, $state, LookupFactory) {

        $scope.newUser = {
            Id: null,
            Name: "",
            DateOfBirth: "",
            Email: "",
            PhoneNumber: null,
            Address: "",
            City: "Bangalore",
            State: "Karnataka",
            Designation: "",
            ProfileImageURL: "",
            Role: "",
            Username: "",
            Password: "",
            CollegeId: SignInFactory.loggedInUser.CollegeId,
            UserEducation: [],
            UserExperience: [],
            Subjects: [],
            SpecialSubjects: []
        };
        $scope.UserEducationTemplate = {
            University: "",
            Degree: "",
            YearOfPassing: "",
            UserId: null
        };
        $scope.UserExperienceTemplate = {
            CollegeName: "",
            Designation: "",
            FromDate: "",
            ToDate: "",
            UserId: null
        };
        $scope.dateOptions = {
            formatYear: 'yyyy',
            maxDate: new Date(2030, 5, 22),
            minDate: new Date(1900, 5, 23),
            startingDay: 1
        };
        $scope.popups = {
            dobOpened: false,
            fromOpened: false,
            toOpened: false
        };
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.selected = {
            Course: null,
            Branch: null,
            Semester: null,
            Class: null,
            Subject: null
        };

        $scope.specialSelected = {
            Course: null,
            Branch: null,
            Semester: null,
            SpecialClass: null,
            SpecialSubject: null
        };

        $scope.keywords = DashboardFactory.keywords;
        $scope.loggedInUser = SignInFactory.loggedInUser;

        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.classes = [];
        $scope.subjects = [];

        $scope.specialCourses = [];
        $scope.specialBranches = [];
        $scope.specialSemesters = [];
        $scope.specialClasses = [];
        $scope.specialSubjects = [];

        $scope.isAdd = ($stateParams.isAdd == "true");
        $scope.userId = $stateParams.userId;

        $scope.roles = [];

        $scope.getAllRoles = function() {
            RoleFactory.getAllRoles()
                .then(function(success) {
                    $scope.roles = success.data.Data;
                    if (SignInFactory.loggedInUser.Role != 'SUPERADMIN') {
                        for (var i = 0; i < $scope.roles.length; i++) {
                            if ($scope.roles[i].RoleCode == 'UPLOADER') {
                                $scope.roles.splice(i, 1);
                            }
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        if (!$scope.isAdd) {
            UsersFactory.getUserById($scope.userId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.newUser = success.data.Data;
                        $scope.newUser.PhoneNumber = parseInt($scope.newUser.PhoneNumber);
                        $scope.newUser.DateOfBirth = new Date($scope.newUser.DateOfBirth);
                    }
                }, function(error) {
                    toastr.error(error);
                })
        }

        $scope.addEducation = function() {
            if ($scope.UserEducationTemplate.University == "") {
                toastr.warning('University name is a required field');
            } else if ($scope.UserEducationTemplate.Degree == "") {
                toastr.warning('Degree is a required field');
            } else if ($scope.UserEducationTemplate.YearOfPassing == "" || $scope.UserEducationTemplate.YearOfPassing == undefined) {
                toastr.warning('Year of passing is a required field');
            } else {
                $scope.newUser.UserEducation.push($scope.UserEducationTemplate);
                $scope.UserEducationTemplate = {
                    University: "",
                    Degree: "",
                    YearOfPassing: "",
                    UserId: $scope.userId
                };
            }
        };

        $scope.addExperience = function() {
            if ($scope.UserExperienceTemplate.CollegeName == "") {
                toastr.warning('College Name is a required field');
            } else if ($scope.UserExperienceTemplate.Designation == "") {
                toastr.warning('Designation is a required field');
            } else if ($scope.UserExperienceTemplate.FromDate == "") {
                toastr.warning('From date is a required field');
            } else if ($scope.UserExperienceTemplate.ToDate == "") {
                toastr.warning('To date is a required field');
            } else {
                $scope.UserExperienceTemplate.FromDate = moment($scope.UserExperienceTemplate.FromDate).format("YYYY-MM-DD");
                $scope.UserExperienceTemplate.ToDate = moment($scope.UserExperienceTemplate.ToDate).format("YYYY-MM-DD");
                $scope.newUser.UserExperience.push($scope.UserExperienceTemplate);
                $scope.UserExperienceTemplate = {
                    CollegeName: "",
                    Designation: "",
                    FromDate: "",
                    ToDate: "",
                    UserId: $scope.userId
                };
            }
        };

        $scope.addSubject = function() {
            if ($scope.selected.Course == null ||
                $scope.selected.Branch == null ||
                $scope.selected.Semester == null ||
                $scope.selected.Class == null) {
                toastr.warning('Please enter all the fields');
            } else {
                for (var i = 0; i < $scope.subjects.length; i++) {
                    if ($scope.subjects[i].isSelected) {
                        $scope.selected.Subject = $scope.subjects[i];
                        $scope.selected.Subject.CourseId = $scope.selected.Course.Id;
                        $scope.selected.Subject.BranchId = $scope.selected.Branch.Id;
                        $scope.selected.Subject.SemesterId = $scope.selected.Semester.Id;
                        $scope.selected.Subject.ClassId = $scope.selected.Class.Id;
                        $scope.selected.Subject.BranchName = $scope.selected.Branch.Name;
                        $scope.selected.Subject.SemesterName = $scope.selected.Semester.SemesterNumber;
                        $scope.selected.Subject.ClassName = $scope.selected.Class.Name;
                        $scope.newUser.Subjects.push($scope.selected.Subject);
                    }
                }
                if ($scope.newUser.Subjects.length == 0) {
                    toastr.warning('Please select atleast 1 subject');
                } else {
                    $scope.selected = {
                        Course: null,
                        Branch: null,
                        Semester: null,
                        Class: null,
                        Subject: null
                    };
                    $scope.subjects = [];
                }
            }
        };

        $scope.addSpecialSubject = function() {
            if ($scope.specialSelected.Course == null ||
                $scope.specialSelected.Semester == null) {
                toastr.warning('Please enter all the fields');
            } else {
                for (var i = 0; i < $scope.specialSubjects.length; i++) {
                    if ($scope.specialSubjects[i].isSelected) {
                        $scope.specialSelected.SpecialSubject = $scope.specialSubjects[i];
                        $scope.specialSelected.SpecialSubject.CourseId = $scope.specialSelected.Course.Id;
                        $scope.specialSelected.SpecialSubject.SemesterId = $scope.specialSelected.Semester.Id;
                        $scope.specialSelected.SpecialSubject.SemesterName = $scope.specialSelected.Semester.SemesterNumber;
                        $scope.newUser.SpecialSubjects.push($scope.specialSelected.SpecialSubject);
                    }
                }
                if ($scope.newUser.SpecialSubjects.length == 0) {
                    toastr.warning('Please select atleast 1 special subject');
                } else {
                    $scope.specialSelected = {
                        Course: null,
                        Branch: null,
                        Semester: null,
                        SpecialClass: null,
                        SpecialSubject: null
                    };
                    $scope.specialSubjects = [];
                }
            }
        };

        $scope.deleteSubject = function(index) {
            $scope.newUser.Subjects.splice(index, 1);
        };

        $scope.deleteSpecialSubject = function(index) {
            $scope.newUser.SpecialSubjects.splice(index, 1);
        };

        $scope.deleteEducation = function(index) {
            $scope.newUser.UserEducation.splice(index, 1);
        };

        $scope.deleteExperience = function(index) {
            $scope.newUser.UserExperience.splice(index, 1);
        };

        $scope.submit = function() {
            $scope.newUser.Username = $scope.newUser.Email;
            $scope.newUser.DateOfBirth = moment($scope.newUser.DateOfBirth).format("YYYY-MM-DD");
            $scope.newUser.PhoneNumber = $scope.newUser.PhoneNumber.toString();
            $scope.newUser.UserExperience.forEach(function(element) {
                element.FromDate = moment(element.FromDate).format('YYYY-MM-DD');
                element.ToDate = moment(element.ToDate).format('YYYY-MM-DD');
            });
            UsersFactory.addUser($scope.newUser)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('User added successfully');
                        $state.go('Users');
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.update = function() {
            if ($scope.newUser.Name == "") {
                toastr.warning('Please enter Name before you submit');
            } else if ($scope.newUser.Email == "" || $scope.newUser.Email == undefined) {
                toastr.warning('Please enter Email before you submit');
            } else if ($scope.newUser.PhoneNumber == "" || $scope.newUser.PhoneNumber == undefined) {
                toastr.warning('Please enter Phone Number before you submit');
            } else if ($scope.newUser.DateOfBirth == "" || $scope.newUser.DateOfBirth == undefined) {
                toastr.warning('Please enter Date of Birth before you submit');
            } else if ($scope.newUser.Address == "" || $scope.newUser.Address == undefined) {
                toastr.warning('Please enter Address before you submit');
            } else if ($scope.newUser.City == "" || $scope.newUser.City == undefined) {
                toastr.warning('Please enter City before you submit');
            } else if ($scope.newUser.State == "" || $scope.newUser.State == undefined) {
                toastr.warning('Please enter State before you submit');
            } else if ($scope.newUser.Designation == "" || $scope.newUser.Designation == undefined) {
                toastr.warning('Please enter Designation before you submit');
            } else if ($scope.newUser.Role == "") {
                toastr.warning('Please enter Role before you submit');
            } else if ($scope.newUser.Password == "") {
                toastr.warning('Please enter Default Password before you submit');
            } else {
                $scope.newUser.Username = $scope.newUser.Email;
                $scope.newUser.DateOfBirth = moment($scope.newUser.DateOfBirth).format("YYYY-MM-DD");
                $scope.newUser.PhoneNumber = $scope.newUser.PhoneNumber.toString();
                $scope.newUser.UserExperience.forEach(function(element) {
                    element.FromDate = moment(element.FromDate).format('YYYY-MM-DD');
                    element.ToDate = moment(element.ToDate).format('YYYY-MM-DD');
                });
                UsersFactory.updateUserNew($scope.newUser)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('User updated successfully');
                            $state.go('Users');
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.getAllCourses = function() {
            $scope.courses = [];
            $scope.branches = [];
            $scope.semesters = [];
            $scope.classes = [];
            $scope.subjects = [];

            $scope.specialCourses = [];
            $scope.specialBranches = [];
            $scope.specialSemesters = [];
            $scope.specialClasses = [];
            $scope.specialSubjects = [];
            $scope.specialSubjects = [];

            $scope.selected.Course = null;
            $scope.selected.Branch = null;
            $scope.selected.Semester = null;
            $scope.selected.Class = null;
            $scope.selected.Subject = null;

            $scope.specialSelected.Course = null;
            $scope.specialSelected.Branch = null;
            $scope.specialSelected.Semester = null;
            $scope.specialSelected.SpecialClass = null;
            $scope.specialSelected.SpecialSubject = null;

            LookupFactory.getAllCourses(SignInFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.courses = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.courses = success.data.Data;
                        $scope.specialCourses = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.courseSelected = function(course, flag) {
            if (flag) {
                $scope.branches = [];
                $scope.semesters = [];
                $scope.classes = [];
                $scope.subjects = [];
                $scope.selected.Branch = null;
                $scope.selected.Semester = null;
                $scope.selected.Class = null;
                $scope.selected.Subject = null;
            } else {
                $scope.specialBranches = [];
                $scope.specialSemesters = [];
                $scope.specialClasses = [];
                $scope.specialSubjects = [];
                $scope.specialSelected.Branch = null;
                $scope.specialSelected.Semester = null;
                $scope.specialSelected.SpecialClass = null;
                $scope.specialSelected.SpecialSubject = null;
            }

            LookupFactory.getAllBranches(course.Id, SignInFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.branches = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        if (flag) {
                            $scope.branches = success.data.Data;
                        } else {
                            $scope.specialBranches = success.data.Data;
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.branchSelected = function(branch, flag) {
            var cid;
            if (flag) {
                $scope.semesters = [];
                $scope.classes = [];
                $scope.subjects = [];
                $scope.selected.Semester = null;
                $scope.selected.Class = null;
                $scope.selected.Subject = null;
                cid = $scope.selected.Course.Id;
            } else {
                $scope.specialSemesters = [];
                $scope.specialClasses = [];
                $scope.specialSubjects = [];
                $scope.specialSelected.Semester = null;
                $scope.specialSelected.SpecialClass = null;
                $scope.specialSelected.SpecialSubject = null;
                cid = $scope.specialSelected.Course.Id;
            }
            LookupFactory.getAllSemesters(branch.Id, SignInFactory.loggedInUser.CollegeId, cid, SignInFactory.loggedInUser.UniversityId, SignInFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.semesters = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        if (flag) {
                            $scope.semesters = success.data.Data;
                        } else {
                            $scope.specialSemesters = success.data.Data;
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.semesterSelected = function(semester, flag) {
            var cid, bid;
            if (flag) {
                $scope.classes = [];
                $scope.subjects = [];
                $scope.selected.Class = null;
                $scope.selected.Subject = null;
                bid = $scope.selected.Branch.Id;
                cid = $scope.selected.Course.Id;
                LookupFactory.getAllClasses(bid, semester.Id, SignInFactory.loggedInUser.CollegeId, cid, SignInFactory.loggedInUser.UniversityId, SignInFactory.loggedInUser.StateId)
                    .then(function(success) {
                        $scope.classes = [];
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            if (flag) {
                                $scope.classes = success.data.Data;
                            }
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            } else {
                $scope.specialClasses = [];
                $scope.specialSubjects = [];
                $scope.specialSelected.SpecialClass = null;
                $scope.specialSelected.SpecialSubject = null;
                bid = $scope.specialSelected.Branch.Id;
                cid = $scope.specialSelected.Course.Id;
                LookupFactory.getAllClasses(bid, semester.Id, SignInFactory.loggedInUser.CollegeId, cid, SignInFactory.loggedInUser.UniversityId, SignInFactory.loggedInUser.StateId)
                    .then(function(success) {
                        $scope.classes = [];
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            if (flag) {
                                $scope.classes = success.data.Data;
                            } else {
                                $scope.specialClasses = success.data.Data;
                            }
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
            if (flag) {
                LookupFactory.getAllNonElectiveSubjects(cid, bid, semester.Id)
                    .then(function(success) {
                        $scope.subjects = [];
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            $scope.subjects = success.data.Data;
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            } else {
                SuperUserFactory.getAllSpecialSubjects($scope.loggedInUser.CollegeId, cid, $scope.specialSelected.Semester.Id)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            $scope.specialSubjects = success.data.Data;
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.userDataUpdated = function() {
            if ($scope.newUser.Name == "") {
                toastr.warning('Please enter Name');
                return false;
            } else if ($scope.newUser.Email == "" || $scope.newUser.Email == undefined) {
                toastr.warning('Please enter Email');
                return false;
            } else if ($scope.newUser.PhoneNumber == "" || $scope.newUser.PhoneNumber == undefined) {
                toastr.warning('Please enter Phone Number');
                return false;
            } else if ($scope.newUser.DateOfBirth == "" || $scope.newUser.DateOfBirth == undefined) {
                toastr.warning('Please enter Date of Birth');
                return false;
            } else if ($scope.newUser.Address == "" || $scope.newUser.Address == undefined) {
                toastr.warning('Please enter Address');
                return false;
            } else if ($scope.newUser.City == "" || $scope.newUser.City == undefined) {
                toastr.warning('Please enter City');
                return false;
            } else if ($scope.newUser.State == "" || $scope.newUser.State == undefined) {
                toastr.warning('Please enter State');
                return false;
            } else if ($scope.newUser.Designation == "" || $scope.newUser.Designation == undefined) {
                toastr.warning('Please enter Designation');
                return false;
            } else if ($scope.newUser.Role == "") {
                toastr.warning('Please enter Role');
                return false;
            } else if ($scope.newUser.Password == "") {
                toastr.warning('Please enter Default Password');
                return false;
            } else {
                return true;
            }
        };

        $scope.educationDataUpdated = function() {
            if ($scope.newUser.UserEducation.length == 0) {
                toastr.warning('Please enter your educational qualification');
                return false;
            } else {
                return true;
            }
        };

        $scope.getAllRoles();
        $scope.getAllCourses();
    })