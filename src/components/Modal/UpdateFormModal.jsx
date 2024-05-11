import React, { useState, useEffect } from "react";
import axios from "axios";
import "./updateForm.css";
import Modal from "react-bootstrap/Modal";
import { Form, InputGroup } from "react-bootstrap";
import { toast } from "sonner";
import Cookies from "js-cookie";

import Button from "react-bootstrap/Button";

function UpdateFormModal({ recordToUpdate }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [record, setRecord] = useState({
    subdomain: "",
    type: "",
    value: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [placeholder, setPlaceholder] = useState("");

  console.log(recordToUpdate);
  useEffect(() => {
    if (recordToUpdate) {
      setRecord({
        subdomain: recordToUpdate.domain.split(".")[0],
        type: recordToUpdate.type,
        value: recordToUpdate.value,
      });
    }
  }, [recordToUpdate]);

  const handleInputChange = (prop) => (e) => {
    // const { name, value } = e.target;
    const value = prop === "ttl" ? parseInt(e.target.value) : e.target.value;

    setRecord({
      ...record,
      [prop]: value,
    });
  };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setRecord((prevRecord) => ({
      ...prevRecord,
      type: selectedType,
      value: "",
    }));

    setPlaceholder(getPlaceholder(selectedType));
  };

  const getPlaceholder = (type) => {
    switch (type) {
      case "A":
        return "e.g., 192.0.2.1";
      case "AAAA":
        return "e.g., 2001:0db8::8a2e:0370:bab5";
      case "CNAME":
        return "e.g., www.example.com";
      case "MX":
        return "e.g., 10 mail.example.com";
      case "NS":
        return "e.g., ns1.example.com";
      case "PTR":
        return "e.g., www.example.com";
      case "SOA":
        return "e.g., ns1.example.com hostmaster.example.com 2024013101 7200 3600 1209600 3600";
      case "SRV":
        return "e.g., 1 10 3783 server.example.com";
      case "TXT":
        return 'e.g., "sample text"';
      case "DNSSEC":
        return "e.g., 12345 3 1 1 123456789 abcdef67890123456789abcdef6789";
      default:
        return "";
    }
  };

  const handleFocus = () => {
    setPlaceholder("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!record.subdomain) {
        setMessage("Error: domain is required");
        setSuccess(false);
        return;
      }

      const filteredRecord = {
        name: `${record.subdomain}.com`,
        type: record.type,
        value: record.value,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/dns-records/${recordToUpdate.Name}`,
        filteredRecord
      );
      setMessage(response.data.message);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage("Error: DNS record already exists");
      } else {
        setMessage("Error: Unable to update DNS record");
      }
      console.error("Error updating DNS record:", error);
      setSuccess(false);
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  return (
    <>
      <button className="update-button" onClick={handleShow}>
        {" "}
        Update{" "}
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update DNS Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {success && <p className="success-message">{message}</p>}
          {!success && message && <p className="error-message">{message}</p>}
          <form onSubmit={handleSubmit}>
            {/* <label className="form-label" htmlFor="subdomain">Domain</label>
                <input
                  type="text"
                  name="subdomain"
                  value={record.subdomain}
                  onChange={handleInputChange("subdomain")}
                  required
                  className="form-control"
                />
                <span className="input-group-text" id="basic-addon2">
                  .com
                </span> */}
            <label htmlFor="domain" className="form-label">
              Domain
            </label>
            <div className="input-group mb-3">
              <input
              id="domain"
                  type="text"
                  name="subdomain"
                  value={record.subdomain}
                  onChange={handleInputChange("subdomain")}
                  required
                  className="form-control"
                aria-label="domain"
                aria-describedby="basic-addon2"
              />
              <span className="input-group-text" id="basic-addon2">
                .com
              </span>
            </div>

            <label className="form-label">Record Type</label>
            <label>
              <select
                name="type"
                value={record.type}
                onChange={handleInputChange("type")}
                required
                className="form-select"
              >
                <option value={record.type}>{record.type}</option>
                <option value="A">A (Address) Record</option>
                <option value="AAAA">AAAA (IPv6 Address) Record</option>
                <option value="CNAME">CNAME (Canonical Name) Record</option>
                <option value="MX">MX (Mail Exchange) Record</option>
                <option value="NS">NS (Name Server) Record</option>
                <option value="PTR">PTR (Pointer) Record</option>
                <option value="SOA">SOA (Start of Authority) Record</option>
                <option value="SRV">SRV (Service) Record</option>
                <option value="TXT">TXT (Text) Record</option>
                <option value="DNSSEC">DNSSEC</option>
              </select>
            </label>

            <label htmlFor="Value" className="form-label">
              Value:
              </label>
              <input
                type="text"
                name="value"
                id="Value"
                value={record.value}
                onChange={handleInputChange("value")}
                onFocus={handleFocus}
                placeholder={placeholder}
                required
              />
            {/* <button type="submit">Update Record</button> */}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateFormModal;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./updateForm.css";
// import Modal from "react-bootstrap/Modal";
// import { toast } from "sonner";
// import Cookies from "js-cookie";

// const UpdateFormModal = ({ recordToUpdate, onClose }) => {

//   return (
//     <>
//       <button className="update-button">Update</button>

//       <Modal
//         show={show}
//         onHide={handleClose}
//         backdrop="static"
//         keyboard={false}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Update DNS Record</Modal.Title>

//           <Modal.Body>
//             <h2>Update Record</h2>

//           </Modal.Body>
//         </Modal.Header>
//       </Modal>
//     </>
//   );
// };

// export default UpdateFormModal;