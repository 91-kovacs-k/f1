import { useState, useEffect } from "react";
import { getPilots, getPilot, deletePilot } from "./utils";
import { Link } from "react-router-dom";
import Modal from "../Modal";

export default function Pilot() {
  const [pilots, setPilots] = useState([]);
  const [formData, setFormData] = useState({
    pilotSearch: "",
  });
  const [response, setResponse] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPilot, setSelectedPilot] = useState();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getPilots();
    if (data.reason) {
      setResponse(`Error while loading pilots: ${data.reason}`);
      setFormData({ teamSearch: "" });
      return;
    }
    setPilots(data);
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
          <h1 className="msg">
            Would you like to delete {selectedPilot.name}?
          </h1>
          <div className="buttons">
            <Link
              className="button delete"
              onClick={async () => {
                const data = await deletePilot(selectedPilot.id);
                if (data.reason) {
                  toggleModal();
                  setResponse(`Error while deleting pilot: ${data.reason}`);
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
              onClick={async (event) => {
                event.preventDefault();
                const data = await getPilot(formData.pilotSearch);
                if (data.reason) {
                  setResponse(`Error while loading pilot: ${data.reason}`);
                } else if (Array.isArray(data)) {
                  setPilots(data);
                  setResponse("");
                } else {
                  setPilots([data]);
                  setResponse("");
                }
                setFormData({ pilotSearch: "" });
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
