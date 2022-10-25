import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getPilots,
  getPilot,
  deletePilot,
  Pilot as PilotType,
  BackendError,
} from "./utils";
import Modal from "../Modal";

export default function Pilot(): JSX.Element {
  const [pilots, setPilots] = useState([] as PilotType[]);
  const [formData, setFormData] = useState({
    pilotSearch: "",
  });
  const [response, setResponse] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPilot, setSelectedPilot] = useState({} as PilotType);

  useEffect(() => {
    void load();
  }, []);

  const load = async (): Promise<void> => {
    const data = await getPilots();
    if ((data as BackendError).reason) {
      setResponse(
        `Error while loading pilots: ${(data as BackendError).reason}`
      );
      setFormData({ pilotSearch: "" });
      return;
    }
    setPilots(data as PilotType[]);
  };

  const changeHandler = (event: React.FormEvent<HTMLInputElement>): void => {
    const { name, value } = event.currentTarget;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const toggleModal = (): void => {
    setShowModal((prevShowModal) => !prevShowModal);
  };

  const onDelete = async () => {
    const data = await deletePilot(selectedPilot.id);
    if ((data as BackendError).reason) {
      toggleModal();
      setResponse(
        `Error while deleting pilot: ${(data as BackendError).reason}`
      );
    } else {
      await load();
      toggleModal();
    }
  };

  const onGet = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    const data = await getPilot(formData.pilotSearch);
    if ((data as BackendError).reason) {
      setResponse(
        `Error while loading pilot: ${(data as BackendError).reason}`
      );
    } else if (Array.isArray(data)) {
      setPilots(data);
      setResponse("");
    } else {
      setPilots([data as unknown as PilotType]);
      setResponse("");
    }
    setFormData({ pilotSearch: "" });
  };

  const renderModal = (): JSX.Element => {
    return (
      <Modal onClick={toggleModal}>
        <div>
          <h1 className="msg">
            Would you like to delete {selectedPilot.name}?
          </h1>
          <div className="buttons">
            <button className="button delete" onClick={() => void onDelete()}>
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

  pilots.sort((a, b) => {
    if ((a.team?.name || "") < (b.team?.name || "")) {
      return -1;
    }
    if ((a.team?.name || "") > (b.team?.name || "")) {
      return 1;
    }
    return 0;
  });

  return (
    <>
      <div className="row">
        <Link className="button" to="/createpilot">
          Add Pilot
        </Link>
        <div className="search">
          <form>
            <input
              type="text"
              name="pilotSearch"
              id="pilotSearch"
              value={formData.pilotSearch}
              placeholder="Pilot ID or Name"
              onChange={changeHandler}
            />
            <button
              onClick={(event) => {
                void onGet(event);
              }}
            >
              Get Pilot
            </button>
          </form>
        </div>
      </div>

      {response === "" ? (
        pilots.map((pilot) => {
          return (
            <div className="pilotItem" key={pilot.id}>
              <span>
                {pilot.name}
                {pilot.id === 0 ? "" : `, Team: ${pilot.team?.name || "N/A"}`}
              </span>
              <Link className="button" to={`/pilot/${pilot.id}`}>
                Update
              </Link>
              <button
                className="button delete"
                onClick={() => {
                  toggleModal();
                  setSelectedPilot(pilot);
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
