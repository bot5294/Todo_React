import React, { Component } from "react";
import { Card, Header, Form, Input, Icon,Button,Grid } from "semantic-ui-react";
import "./TodoMain.css";

class TodoMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: "",
      tasklist: []
    };
  }
//  onload fetch the task list
  componentDidMount = () => {
    // setting page title
    document.title="Todo App (React)"
    this.getTasks();
  };

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  // add task to the list
  onSubmit = () => {
    // check is task is empty string
    if (this.state.task) {
      // fetch task list from localStorage
      let tasklist = JSON.parse(localStorage.getItem("tasklist"));
      // task list is null means empty
      // create an empty list
      if (tasklist == null) {
        tasklist = [];
      }
      // create task object
      // default status is false
      let task = {
        task: `🔖 ${this.state.task}`,
        status: false // false-> incomplete task, true -> completed task
      };
      // add the task to the task list
      tasklist.push(task);
      // save the task list in localStorage
      localStorage.setItem("tasklist", JSON.stringify(tasklist));

      // clear the form
      this.setState({ task: "" });

      // refresh the tasks
      this.getTasks();
    }
  };

  onReset = ()=>{
    // clearing the state to initial value
    this.setState({
      task: "",
      tasklist: []
  });
  // clearing local storage
    localStorage.clear();
  }

  // get all the tasks
  getTasks = () => {
    let tasklist = JSON.parse(localStorage.getItem("tasklist"));
    // check if task list is empty
    if (tasklist) {
      // sort all the tasks on the basis of status
      // completed task will move down
      tasklist = tasklist.sort((a, b) => {
        if (a.status) {
          return 1;
        } else if (b.status) {
          return -1;
        }
        return 0;
      });

      // saving the sorted task list in localStorage
      localStorage.setItem("tasklist", JSON.stringify(tasklist));

      // set the tasklist to the state
      this.setState({
        // Incomplete: orange
        // complete: green
        tasklist: tasklist.map((item, index) => {
          let color = "orange";
          let card = { 
            background: "white",
            width:"100%",
            marginLeft:"10%",
            display:"inline-block"
          };
          let headerDiv = {
            wordWrap: "break-word",
            fontSize:"2em",
            fontWeight:"bold" 
          }
          let taskComplete = { textDecoration: "none",
          color:"orange"
          };

          if (item.status) {
            color = "green";
            card["background"] = "whitesmoke";
            taskComplete["textDecoration"] = "line-through";
            taskComplete['color'] ='red';
          }
          return (
            <Card fluid key={index} color={color} style={card}>
              <Card.Content>
              <Grid columns={3} divided doubling>
              <Grid.Row>
                <Grid.Column width={2}>
                <Card.Meta textAlign="center">
                <Icon
                    link
                    name="check circle"
                    color="green"
                    size="huge"
                    onClick={() => this.completeTask(index)}
                  />
                </Card.Meta>
                </Grid.Column>
                <Grid.Column width={12}>
                <Card.Header textAlign="center" style={taskComplete}>
                  <div style={headerDiv}>{item.task}</div>
                </Card.Header>
                </Grid.Column>
                <Grid.Column width={2}>
                <Card.Meta textAlign="center">
                  <Icon
                    link
                    name="delete"
                    color="red"
                    size="huge"
                    onClick={() => this.deleteTask(index)}
                  />
                </Card.Meta>
                </Grid.Column>
                </Grid.Row>
                </Grid>
              </Card.Content>
            </Card>
          );
        })
      });
    }
  };

  // change task status to true
  completeTask = index => {
    // fetch tasklist from localStorage
    let tasklist = JSON.parse(localStorage.getItem("tasklist"));
    // change status to true
    tasklist[index].status = true;
    // save the updated task list
    localStorage.setItem("tasklist", JSON.stringify(tasklist));
    this.getTasks();
  };

  // delete the task from the task list
  deleteTask = index => {
    let tasklist = JSON.parse(localStorage.getItem("tasklist"));
    // remove the task from the task list
    tasklist.splice(index, 1);
    // save the updated task list
    localStorage.setItem("tasklist", JSON.stringify(tasklist));
    this.getTasks();
  };

  render() {
    return (
      <div>
        <div>
          <Header as="h1">
            <div className="header"><span role="img">📑</span> Todo App</div>{" "}
          </Header>
        </div>
        <div className="form">
          <Form>
            <Input
              type="text"
              name="task"
              onChange={this.onChange}
              value={this.state.task}
              placeholder="Enter Task Name"
              style={{border: "2px solid whiteSmoke",
                  boxShadow:"1px 1px 5px 1px grey"
            }}
            />
            &nbsp;&nbsp;&nbsp;
            <Button.Group>
            <Button positive onClick={this.onSubmit}>Add Task</Button>
              <Button.Or />
              <Button negative onClick={this.onReset}>Reset All</Button>
            </Button.Group>
          </Form>
        </div>
        <div>
          <Card.Group>{this.state.tasklist}</Card.Group>
        </div>
      </div>
    );
  }
}

export default TodoMain;
