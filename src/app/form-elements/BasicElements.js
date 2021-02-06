import React from "react";
import { Breadcrumb, Button, Card, Col, Form, Nav, Row } from "react-bootstrap";
import { useFormik } from "formik";
import CustomGeocoder from "./Geocoder";

const addNeighbor = (values) => {
  const Airtable = require("airtable");
  const airtableBase = new Airtable({
    apiKey: process.env.REACT_APP_AIRTABLE_API_KEY,
  }).base(process.env.REACT_APP_AIRTABLE_NEIGHBOR_BASE);

  const allowed_keys = [
    "first_name",
    "last_name",
    "number_children",
    "children_ages",
    "number_adults",
    "language",
    "phone_number",
    "phone_type",
    "alternate_phone_number",
    "alternate_phone_type",
    "alternate_contact_name",
    "delivery_preference_day",
    "delivery_preference_late_night",
  ];
  let payload = {};
  const ignore_vals = [undefined, NaN, "", null, []];
  const list_keys = ["language"];
  for (let key of allowed_keys) {
    const val = values[key];

    if (!ignore_vals.includes(val)) {
      if (list_keys.includes(key)) {
        payload[key] = [val];
      } else {
        payload[key] = val;
      }
    }
  }

  console.log("Payload to Airtable Neighbors", payload);

  airtableBase("neighbors").create(
    [{ fields: payload }],
    function (err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function (record) {
        console.log(record.getId());
      });
    }
  );
};

