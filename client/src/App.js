import React, { Component } from "react";
import axios from "axios";
import './app.css';

class App extends Component {
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

  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  getDataFromDb = () => {
    axios.get('/api/datas')
      .then((result) => {
        this.setState({ data: result.data })
      })
  };

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

  render() {
    const { data } = this.state;
    return (
      <div>
        <div style={{ padding: "10px" }} className="adddata">
          <input
            type="text"
            onChange={e => this.setState({ message: e.target.value })}
            placeholder="add something to the database"
            style={{ width: "200px" }}
          />
          <button onClick={() => this.putDataToDB(this.state.message)}>
            Add
            </button>
        </div>
        <ul>
          {data.length <= 0
            ? "NO DB ENTRIES YET"
            : data.map(dat => (
              <li style={{ padding: "10px" }} key={data.message} className="item">
                <input type="hidden" value={dat.id} />
                <span style={{ color: "gray" }}> id: </span> {dat.id} <br />
                <span style={{ color: "gray" }}> data: </span>
                {dat.message}
                <br />
                <input type="text" style={{ width: "150px" }} onChange={e => this.setState({ updateToApply: e.target.value })} placeholder="put new value of the item here" />
                <button onMouseEnter={(e) => this.setUpdate(e)} onClick={(e) => this.updateItem(e)}>Update</button>
                <br />
                <button className="delbutt" onMouseOver={(e) => this.setDelete(e)} onClick={() => this.deleteItem()}>Delete</button>

              </li>
            ))}
        </ul>
        <div className="down">
          <div style={{ padding: "10px" }}>
            <input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ idToDelete: e.target.value })}
              placeholder="put id of item to delete here"
            />
            <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
              Delete
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
              Update
              </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
