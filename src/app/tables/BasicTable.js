import React, { Component } from 'react'
import { ProgressBar } from 'react-bootstrap';


// TODO store the API key in aws secrets manager
/*
// Load the AWS SDK
var AWS = require('aws-sdk'),
    region = "us-east-1",
    secretName = "airtable/credentials/apiKey",
    secret,
    decodedBinarySecret;

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
    region: region
});

// In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
// See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
// We rethrow the exception by default.

client.getSecretValue({SecretId: secretName}, function(err, data) {
    if (err) {
        if (err.code === 'DecryptionFailureException')
            // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InternalServiceErrorException')
            // An error occurred on the server side.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidParameterException')
            // You provided an invalid value for a parameter.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidRequestException')
            // You provided a parameter value that is not valid for the current state of the resource.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'ResourceNotFoundException')
            // We can't find the resource that you asked for.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
    }
    else {
        // Decrypts secret using the associated KMS CMK.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ('SecretString' in data) {
            secret = data.SecretString;
        } else {
            let buff = new Buffer(data.SecretBinary, 'base64');
            decodedBinarySecret = buff.toString('ascii');
        }
    }

    // Your code goes here.
});

*/

export class OpenOrdersTable extends Component {
  state = {
    orders: []
  }
  async fetchAirtable() {
    var Airtable = require('airtable');
    var apiKey = "XXXXXXXXX" // FIXME

    Airtable.configure({ apiKey: apiKey })

    console.log("=== componentDidMount === ")
    var base = Airtable.base('appMSgZejI6f64OwM');

    const orders = await base("orders").select().all()
      .then( r => {return r});
    this.setState({orders});
  }

  async componentDidMount(){

    await this.fetchAirtable()

  }

  render() {

    const {orders} = this.state
    return (
      JSON.stringify(orders)
    )
  }
}

export default OpenOrdersTable
