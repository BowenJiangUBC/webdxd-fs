/**
 * Created by bowenjiang on 2016-10-09.
 */

var myApp = angular.module('student',[]);

var host= "http://localhost:3000/api/"
myApp.controller('studentController', function ($http, $scope) {
    $scope.students = [];
    //$scope.clickedStudent={};
    $scope.newStudent={};
    $scope.editing = false;


    $http.get(host+'students').
    success(function (res) {
        $scope.students=res;
    });

    $scope.getStudentDetail = function (sid) {
        console.log("triggerd click!");
        $http.get(host+"students/"+sid).success(
            function (res){
                $scope.clickedStudent = res;
            }
        );
    };

    $scope.isValid=false;
    $scope.createNewStudent = function()  {
        isValid =typeof $scope.newStudent.firstName === 'string' &&
                typeof $scope.newStudent.lastName === 'string'&&
                isNum($scope.newStudent.age)&&
                validateEmail($scope.newStudent.email);
        console.log(isValid);

        if(isValid){
            $http.post(host+'students/new', $scope.newStudent).success( function (res) {
                console.log(res);
                $scope.students.push(res);
                $scope.newStudent={};
            });
        } else{
            //document.getElementById("Button").disabled = true;
            alert("Check your input stupid fuck!");
        }

    };
    $scope.clearStudent = function () {
        $scope.clickedStudent=undefined;
    };

    $scope.deleteStudent = function (sid) {
        console.log(sid);
        $http.get(host+'students/delete/'+sid).success(function(res) {
            console.log(res);
            var studentList= $scope.students;
            for(i=0;i<studentList.length;i++) {
                if(studentList[i]._id === res._id){
                    $scope.students.splice(i,1);
                    $scope.clickedStudent = undefined;
                }
            }
        })

    };
    
    $scope.editStudent=function () {
        $scope.editing=true;
        $scope.newStudent=$scope.clickedStudent;
        console.log($scope.newStudent);
    };

    // $scope.newStudent=$scope.clickedStudent;

    $scope.saveStudent = function(sid) {
        console.log(sid);
        if(sid){
            $http.post(host + 'students/edit/'+sid, $scope.newStudent).success(function () {
                //$scope.clickedStudent=undefined;
                var studentList= $scope.students;
                for(i=0;i<studentList.length;i++) {
                    if(studentList[i]._id === sid){
                        studentList[i]=$scope.newStudent;
                        $scope.newStudent={};
                    }
                }
            });
            $scope.editing=false;
        }else{
            $scope.createNewStudent();
            $scope.editing=false;
        }
    }
    var isNum = function(s){
        var isnum = /^\d+$/.test(s);
        return isnum;
    }
    var validateEmail = function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
    }
});



