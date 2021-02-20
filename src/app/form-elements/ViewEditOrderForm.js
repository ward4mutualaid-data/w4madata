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
    order: undefined,
    title: `Order #${this.props.match.params.order_id}`
  };


  async getAirtableOrder(orderId) {

    const apiName = 'w4madata';
    const path = `/orders?order_id=${orderId}`;
    const apiParameters = { };


    const order = await API
      .get(apiName, path, apiParameters)
      .then(response => {
        return response.body.records[0].fields
      })
      .catch(error => {
        console.log("ERROR RETRIEVING DATA", error)
        console.log(error.response);
     });

    this.setState({order})
  }

  async componentDidMount(){
    const orderId = this.props.match.params.order_id
    await this.getAirtableOrder(orderId)
  }

render(){

  // waits to render the page until we have data
 if (!this.state.order) {
    return <div />
     }

 console.log("orderId=", this.props.match.params.order_id)
 return  (

   <div>

   <OrderForm {...this.state}/>
   </div>

 )
}



}

export default ViewEditOrderForm
