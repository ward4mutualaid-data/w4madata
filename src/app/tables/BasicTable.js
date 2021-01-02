import React, { Component } from 'react'
import { ProgressBar } from 'react-bootstrap';

/*
TODO - add table filtering via react
create order/<id> page with comments & search bar

Should be able to set status if you have certain privs -- How to show read only status vs dropdown safely?
* probably with cognito sdk + conditional rendering through react
*/

export class BasicTable extends Component {
  render() {
    return (
      <div>
        <div className="row">

          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">In-progress Orders</h4>
                <p className="card-description">All open orders that have not been delivered
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
                      <tr>
                        <td>1001</td>
                        <td>Anna P.</td>
                        <td>2020-01-06</td>
                        <td>English</td>
                        <td>
                          <i className="input-helper"></i>
                        </td>
                        <td><label className="badge badge-warning">Shopping</label></td>

                        <td><a href="/order/xxx" target="_blank"> <i className="mdi mdi-open-in-new"></i></a></td>
                      </tr>

                      <tr>
                        <td>1002</td>
                        <td>Aaron M.</td>
                        <td>2020-01-06</td>
                        <td>English</td>
                        <td>
                          <label className="badge badge-danger">Urgent</label>
                        </td>
                        <td><label className="badge badge-primary">En route</label></td>

                        <td><a href="/order/xxx" target="_blank"> <i className="mdi mdi-open-in-new"></i></a></td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default BasicTable
