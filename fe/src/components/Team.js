import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTeams, getTeam, deleteTeam } from "./utils";
import Modal from "../Modal";

export default function Team(params) {
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    teamSearch: "",
  });
  const [response, setResponse] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getTeams();
    if (data.reason) {
      setResponse(`Error while loading teams: ${data.reason}`);
      setFormData({ teamSearch: "" });
      return;
    }
    setTeams(data);
  };

  const changeHandler = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const toggleModal = () => {
    setShowModal((prevShowModal) => !prevShowModal);
  };

  const renderModal = () => {
    return (
      <Modal onClick={toggleModal}>
        <div>
          <h1 className="msg">Would you like to delete {selectedTeam.name}?</h1>
          <div className="buttons">
            <Link
              className="button delete"
              onClick={async () => {
                const data = await deleteTeam(selectedTeam.id);
                if (data.reason) {
                  toggleModal();
                  setResponse(`Error while deleting team: ${data.reason}`);
                } else {
                  await load();
                  toggleModal();
                }
              }}
            >
              Yes
            </Link>
            <button className="button" onClick={toggleModal}>
              No
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  teams.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  return (
    <>
      <div className="row">
        <Link className="button" to="/createteam">
          Add Team
        </Link>
        <div className="search">
          <form>
            <input
              type="text"
              name="teamSearch"
              id="teamSearch"
              value={formData.teamSearch}
              placeholder="Team ID or Name"
              onChange={changeHandler}
            />
            <button
              onClick={async (event) => {
                event.preventDefault();
                const data = await getTeam(
                  formData.teamSearch.trimStart().trimEnd().toLowerCase()
                );
                if (data.reason) {
                  setResponse(`Error while loading team: ${data.reason}`);
                } else if (Array.isArray(data)) {
                  setTeams(data);
                  setResponse("");
                } else {
                  setTeams([data]);
                  setResponse("");
                }

                setFormData({ teamSearch: "" });
              }}
            >
              Get Team
            </button>
          </form>
        </div>
      </div>

      {response === "" ? (
        teams.map((team) => {
          return (
            <div className="teamItem" key={team.id}>
              <span>{team.name}</span>
              <Link className="button" to={`/team/${team.id}`}>
                Update
              </Link>
              <button
                className="button delete"
                onClick={() => {
                  toggleModal();
                  setSelectedTeam(team);
                }}
              >
                Delete
              </button>
            </div>
          );
        })
      ) : (
        <p className="response">{response}</p>
      )}
      {showModal ? renderModal() : null}
    </>
  );
}
