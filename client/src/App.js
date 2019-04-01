import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  // initialize our state 
  state = {
    data: [],
    id: null,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
	updateToApply: null
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has 
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever 
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object 
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify 
  // data base entries

  // our first get method that uses our backend api to 
  // fetch data from our data base
  getDataFromDb = () => {
     axios.get('/api/datas')
      .then((result) => {
        this.setState({ data: result.data })
      })
  };

  // our POST method that uses our backend api
  // to create new query into our data base
  putDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("/api/datas", {
      id: Number(idToBeAdded),
      message: message
    });
  };


  // our delete method that uses our backend api 
  // to remove existing database information
  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id == idTodelete) {
        objIdToDelete = dat.id;
      }
    });

    axios.delete("/api/datas", {
      data: {
        id: { id: objIdToDelete },
      }
    });
  };


  // our UPDATE method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.map(dat => {
      if (Number(dat.id) == Number(idToUpdate)) {
        objIdToUpdate = Number(dat.id);
      }
    });

    axios.put("/api/datas", {
      id: { id: idToUpdate },
      update: { message: updateToApply }
    });
  };


	setUpdate(e) {
		this.setState({ idToUpdate: e.target.parentNode.firstChild.value });
	}
	
	updateItem(e) {
		this.updateDB(this.state.idToUpdate, this.state.updateToApply);
		this.setState({ updateToApply: null });
	}

	setDelete(e) {
		this.setState({ idToDelete: e.target.parentNode.firstChild.value });
	}
	
	resetDelete(e) {
		this.setState({ idToDelete: null });
	}

	deleteItem(e) {
		this.deleteFromDB(this.state.idToDelete);
	}

  // here is our UI
  // it is easy to understand their functions when you 
  // see them render into our screen
  render() {
    const { data } = this.state;
    return (
      <div>
	  
	    <div style={{ padding: "10px" }}>
          <input
            type="text"
            onChange={e => this.setState({ message: e.target.value })}
            placeholder="add something in the database"
            style={{ width: "200px" }}
          />
          <button onClick={() => this.putDataToDB(this.state.message)}>
            ADD
          </button>
        </div>
	  
        <ul>
          {data.length <= 0
            ? "NO DB ENTRIES YET"
            : data.map(dat => (
                <li style={{ padding: "10px" }} key={data.message}>
				
				  <input type="hidden" value={dat.id}/>
                  <span style={{ color: "gray" }}> id: </span> {dat.id} <br />
                  <span style={{ color: "gray" }}> data: </span>
				   {dat.message}
				  <br/>
				  
				  <input type="text" style={{ width: "150px" }} onChange={e => this.setState({ updateToApply: e.target.value })} placeholder="put new value of the item here" />
		  
                  <button onMouseEnter={(e) => this.setUpdate(e)} onClick={(e) => this.updateItem(e)}>UPDATE</button>
				  <br/>
				  
				  <button className="delbutt" onMouseOver={(e) => this.setDelete(e)} onClick={() => this.deleteItem()}>Delete</button>
				  
                </li>
              ))}
        </ul>
      
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ idToDelete: e.target.value })}
            placeholder="put id of item to delete here"
          />
          <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
            DELETE
          </button>
        </div>
		
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ idToUpdate: Number(e.target.value) })}
            placeholder="id of item to update here"
          />
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ updateToApply: e.target.value })}
            placeholder="put new value of the item here"
          />
          <button
            onClick={() =>
              this.updateDB(this.state.idToUpdate, this.state.updateToApply)
            }
          >
            UPDATE
          </button>
        </div>
		
      </div>
    );
  }
}

export default App;
