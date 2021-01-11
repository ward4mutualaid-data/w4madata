import React, { Component } from 'react'
import { ProgressBar } from 'react-bootstrap';
import awsmobile from '../../aws-exports';

export class OpenOrdersTable extends Component {
  state = {
    orders: []
  }

  async getAirtableApiKey() {
    // Load the AWS SDK
    var AWS = require('aws-sdk')

    AWS.config.update({
      region: awsmobile.aws_cognito_region,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: awsmobile.aws_cognito_identity_pool_id
      })
    });

    var region = "us-east-1"
    var secretName = "airtable/credentials/apiKey"
    var secret
    var decodedBinarySecret;

    // Create a Secrets Manager client
    var client = new AWS.SecretsManager({
        region: region
    });

    client.getSecretValue({SecretId: secretName}, function(err, data){
      if (err) {
        throw err;
      } else {
        console.log("===== SECRET DATA ====", data)
          // Decrypts secret using the associated KMS CMK.
          // Depending on whether the secret is a string or binary, one of these fields will be populated.
          if ('SecretString' in data) {
              return data.SecretString;
          } else {
              let buff = new Buffer(data.SecretBinary, 'base64');
              return buff.toString('ascii');
          }
      }
    })

  }

  async fetchAirtable() {
    var Airtable = require('airtable');
    var apiKey = await this.getAirtableApiKey()
    console.log("got apiKey", apiKey)
    Airtable.configure({ apiKey: apiKey })

    console.log("=== componentDidMount === ")
    var base = Airtable.base('appMSgZejI6f64OwM');

    const orders = await base("orders").select().all()
      .then( r => {return r});
    this.setState({orders});
  }

  async componentDidMount(){

    // await this.fetchAirtable()

  }

  render() {

    const {orders} = {orders: [123]}// this.state
    return (
      JSON.stringify(orders)
    )
  }
}

export default OpenOrdersTable