const IntakeForm = () => {
  const formik = useFormik({
    initialValues: {
      additional_add_ons: "",
      alternate_contact_name: "",
      alternate_phone_number: "",
      alternate_phone_type: "",
      canned_food_ok: true,
      children_ages: "",
      delivery_date: "",
      delivery_preference_day: "",
      delivery_preference_late_night: "",
      diaper_brand: "",
      diaper_size: null,
      dietary_restrictions: "",
      email_address: "",
      first_name: "",
      is_urgent: false,
      language: "english",
      last_name: "",
      number_adults: 1,
      number_children: 0,
      phone_number: "",
      phone_type: "mobile",
    },
    onSubmit: (values) => {
      addNeighbor(values);
    },
  });

  return (
    <div>
      {/* begin page */}
      <div className="page-header">
        <h3 className="page-title"> New Order Intake </h3>
        <Nav aria-label="breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item
              href="!#"
              onClick={(event) => event.preventDefault()}
            >
              Forms
            </Breadcrumb.Item>
            <Breadcrumb.Item active aria-current="page">
              New Order Intake
            </Breadcrumb.Item>
          </Breadcrumb>
        </Nav>
      </div>
      <Form onSubmit={formik.handleSubmit}>
        <Row>
          {/* begin first row */}
          <div className="col-md-6 grid-margin stretch-card">
            <Card>
              <Card.Body>
                <Card.Title>Contact information</Card.Title>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="first_name">
                      <Form.Label>First name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="First name"
                        {...formik.getFieldProps("first_name")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="last_name">
                      <Form.Label>Last name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Last name"
                        {...formik.getFieldProps("last_name")}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group controlId="email_address">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Email address"
                        {...formik.getFieldProps("email_address")}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* TODO: Make this a component */}
                <Form.Group controlId="language">
                  <Form.Label>Preferred language</Form.Label>
                  <Form.Control
                    as="select"
                    {...formik.getFieldProps("language")}
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="row">
                  <Col md={6}>
                    <Form.Group controlId="phone_number">
                      <Form.Label>Primary phone number</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Primary phone number"
                        {...formik.getFieldProps("phone_number")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <br />
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          onChange={formik.handleChange}
                          className="form-check-input"
                          name="phone_type"
                          id="primaryMobile"
                          value="mobile"
                          defaultChecked
                        />
                        Mobile
                        <i className="input-helper"></i>
                      </label>
                    </div>
                  </Col>
                  <Col md={3}>
                    <br />
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          onChange={formik.handleChange}
                          className="form-check-input"
                          name="phone_type"
                          id="primaryLandline"
                          value="landline"
                        />
                        Landline
                        <i className="input-helper"></i>
                      </label>
                    </div>
                  </Col>
                </Form.Group>

                <Form.Group className="row">
                  <Col md={6}>
                    <Form.Group controlId="alternate_phone_number">
                      <Form.Label>Alternate phone number</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Alternate phone number"
                        {...formik.getFieldProps("alternate_phone_number")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <br />
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          onChange={formik.handleChange}
                          className="form-check-input"
                          name="alternate_phone_type"
                          id="alternateMobile"
                          value="mobile"
                        />
                        Mobile
                        <i className="input-helper"></i>
                      </label>
                    </div>
                  </Col>
                  <Col md={3}>
                    <br />
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          onChange={formik.handleChange}
                          className="form-check-input"
                          name="alternate_phone_type"
                          id="alternateLandline"
                          value="landline"
                        />
                        Landline
                        <i className="input-helper"></i>
                      </label>
                    </div>
                  </Col>
                </Form.Group>

                <Form.Group controlId="alternate_contact_name">
                  <Form.Label>Alternate contact name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Alternate contact name"
                    {...formik.getFieldProps("alternate_contact_name")}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </div>

          <div className="col-md-6 grid-margin stretch-card">
            <Card>
              <Card.Body>
                <Card.Title>Delivery details</Card.Title>
                <Row>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>
                        Urgent delivery?
                        <Form.Check
                          type="checkbox"
                          name="is_urgent"
                          {...formik.getFieldProps("is_urgent")}
                        ></Form.Check>
                      </Form.Label>
                    </Form.Group>
                  </Col>
                  <Col md={9}>
                    <Form.Group controlId="delivery_date">
                      <Form.Label>
                        Desired delivery date (must be a Wednesday or Saturday)
                      </Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="Desired delivery date"
                        {...formik.getFieldProps("delivery_date")}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group controlId="number_adults">
                      <Form.Label>Number of adults</Form.Label>
                      <Form.Control
                        type="number"
                        step="1"
                        min="0"
                        placeholder="Number of adults"
                        {...formik.getFieldProps("number_adults")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="number_children">
                      <Form.Label>Number of children</Form.Label>
                      <Form.Control
                        type="number"
                        step="1"
                        min="0"
                        placeholder="Number of children"
                        {...formik.getFieldProps("number_children")}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Group controlId="children_ages">
                      <Form.Label>
                        Children's ages (leave blank if not applicable)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="8, 10, 15"
                        {...formik.getFieldProps("children_ages")}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={3}>Delivery day preference</Col>
                  <Form.Group>
                    <Form.Label>
                      <Form.Check
                        type="checkbox"
                        name="delivery_preference_day"
                        value="wednesday"
                        label="Wednesday"
                        {...formik.getFieldProps("delivery_preference_day")}
                      ></Form.Check>
                    </Form.Label>
                    <Form.Label>
                      <Form.Check
                        type="checkbox"
                        name="delivery_preference_day"
                        value="saturday"
                        label="Saturday"
                        {...formik.getFieldProps("delivery_preference_day")}
                      ></Form.Check>
                    </Form.Label>
                  </Form.Group>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group controlId="dietary_restrictions">
                      <Form.Label>
                        Dietary restrictions (leave blank if none)
                      </Form.Label>
                      <Form.Control
                        type="textarea"
                        placeholder="No dairy, ..."
                        {...formik.getFieldProps("dietary_restrictions")}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>
                        Canned food OK?
                        <Form.Check
                          type="checkbox"
                          name="canned_food_ok"
                          {...formik.getFieldProps("canned_food_ok")}
                        ></Form.Check>
                      </Form.Label>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId="diaper_size">
                      <Form.Label>Diaper size</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="0"
                        {...formik.getFieldProps("diaper_size")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="diaper_brand">
                      <Form.Label>Diaper brand</Form.Label>
                      <Form.Control
                        type="test"
                        placeholder="Diaper brand"
                        {...formik.getFieldProps("diaper_brand")}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        </Row>
        {/* end first row */}
        <Row>
          <Card.Body id="geocoder-h4">
            <Card.Title>Delivery location</Card.Title>
          </Card.Body>
          <div className="col-md-12 grid-margin stretch-card">
            <Card>
              <Card.Body>
                <CustomGeocoder />
              </Card.Body>
            </Card>
          </div>
        </Row>
        <Button variant="primary" type="submit" size="lg" block>
          Submit
        </Button>
      </Form>
      {/* end page*/}
    </div>
  );
};

export default IntakeForm;
