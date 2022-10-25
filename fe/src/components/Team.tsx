import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getTeams,
  getTeam,
  deleteTeam,
  BackendError,
  Team as TeamType,
} from "./utils";
import Modal from "../Modal";

export default function Team(): JSX.Element {
  const [teams, setTeams] = useState([] as TeamType[]);
  const [formData, setFormData] = useState({
    teamSearch: "",
  });
  const [response, setResponse] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState({} as TeamType);

  useEffect(() => {
    void load();
  }, []);

  const load = async (): Promise<void> => {
    const data = await getTeams();
    if ((data as BackendError).reason) {
      setResponse(
        `Error while loading teams: ${(data as BackendError).reason}`
      );
      setFormData({ teamSearch: "" });
      return;
    }
    setTeams(data as TeamType[]);
  };

  const changeHandler = (event: React.FormEvent<HTMLInputElement>): void => {
    const { name, value } = event.currentTarget;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const onDelete = async () => {
    const data = await deleteTeam(selectedTeam.id);
    if ((data as BackendError).reason) {
      toggleModal();
      setResponse(
        `Error while deleting team: ${(data as BackendError).reason}`
      );
    } else {
      await load();
      toggleModal();
    }
  };

  const onGet = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    const data = await getTeam(
      formData.teamSearch.trimStart().trimEnd().toLowerCase()
    );
    if ((data as BackendError).reason) {
      setResponse(`Error while loading team: ${(data as BackendError).reason}`);
    } else if (Array.isArray(data)) {
      setTeams(data);
      setResponse("");
    } else {
      setTeams([data as unknown as TeamType]);
      setResponse("");
    }

    setFormData({ teamSearch: "" });
  };

  const toggleModal = (): void => {
    setShowModal((prevShowModal) => !prevShowModal);
  };

  const renderModal = (): JSX.Element => {
    return (
      <Modal onClick={toggleModal}>
        <div>
          <h1 className="msg">Would you like to delete {selectedTeam.name}?</h1>
          <div className="buttons">
            <button
              className="button delete"
              onClick={() => {
                void onDelete();
              }}
            >
              Yes
            </button>
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
              onClick={(event) => {
                void onGet(event);
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
