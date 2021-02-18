import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import CustomGeocoder from './Geocoder';
import OrderForm from './OrderForm'
// import OrderSearchBar from './OrderSearchBar'
import { API } from 'aws-amplify';


export class ViewEditOrderForm extends Component {
  state = {
    startDate: new Date(),
    edit: false,
    order: {},
    title: "View or edit an order"
  };


  async getAirtableOrder(orderId) {

    const apiName = 'w4madata';
    const path = `/order/${orderId}`;
    const apiParameters = { };


    const order = await API
      .get(apiName, path, apiParameters)
      .then(response => {
        console.log("retrieved response from airtable", response)
        return response.data.body.records
      })
      .catch(error => {
        console.log("ERROR RETRIEVING DATA", error)
        console.log(error.response);
     });

    this.setState({order})
  }

  async componentDidMount(){
    const orderId = this.props.match.params.order_id
    console.log("fetching from api.. orderId=", orderId)
    await this.getAirtableOrder(orderId)

  }

render(){
console.log("f orderId=", this.props.match.params.order_id)
 return  (

   <div>

   <h2>  Order #{this.props.match.params.order_id} </h2>
   <OrderForm {...this.state}/>
   </div>

 )
}



}

export default ViewEditOrderForm
