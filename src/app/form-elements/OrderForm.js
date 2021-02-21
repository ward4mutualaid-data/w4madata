import React from "react";
import { Breadcrumb, Button, Card, Col, Form, Nav, Row } from "react-bootstrap";
import { Formik, useField } from "formik";
import CustomGeocoder from "./Geocoder";
import * as Yup from "yup";

// TODO: Add validation error display to checkbox fields

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

const orderAirtable = new AirtableAPI(
  process.env.REACT_APP_AIRTABLE_API_KEY,
  process.env.REACT_APP_AIRTABLE_ORDER_BASE,
  "orders",
  [
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
    "delivery_day_saturday_ok",
    "delivery_day_wednesday_ok",
    "delivery_preference_late_night",
    "additional_add_ons",
    "canned_food_ok",
    "diaper_brand",
    "diaper_size",
    "dietary_restrictions",
    "is_urgent",
  ]
);

const ReactBootstrapCheckbox = ({ children, ...props }) => {
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

const ReactBootstrapTextInputGroup = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <Form.Group controlId={props.name}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={props.type || "text"}
        placeholder={props.placeholder || label}
        isInvalid={!!meta.error}
        {...field}
        {...props}
      />
      <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
    </Form.Group>
  );
};

function processValues(values) {
  const listKeys = ["language"];
  for (let key in values) {
    if (listKeys.includes(key)) {
      values[key] = [values[key]];
    }
  }
  return values;
}

const OrderForm = () => {
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
        diaper_size: "",
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
      validationSchema={Yup.object({
        first_name: Yup.string().required("Required"),
        last_name: Yup.string().required("Required"),
        email_address: Yup.string(),
        language: Yup.string().required(),
        phone_number: Yup.string(),
        phone_type: Yup.string().oneOf(["mobile", "landline"]),
        alternate_phone_number: Yup.string(),
        alternate_phone_type: Yup.string().oneOf(["mobile", "landline"]),
        alternate_contact_name: Yup.string(),
        is_urgent: Yup.boolean(),
        delivery_day_saturday_ok: Yup.boolean(),
        delivery_day_wednesday_ok: Yup.boolean(),
        delivery_preference_late_night: Yup.boolean(),
        diaper_size: Yup.string(),
        diaper_brand: Yup.string().when("diaper_size", {
          is: (value) => !!value,
          then: Yup.string().required("Required if diaper size is selected"),
          otherwise: Yup.string(),
        }),
        number_adults: Yup.number()
          .min(1, "Must be at least 1 adult")
          .required(),
        number_children: Yup.number(),
        children_ages: Yup.string(),
        additional_add_ons: Yup.string(),
        canned_food_ok: Yup.boolean(),
        dietary_restrictions: Yup.string(),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          orderAirtable
            .create(processValues(values))
            .then(function () {
              setSubmitting(false);
            })
            .catch(function (err) {
              console.error(err);
              alert(
                `Sorry, could not create Order record. Error ${err.statusCode}: ${err.error}. Details: ${err.message}`
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
                <ReactBootstrapTextInputGroup
                  label="First Name"
                  name="first_name"
                />
              </Col>
              <Col md={6}>
                <ReactBootstrapTextInputGroup
                  label="Last Name"
                  name="last_name"
                />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <ReactBootstrapTextInputGroup
                  label="Email"
                  name="email_address"
                  type="email"
                />
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
                <ReactBootstrapTextInputGroup
                  label="Primary phone number"
                  name="phone_number"
                  type="tel"
                />
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
                <ReactBootstrapTextInputGroup
                  label="Alternate phone number (optional)"
                  name="alternate_phone_number"
                  type="tel"
                />
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

            <ReactBootstrapTextInputGroup
              label="Alternate contact name (optional)"
              name="alternate_contact_name"
            />

            <Row>
              <Col md={2}>
                <ReactBootstrapCheckbox name="is_urgent">
                  Is urgent?
                </ReactBootstrapCheckbox>
              </Col>
              <Col md={4}>
                <ReactBootstrapTextInputGroup
                  label="Desired delivery date"
                  name="delivery_date"
                  type="date"
                />
              </Col>
              <Col md={2}>
                <ReactBootstrapCheckbox name="delivery_day_wednesday_ok">
                  Wednesday delivery OK?
                </ReactBootstrapCheckbox>
              </Col>
              <Col md={2}>
                <ReactBootstrapCheckbox name="delivery_day_saturday_ok">
                  Saturday delivery OK?
                </ReactBootstrapCheckbox>
              </Col>
              <Col md={2}>
                <ReactBootstrapCheckbox name="delivery_preference_late_night">
                  Late night delivery OK?
                </ReactBootstrapCheckbox>
              </Col>
            </Row>

            <Row>
              <Col md={3}>
                <ReactBootstrapTextInputGroup
                  label="Number of adults"
                  name="number_adults"
                  type="number"
                  step="1"
                  min="0"
                />
              </Col>
              <Col md={3}>
                <ReactBootstrapTextInputGroup
                  label="Number of children"
                  name="number_children"
                  type="number"
                  step="1"
                  min="0"
                />
              </Col>
              <Col md={6}>
                <ReactBootstrapTextInputGroup
                  label="Children's ages (optional)"
                  name="children_ages"
                  placeholder="8, 10, 15"
                />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <ReactBootstrapTextInputGroup
                  label="Dietary restrictions (optional)"
                  name="dietary_restrictions"
                  placeholder="No dairy, ..."
                />
              </Col>
              <Col md={6}>
                <ReactBootstrapTextInputGroup
                  label="Additional add-ons (optional)"
                  name="additional_add_ons"
                  placeholder="Extra cheese, ..."
                />
              </Col>
            </Row>

            <Row>
              <Col md={2}>
                <ReactBootstrapCheckbox name="canned_food_ok">
                  Canned food OK?
                </ReactBootstrapCheckbox>
              </Col>
              <Col md={2}>
                <ReactBootstrapTextInputGroup
                  label="Diaper size"
                  name="diaper_size"
                  type="number"
                  placeholder="0"
                />
              </Col>

              <Col md={4}>
                <ReactBootstrapTextInputGroup
                  label="Diaper brand"
                  name="diaper_brand"
                />
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

export default OrderForm;
