var host = '/api/';


var Student = React.createClass({
    handleStudentClick: function () {

        var ReactThis = this;


        axios.get(host+'students/'+this.props.data._id)
            .then(function (response) {
                //console.log(response);
                ReactThis.props.update(response.data)
                ReactThis.props.setNew(false);

            })
            .catch(function (err) {
                console.log(err)
            });
        //console.log(this.props.data._id)
    },

    deleteStudent: function () {
        var ReactThis = this;
        console.log('hi');
        axios.get(host+'students/delete/'+this.props.data._id)
            .then(function (response) {
                console.log(response.data._id);
                ReactThis.props.deletedStudent(response.data);
            })
            .catch(function (err) {
                console.log(err);
            });
    },

    render: function () {
        return  (<div>
            <h1 onClick={this.handleStudentClick}>{this.props.data.firstName}</h1>
        </div>)
    }
});

var StudentDetail = React.createClass({
    


    deleteStudent: function () {
        var ReactThis = this;
        console.log('hi');
        axios.get(host+'students/delete/'+this.props.data._id)
            .then(function (response) {
                console.log(response.data._id);
                ReactThis.props.updateDelete(response.data);
            })
            .catch(function (err) {
                console.log(err);
            });
    },

    render: function () {
        return (
            <div>
                <h2>FIrstName:{this.props.data.firstName}</h2>
                <h2>LastName:{this.props.data.lastName}</h2>
                <h2>Email:{this.props.data.email}</h2>
                <h2>Age:{this.props.data.age}</h2>
                <button className="delete-btn" onClick={this.props.showAddNewForm}>Edit</button>
                <button className="delete-btn" onClick={this.deleteStudent}>Delete</button>

            </div>
        )
    }
});

var StudentForm = React.createClass({
    submitForm: function () {
        //console.log("hi");
        var ReactThis= this;
        var newStudent= {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            age: document.getElementById('age').value,
            email: document.getElementById('email').value,
        };

        if(this.props.isNew){
            axios.post(host+'students/new',newStudent)
                .then(function (response) {
                    //console.log(response);
                    ReactThis.props.insert(response.data)
                })
                .catch(function (err) {
                    console.log(err)
                });
        } else{
            newStudent._id = this.props.studentDetail._id

            axios.post(host + 'students/edit/' + this.props.studentDetail._id, newStudent)
                .then(function (response) {
                    console.log(response.data);
                    ReactThis.props.setNew(true);
                    ReactThis.props.updateStudent(newStudent);
                })
                .catch(function (err) {
                    console.log(err);
                })
        }

        //console.log(newStudent);
    },
    render:function () {
        return(
            <div className="student-detail">
                <input type="text" placeholder="firstName" id="firstName" defaultValue={this.props.studentDetail.firstName}/>
                <input type="text" placeholder="lastName" id="lastName" defaultValue={this.props.studentDetail.lastName}/>
                <input type="text" placeholder="Email" id="email" defaultValue={this.props.studentDetail.email}/>
                <input type="text" placeholder="Age" id="age" defaultValue={this.props.studentDetail.age}/>
                <button onClick={this.submitForm}>Submit</button>
            </div>
        )
    }
});


var StudentList = React.createClass({

    deleteFront: function (data) {
        var tempStudent = this.state.studentList;
        console.log(data);
        var index = tempStudent.indexOf(data);
        tempStudent.splice(index,1);
        this.setState({
            studentList:tempStudent
        })

    },

    insertStudent: function (data) {
        var tempStudent = this.state.studentList;
        tempStudent.push(data);
        this.setState({
            studentList:tempStudent
        });
        document.getElementById('firstName').value="";
        document.getElementById('lastName').value="";
        document.getElementById('email').value="";
        document.getElementById('age').value="";
    },

    updateStudent: function(data) {
       var students = this.state.studentList;
        for (var i = 0; i < students.length; i++) {
            if (students[i]._id === data._id) {
                students[i] = data;
            }
        }
        this.setState({
            studentList: students
        });
    },

    setNew: function (flag) {
        this.setState({
            isNew: flag
        })
    },

    updateDetail:function (data) {
        this.setState({
            studentDetail:data
        });
        //console.log(data)
    },

    getInitialState: function () {
        return{
            studentList:[],
            studentDetail: {},
            showForm: false,
            isNew: true
        }
    },
    componentWillMount: function () {

        var ReactThis = this;

        axios.get(host+'students')
            .then(function (response) {
                ReactThis.setState({
                    studentList:response.data
                });

                //console.log(response.data)
            })
            .catch(function (err) {
                console.log(err)
            })
    },


    showAddNewForm: function () {
        this.setState({
            showForm: true
        })
    },

    render: function () {
        var ReactThis = this;


        if (this.state.studentDetail.firstName){
            var sdNode=(
                <div className="student-detail">
                    <h1>StudentDetail</h1>
                    <StudentDetail data={this.state.studentDetail}
                                   showAddNewForm={ReactThis.showAddNewForm}
                                   updateDelete={ReactThis.deleteFront}/>
                </div>)

        } else{
            var sdNode = "";
        }

        //console.log(this.state.studentList);

        return (
            <div>
                <div className="student-list">
                {this.state.studentList.map(function (student) {
                    return <Student key={student._id} data={student}
                                    update={ReactThis.updateDetail}
                                    setNew={ReactThis.setNew}
                                    />
                })}

                <div>
                <h1  className="add-new" onClick={this.showAddNewForm}>add new</h1>
                </div>
                </div>

                {sdNode}

                { (this.state.showForm) ? <StudentForm insert={this.insertStudent} studentDetail={this.state.studentDetail}
                                                       isNew={ReactThis.state.isNew}
                                                        setNew={ReactThis.setNew}
                                                        updateStudent={this.updateStudent}/> : ""}
            </div>
        );
    }
});

ReactDOM.render(
    <StudentList/>,document.getElementById('app')
);