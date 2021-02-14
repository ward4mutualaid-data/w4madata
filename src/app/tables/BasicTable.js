import React, { Component } from 'react'
import { ProgressBar } from 'react-bootstrap';
import awsmobile from '../../aws-exports';
import { API } from 'aws-amplify';

export class OpenOrdersTable extends Component {
  state = {
    orders: []
  }


  async getAirtableOrders() {

    const apiName = 'w4madata'; // FIXME
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
        console.log("retrieved response from airtable")
        return response.data.body.records
      })
      .catch(error => {
        console.log("ERROR RETRIEVING DATA", error)
        console.log(error.response);
     });

    this.setState({orders})
  }

  async componentDidMount(){

    await this.getAirtableOrders()

  }

  render() {

    const {orders} = this.state

    return orders.map((x, index) => (

      <tr>
        <td>{x.fields.id}</td>
        <td>{x.fields.first_name}</td>
        <td>{x.fields.delivery_date}</td>
        <td>{x.fields.language}</td>
        <td>
          <i className="input-helper"></i>
        </td>
        <td><label className="badge badge-warning">{x.fields.order_status}</label></td>

        <td><a href="/order/xxx" target="_blank"> <i className="mdi mdi-open-in-new"></i></a></td>
      </tr>

    ));
  }
}

export default OpenOrdersTable
