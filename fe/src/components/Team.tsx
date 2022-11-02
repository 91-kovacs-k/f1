import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTeams, getTeam, deleteTeam, Team as TeamType } from "./utils";
import Modal from "../Modal";

export default function Team(): JSX.Element {
  const [teams, setTeams] = useState([] as TeamType[]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    teamSearch: "",
  });
  const [response, setResponse] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState({} as TeamType);

  useEffect(() => {
    setLoading(true);
    setTeams([] as TeamType[]);
    void load();
  }, []);

  const load = async (): Promise<void> => {
    const fetch = await getTeams();
    setLoading(false);
    if (fetch.error) {
      setResponse(`Error while loading teams: ${fetch.error.reason}`);
      setFormData({ teamSearch: "" });
      return;
    }
    setTeams(fetch.data as TeamType[]);
  };

  const changeHandler = (event: React.FormEvent<HTMLInputElement>): void => {
    const { name, value } = event.currentTarget;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const onDelete = async () => {
    const fetch = await deleteTeam(selectedTeam.id);
    if (fetch.error) {
      toggleModal();
      setResponse(`Error while deleting team: ${fetch.error.reason}`);
    } else {
      await load();
      toggleModal();
    }
  };

  const onGet = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    const fetch = await getTeam(
      formData.teamSearch.trimStart().trimEnd().toLowerCase()
    );
    if (fetch.error) {
      setResponse(`Error while loading team: ${fetch.error.reason}`);
    } else if (Array.isArray(fetch.data)) {
      setTeams(fetch.data);
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
      {loading ? (
        <p className="response">Loading...</p>
      ) : (
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
      )}
    </>
  );
}
