import React, { Component } from 'react'
import { ProgressBar } from 'react-bootstrap';
import awsmobile from '../../aws-exports';
import { API } from 'aws-amplify';

export class OpenOrdersTable extends Component {
  state = {
    orders: []
  }


  async getAirtableOrders() {

    const apiName = 'w4madata'; //'w4madata'; // FIXME
    const path = '/orders';
    const myInit = { // OPTIONAL
        response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
        queryStringParameters: {  // OPTIONAL
            key1: 'value1',
        },
    };

    const orders = await API
      .get(apiName, path, myInit)
      .then(response => {
        // Add your code here
        console.log("======= response: ======", response)
        return response
      })
      .catch(error => {
        console.log("^^^^^^^^^^^^^^^ errror", error)
        console.log(error.response);
     });

    this.setState({orders})
    /*const orders = await base("orders").select().all()
      .then( r => {return r});
    this.setState({orders});*/
  }

  async componentDidMount(){

    await this.getAirtableOrders()

  }

  render() {

    const {orders} = this.state
    // const {orders} =  {orders: [123]}
    return (
      JSON.stringify(orders)
    )
  }
}

export default OpenOrdersTable
