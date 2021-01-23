import React, { Component } from 'react';
import { Breadcrumb, Button, Card, Col, Form, Nav, Row } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';
import CustomGeocoder from './Geocoder';

export class BasicElements extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /* TODO:  this should only permit wednesday and saturday selections */
  handleChange = event => {
    console.log("CHANGE", event.target.id, event.target.value);
    this.setState({
      [event.target.id]: event.target.value
    });
  };
  
  handleSubmit(event) {
    console.log("SUBMIT", this.state);
    event.preventDefault();
    event.stopPropagation();
  }

  componentDidMount() {
    bsCustomFileInput.init()
  }

  render() {
    return (
      <div> {/* begin page */}
        <div className="page-header">
          <h3 className="page-title"> New Order Intake </h3>
          <Nav aria-label="breadcrumb">
            <Breadcrumb>
              <Breadcrumb.Item href="!#" onClick={event => event.preventDefault()}>Forms</Breadcrumb.Item>
              <Breadcrumb.Item active aria-current="page">New Order Intake</Breadcrumb.Item>
            </Breadcrumb>
          </Nav>
        </div>

        <Form onSubmit={this.handleSubmit}>
          <Row> {/* begin first row */}
            <div className="col-md-6 grid-margin stretch-card">
              <Card>
                <Card.Body>
                  <Card.Title>Basic information</Card.Title>

                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="firstName">
                          <Form.Label>First name</Form.Label>
                          <Form.Control  type="text" onChange={this.handleChangeGeneric} placeholder="First name"/>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="lastName">
                          <Form.Label>Last name</Form.Label>
                          <Form.Control type="text" onChange={this.handleChangeGeneric} placeholder="Last name"/>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="emailAddress">
                          <Form.Label>Email address</Form.Label>
                          <Form.Control type="email" onChange={this.handleChangeGeneric} placeholder="Email address"/>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group controlId="deliveryDate">
                      <Form.Label htmlFor="deliveryDate">Desired delivery date (must be a Wednesday or Saturday)</Form.Label>
                      <Form.Control type="date" onChange={this.handleChangeGeneric} placeholder="Desired delivery date" />
                    </Form.Group>

                    <Form.Group className="row">
                      <label className="col-sm-4 col-form-label">Preferred language</label>
                      <div className="col-sm-3">
                        <div className="form-check">
                          <label className="form-check-label">
                            <input type="radio" onChange={this.handleChangeLanguage} className="form-check-input" name="preferredLanguage" id="languageEnglish" defaultChecked /> English
                            <i className="input-helper"></i>
                          </label>
                        </div>
                      </div>
                      <div className="col-sm-3">
                        <div className="form-check">
                          <label className="form-check-label">
                            <input type="radio" onChange={this.handleChangeLanguage} className="form-check-input" name="preferredLanguage" id="languageSpanish" /> Spanish
                            <i className="input-helper"></i>
                          </label>
                        </div>
                      </div>
                    </Form.Group>

                    <Form.Group className="row">
                      <Col md={6}>
                        <Form.Group controlId="primaryPhoneNumber">
                          <Form.Label>Primary phone number</Form.Label>
                          {/* TODO UPDATE HANDLER */}
                          <Form.Control type="tel" onChange={this.handleChangeGeneric} placeholder="Primary phone number" />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <br />
                        <div className="form-check">
                          <label className="form-check-label">
                            <input type="radio" onChange={this.handleChangeGeneric} className="form-check-input" name="primaryPhoneType" id="primaryMobile" defaultChecked /> Mobile
                            <i className="input-helper"></i>
                          </label>
                        </div>
                      </Col>
                      <Col md={3}>
                        <br />
                        <div className="form-check">
                          <label className="form-check-label">
                            <input type="radio" onChange={this.handleChangeGeneric} className="form-check-input" name="primaryPhoneType" id="primaryLandline" /> Landline
                            <i className="input-helper"></i>
                          </label>
                        </div>
                      </Col>
                    </Form.Group>

                    <Form.Group className="row">
                      <Col md={6}>
                        <Form.Group controlId="alternatePhoneNumber">
                          <Form.Label>Alternate phone number</Form.Label>
                          {/* TODO UPDATE HANDLER */}
                          <Form.Control type="tel" onChange={this.handleChangeGeneric} placeholder="Alternate phone number" />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <br />
                        <div className="form-check">
                          <label className="form-check-label">
                            <input type="radio" onChange={this.handleChangeGeneric} className="form-check-input" name="alternatePhoneType" id="alternateMobile" defaultChecked /> Mobile
                            <i className="input-helper"></i>
                          </label>
                        </div>
                      </Col>
                      <Col md={3}>
                        <br />
                        <div className="form-check">
                          <label className="form-check-label">
                            <input type="radio" onChange={this.handleChangeGeneric} className="form-check-input" name="alternatePhoneType" id="alternateLandline" /> Landline
                            <i className="input-helper"></i>
                          </label>
                        </div>
                      </Col>
                    </Form.Group>

                    <div className="form-check">
                      <label className="form-check-label text">
                        <input type="checkbox" onChange={this.handleChangeUrgent} className="form-check-input" id="isUrgent"/>
                        <i className="input-helper"></i>
                        Urgent delivery?
                      </label>
                    </div>

                </Card.Body>
              </Card>
            </div>

            <div className="col-md-6 grid-margin stretch-card">
              <Card>
                <Card.Body>
                  <Card.Title>Family information</Card.Title>

                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="numAdults">
                          <Form.Label>Number of adults</Form.Label>
                          <Form.Control type="number" onChange={this.handleChangeGeneric} step="1" min="0" placeholder="Number of adults"/>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="numChildren">
                          <Form.Label>Number of children</Form.Label>
                          <Form.Control type="number" onChange={this.handleChangeGeneric} step="1" min="0" placeholder="Number of children"/>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <Form.Group controlId="childrenAges">
                          <Form.Label>Children's ages (leave blank if not applicable)</Form.Label>
                          <Form.Control type="text" onChange={this.handleChangeGeneric} placeholder="8, 10, 15"/>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group controlId="dietaryRestrictions">
                          <Form.Label>Dietary restrictions (leave blank if none)</Form.Label>
                          <Form.Control type="textarea" onChange={this.handleChangeGeneric} placeholder="No dairy, ..."/>
                        </Form.Group>
                      </Col>
                    </Row>

                </Card.Body>
              </Card>
            </div>
          </Row> {/* end first row */}

          <Row>
            <Card.Body id="geocoder-h4">
              <Card.Title>Delivery location</Card.Title>
            </Card.Body>
            <div className="col-md-12 grid-margin stretch-card">

              <Card>
                <Card.Body>
                  <CustomGeocoder/>
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
    )
  }
}

export default BasicElements
