import React, { useState, useEffect } from "react";
import axios from "axios";
import "./updateForm.css";
import Modal from "react-bootstrap/Modal";
import { Form, Image } from "react-bootstrap";
import { toast } from "sonner";
import Cookies from "js-cookie";

import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

function UpdateFormModal({ recordToUpdate, rootDomain }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // console.log(recordToUpdate.domain === rootDomain.domain);

  const [record, setRecord] = useState({
    domain: "",
    subdomain: "",
    type: "A",
    value: "",
    ttl: 0,
    priority: undefined,
    weight: undefined,
    port: undefined,
    target: "",
    keyTag: undefined,
    algorithm: undefined,
    digestType: undefined,
    digest: "",
  });

  const navigate = useNavigate();

  let sub = recordToUpdate.domain.split(".");

  sub.splice(0, 1);

  // console.log(sub, rootDomain.domain);

  //check for domain is same as rootDomain
  // if(sub.length <= 1){
  //   sub = rootDomain.domain.split('.')
  //   setRecord({
  //     ...record,
  //     domain: ""
  //   })
  // }
  // console.log(sub);

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [placeholder, setPlaceholder] = useState("");

  // console.log(recordToUpdate);
  useEffect(() => {
    if (recordToUpdate.domain === rootDomain.domain) {
      setRecord({
        domain: rootDomain.domain,
        subdomain: "",
        type: recordToUpdate.type,
        value: recordToUpdate.value,
        ttl: recordToUpdate.ttl,
      });
    }else{
      setRecord({
        subdomain: recordToUpdate.domain.split(".")[0],
        type: recordToUpdate.type,
        value: recordToUpdate.value,
        ttl: recordToUpdate.ttl,
      })

    }
    // console.log(recordToUpdate.ResourceRecords.Value[0]);
  }, [recordToUpdate]);

  // useEffect(() => {
  //   if (record.type !== "MX") {
  //     setRecord((prevValues) => ({ ...prevValues, priority: 0 }));
  //   }

  //   if (record.type !== "SRV") {
  //     setRecord((prevValues) => ({
  //       ...prevValues,
  //       weight: 0,
  //       port: 0,
  //       target: "",
  //     }));
  //   }

  //   if (record.type !== "DS") {
  //     setRecord((prevValues) => ({
  //       ...prevValues,
  //       keyTag: 0,
  //       algorithm: 0,
  //       digestType: 0,
  //       digest: "",
  //     }));
  //   }
  // }, [record.type]);

  useEffect(() => {
    if (record.type === "MX") {
      setRecord((prevValues) => ({
        ...prevValues,
        priority: recordToUpdate.priority,
      }));
    }

    if (record.type === "SRV") {
      setRecord((prevValues) => ({
        ...prevValues,
        weight: recordToUpdate.weight,
        port: recordToUpdate.port,
        target: recordToUpdate.target,
      }));
    }

    if (record.type === "DS") {
      setRecord((prevValues) => ({
        ...prevValues,
        keyTag: recordToUpdate.keyTag,
        algorithm: recordToUpdate.keyTag,
        digestType: recordToUpdate.digestType,
        digest: recordToUpdate.digest,
      }));
    }
  }, [record.type]);

  const handleInputChange = (prop) => (e) => {
    // const { name, value } = e.target;

    setRecord({
      ...record,
      [prop]: e.target.value,
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

  // console.log(`${record.subdomain}.${sub[0]}.${sub[1]}`);

  // console.log(sub[1]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = Cookies.get("token").toString();
    const hostedZoneId = Cookies.get("HostedZoneId").toString();

    try {
      // if (!record.subdomain) {
      //   toast.error("Error: domain is required", { position: "top-right" });
      //   setSuccess(false);
      //   return;
      // }
      let subdomain = record.subdomain.split('.');

      let newDomain = subdomain.length >= 1 ? `${record.subdomain}.${record.domain}` : `${subdomain}.${rootDomain.domain}`
      console.log(domain);

      const filteredRecord = {
        domain: newDomain,
        ...record,
      };
      // let filteredRecord;

      // if (recordToUpdate.domain === rootDomain.domain) {
      //   filteredRecord = {
      //     domain: `${record.subdomain}.${sub[0]}.${sub[1]}`,
      //     ...record,
      //   };
      //   console.log(filteredRecord.domain);
      // }

      console.log("filter records", filteredRecord);



      console.log('record', record);

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/domain/records/${recordToUpdate._id}`,
        {
          record: filteredRecord,
          hostedZoneId: hostedZoneId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      setMessage(response.data.message);
      setSuccess(true);
      toast.success(response.data.message, {
        position: "top-right",
      });

      setRecord({
        domain: "",
        subdomain: "",
        type: "A",
        value: "",
        ttl: 0,
        priority: 0,
        weight: 0,
        port: 0,
        target: "",
        keyTag: 0,
        algorithm: 0,
        digestType: 0,
        digest: "",
      });

      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage();
        toast.error("Error: DNS record already exists", {
          position: "top-right",
        });
      } else {
        toast.error("Error: Unable to update DNS record", {
          position: "top-right",
        });
      }
      console.error("Error updating DNS record:", error);
    }
  };
  // console.log(recordToUpdate);

  const checkRecord = () => {
    const filteredRecord = {
      domain: `${record.subdomain}.${sub[0]}.${sub[1]}`,
      ...record,
    };
    console.log("record length", filteredRecord.length);

    console.log("filter records", filteredRecord);
  };

  return (
    <>
      <Button className="update-button" variant="light"  onClick={handleShow}>

      <Image rounded src="https://raw.githubusercontent.com/ptech12/dns-manager/main/src/assets/pencil.svg" alt="pencil" width={25} height={25}  className="primary" />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update DNS Record</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            {success && <p className="success-message">{message}</p>}
            {!success && message && <p className="error-message">{message}</p>}
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
              Subdomain
            </label>
            <Form.Text>
            Keep blank to create a record for the root domain.
            </Form.Text>

            <div className="input-group mb-3">
              <input
                id="domain"
                type="text"
                name="subdomain"
                value={record.subdomain}
                onChange={handleInputChange("subdomain")}
                className="form-control"
                aria-label="domain"
                aria-describedby="basic-addon2"
              />

              <span className="input-group-text" id="basic-addon2">
                {sub.length <= 0 ? sub.join(".") : rootDomain.domain}
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

            <label htmlFor="ttl" className="form-label">
              Time to Live:
            </label>
            <input
              type="text"
              name="ttl"
              id="ttl"
              value={record.ttl}
              onChange={handleInputChange("ttl")}
              onFocus={handleFocus}
              placeholder={placeholder}
              required
            />
            <Form.Text>
            Recommended values: 60 to 172800 (two days)
            </Form.Text>
            
            <br />


            {/* <div className="grid grid-cols-2 gap-4"> */}
            {
              // Priority field if type = "MX"
              record.type === "MX" && (
                <>
                {/* <label className="form-label" htmlFor="priority">
                  Priority
                </label> */}
                <Form.FloatingLabel>
                  Priority
                </Form.FloatingLabel>
                  
                  <Form.Control
                    id="priority"
                    type="number"
                    min="0"
                    max="65535"
                    placeholder="0-65535"
                    onChange={handleInputChange("priority")}
                    onFocus={handleFocus}
                    value={record?.priority}
                  />

                </>


              )
            }

            {record.type === "SRV" && (
              <>
                <label className="form-label" htmlFor="weight">
                  Weight
                  <input
                    id="weight"
                    type="number"
                    min="0"
                    placeholder="Weight"
                    onChange={handleInputChange("weight")}
                    value={record.weight}
                  />
                </label>

                <label className="form-label" htmlFor="port">
                  Port
                  <input
                    id="port"
                    type="number"
                    min="0"
                    placeholder="Port"
                    onChange={handleInputChange("port")}
                    value={record.port}
                  />
                </label>

                <label className="form-label" htmlFor="target">
                  Target
                  <input
                    id="target"
                    placeholder="Target"
                    onChange={handleInputChange("target")}
                    value={record.target}
                  />
                </label>
              </>
            )}
            {/* </div> */}

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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
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
