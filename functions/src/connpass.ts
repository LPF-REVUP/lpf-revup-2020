import axios from 'axios'
import { APIGatewayProxyEvent } from 'aws-lambda'

export async function handler(event: APIGatewayProxyEvent) {
  const axiosResponse = await axios.get('https://connpass.com/api/v1/event', {
    params: event.queryStringParameters
  })

  return {
    statusCode: 200,
    body: JSON.stringify(axiosResponse.data)
  }
}
