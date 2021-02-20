import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import CustomGeocoder from './Geocoder';

export class OrderForm extends Component {
  state = {
    startDate: new Date(),
    order: this.props.order,
    edit: this.props.edit,
    title: this.props.title
  };


  /*static getDerivedStateFromProps(props, state) {

      if (props.edit !== state.edit) {
        return {
          edit: props.edit
        };
      }
    }*/

  render() {
    const disabled = !this.state.edit
    const order = this.state.order
    console.log("inside component, order = ", order, "edit = ", this.state.edit)
    return (
      <div> {/* begin page */}
        <div className="page-header">
          <h3 className="page-title"> {this.state.title} </h3>
          { !this.state.edit ? (
            <button type="button" className="btn btn-primary"
               onClick={() => {
                 this.setState({ edit: true});
               }}
             >Edit
           </button>
         ) : (
           <button type="button" className="btn btn-success"
              onClick={() => {
                this.setState({ edit: false });
              }}
              >Save
            </button>)
          }
        </div>


        <div className="row"> {/* begin first row */}
          <div className="col-md-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Basic information</h4>

                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group >
                        <label className="col-form-label">First Name</label>
                        <div >
                        <Form.Control  type="text" className="form-control" id="firstName" placeholder="First name" value={order.first_name} disabled={disabled}/>
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group >
                        <label className="col-form-label">Last Name</label>
                        <div>
                        <Form.Control type="text" className="form-control" id="lastName" placeholder="Last name" value={order.last_name} disabled={disabled}/>
                        </div>
                      </Form.Group>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group >
                        <label className="col-form-label">Email address</label>
                        <div >
                        <Form.Control type="email" className="form-control" id="emailAddress" placeholder="Email address" value={order.email_address} disabled={disabled}/>
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group >
                        <label className="col-form-label">Phone number</label>
                        <div>
                        <Form.Control type="tel" className="form-control" id="phoneNumber" placeholder="Phone number" value={order.phone_number} disabled={disabled} />
                        </div>
                      </Form.Group>
                    </div>
                  </div>


                  <Form.Group>
                    <label htmlFor="deliveryDate">Desired delivery date (must be a Wednesday or Saturday)</label>
                    <Form.Control type="date" className="form-control" id="deliveryDate" placeholder="Desired delivery date" value={order.delivery_date} disabled={disabled} />
                  </Form.Group>



                  <Form.Group className="row">
                    <label className="col-sm-4 col-form-label">Preferred language</label>
                    <div className="col-sm-3">
                      <div className="form-check">
                        <label className="form-check-label">
                          <input type="radio" className="form-check-input" name="preferredLanguage" id="languageEnglish" checked={this.state.order.language==="english"} /> English
                          <i className="input-helper"></i>
                        </label>
                      </div>
                    </div>
                    <div className="col-sm-3">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input type="radio" className="form-check-input" name="preferredLanguage" id="languageSpanish"  checked={this.state.order.language==="spanish"}/> Spanish
                        <i className="input-helper"></i>
                      </label>
                    </div>
                    </div>
                  </Form.Group>

                  <div className="form-check">
                    <label className="form-check-label text">
                      <input type="checkbox" className="form-check-input" checked={order.is_urgent==="yes"} disabled={disabled}/>
                      <i className="input-helper"></i>
                      Urgent delivery?
                    </label>
                  </div>

              </div>
            </div>
          </div>

          <div className="col-md-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Family information</h4>

                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group >
                        <label className="col-form-label">Number of adults</label>
                        <div >
                        <Form.Control  type="number" step="1" min="0" className="form-control" id="numAdults" placeholder="Number of adults" value={order.num_adults} disabled={disabled}/>
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group >
                        <label className="col-form-label">Number of children</label>
                        <div >
                        <Form.Control  type="number" step="1" min="0" className="form-control" id="numChildren" placeholder="Number of children" value={order.num_children} disabled={disabled}/>
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <Form.Group >
                        <label className="col-form-label">Children's ages (leave blank if not applicable)</label>
                        <div >
                        <Form.Control  type="text"  className="form-control" id="childrenAges" placeholder="8, 10, 15" value={order.children_ages} disabled={disabled}/>
                        </div>
                      </Form.Group>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <Form.Group >
                        <label className="col-form-label">Dietary restrictions (leave blank if none)</label>
                        <div >
                        <Form.Control type="textarea" className="form-control" id="dietaryRestrictions" placeholder="No dairy, ..." value={order.dietary_restrictions} disabled={disabled}/>
                        </div>
                      </Form.Group>
                    </div>

                  </div>


              </div>
             </div>
           </div>
         </div> {/* end first row */}


         <div className="row">
         <div className="card-body" id="geocoder-h4">
         <h4 className="card-title">Delivery location</h4>
         </div>
           <div className="col-md-12 grid-margin stretch-card">

             <div className="card">
               <div className="card-body">
                <CustomGeocoder/>
                {/* TODO - show order.lon/lat on the map*/}
               </div>
             </div>

           </div>
         </div>

      {/* end page*/}
      </div>
    )
  }
}

export default OrderForm
