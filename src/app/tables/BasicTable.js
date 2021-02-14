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

    // create the table rows in a loop
    let tableRows = []
    let order
    for (var i = 0; i < orders.length; i++) {
        order = orders[i].fields

        tableRows.push(
          <tr>
            <td>{order.order_id}</td>
            <td>{order.first_name}</td>
            <td>{order.delivery_date}</td>
            <td>{order.language}</td>
            <td>
              <i className="input-helper"></i>
            </td>
            <td><label className="badge badge-warning">{order.order_status}</label></td>

            <td><a href={"/order/" + order.order_id} target="_blank"> <i className="mdi mdi-open-in-new"></i></a></td>
          </tr>
          )
          ;
    }
    return (

      <div>
        <div className="row">

          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">In-progress Orders</h4>
                <p className="card-description">All open orders that have not yet been delivered
                </p>
                <div className="table-responsive">
                <table className="table table-hover">
                <thead>
                      <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Delivery Date</th>
                        <th>Language</th>
                        <th>Urgent</th>
                        <th>Order status</th>
                        <th>View order</th>
                      </tr>
                    </thead>
                    <tbody>
                    {tableRows}
                    </tbody>
                 </table>
               </div>
             </div>
           </div>
         </div>

       </div>
     </div>
    );
  }
}

export default OpenOrdersTable
