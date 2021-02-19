import React from "react";
import { Breadcrumb, Button, Card, Col, Form, Nav, Row } from "react-bootstrap";
import { Formik, useField } from "formik";
import CustomGeocoder from "./Geocoder";

// TODO: Move Airtable API to its own file
// TODO: Add validation for required fields 
// TODO: Add handling for language field

class AirtableAPI {
  constructor(apiKey, baseKey, baseName, allowedKeys) {
    const Airtable = require("airtable");
    this.airtableBase = new Airtable({
      apiKey: apiKey,
    }).base(baseKey);
    this.allowedKeys = allowedKeys;
    this.baseName = baseName;
    this.ignoreVals = [undefined, NaN, "", null, []];
    this.createdRecord = null;
  }

  preparePayload(values) {
    let payload = {};
    for (const key of this.allowedKeys) {
      const val = values[key];
      if (!this.ignoreVals.includes(val)) {
        payload[key] = val;
      }
    }
    return payload;
  }

  create(values) {
    this.createdRecord = null;
    const payload = this.preparePayload(values);
    return this.airtableBase(this.baseName).create(payload);
  }
}

const neighborAirtable = new AirtableAPI(
  process.env.REACT_APP_AIRTABLE_API_KEY,
  process.env.REACT_APP_AIRTABLE_NEIGHBOR_BASE,
  "neighbors",
  [
    "first_name",
    "last_name",
    "number_children",
    "children_ages",
    "number_adults",
    // "language",
    "phone_number",
    "phone_type",
    "alternate_phone_number",
    "alternate_phone_type",
    "alternate_contact_name",
    "delivery_day_saturday_ok",
    "delivery_day_wednesday_ok",
    "delivery_preference_late_night",
  ]
);

const orderAirtable = new AirtableAPI(
  process.env.REACT_APP_AIRTABLE_API_KEY,
  process.env.REACT_APP_AIRTABLE_ORDER_BASE,
  "orders",
  [
    "additional_add_ons",
    "canned_food_ok",
    "diaper_brand",
    "diaper_size",
    "dietary_restrictions",
    "is_urgent",
    "neighbor",
  ]
);

const Checkbox = ({ children, ...props }) => {
  const [field, meta] = useField({ ...props, type: "checkbox" });
  return (
    <Form.Group>
      <Form.Label>
        {children}
        <Form.Check type="checkbox" {...field} {...props}></Form.Check>
      </Form.Label>
    </Form.Group>
  );
};

const IntakeForm = () => {
  return (
    <Formik
      initialValues={{
        additional_add_ons: "",
        alternate_contact_name: "",
        alternate_phone_number: "",
        alternate_phone_type: "",
        canned_food_ok: true,
        children_ages: "",
        delivery_date: "",
        delivery_day_saturday_ok: true,
        delivery_day_wednesday_ok: true,
        delivery_preference_late_night: false,
        diaper_brand: "",
        diaper_size: 0,
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
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          neighborAirtable
            .create(values)
            .then(function (record) {
              const neighbor_id = record.getId();
              values["neighbor"] = [neighbor_id];
              orderAirtable
                .create(values)
                .then(function () {
                  setSubmitting(false);
                })
                .catch(function (err) {
                  console.error(err);
                  alert(
                    `Sorry, could not create Order record. Error ${err.statusCode}: ${err.error}. Details: ${err.message}`
                  );
                });
            })
            .catch(function (err) {
              console.error(err);
              alert(
                `Sorry, could not create Neighbor record. Error ${err.statusCode}: ${err.error}. Details: ${err.message}`
              );
            });
        }, 5000);
      }}
    >
      {(formik) => (
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
              <Col md={6}>
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
              </Col>
            </Row>

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
                    placeholder="Alternate phone number (optional)"
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
                placeholder="Alternate contact name (optional)"
                {...formik.getFieldProps("alternate_contact_name")}
              />
            </Form.Group>

            <Row>
              <Col md={2}>
                <Checkbox name="is_urgent">Is urgent?</Checkbox>
              </Col>
              <Col md={4}>
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
              <Col md={2}>
                <Checkbox name="delivery_day_wednesday_ok">
                  Wednesday delivery OK?
                </Checkbox>
              </Col>
              <Col md={2}>
                <Checkbox name="delivery_day_saturday_ok">
                  Saturday delivery OK?
                </Checkbox>
              </Col>
              <Col md={2}>
                <Checkbox name="delivery_preference_late_night">
                  Late night delivery OK?
                </Checkbox>
              </Col>
            </Row>

            <Row>
              <Col md={3}>
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
              <Col md={3}>
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
              <Col md={6}>
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
              <Col md={6}>
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
              <Col md={6}>
                <Form.Group controlId="additional_add_ons">
                  <Form.Label>
                    Additional add-ons (leave blank if none)
                  </Form.Label>
                  <Form.Control
                    type="textarea"
                    placeholder="Extra cheese, ..."
                    {...formik.getFieldProps("additional_add_ons")}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={2}>
                <Checkbox name="canned_food_ok">Canned food OK?</Checkbox>
              </Col>
              <Col md={2}>
                <Form.Group controlId="diaper_size">
                  <Form.Label>Diaper size</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="0"
                    {...formik.getFieldProps("diaper_size")}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
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
      )}
    </Formik>
  );
};

export default IntakeForm;
