import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import CustomGeocoder from './Geocoder';
import OrderForm from './OrderForm'
// import OrderSearchBar from './OrderSearchBar'

export class ViewEditOrderForm extends Component {
  state = {
    startDate: new Date(),
    edit: false,
    order: {first_name: "anna", last_name: "petrone"},
    title: "View or edit an order"
  };

render(){
 return  (

   <div>

   <OrderForm {...this.state}/>
   </div>

 )
}



}

export default ViewEditOrderForm
